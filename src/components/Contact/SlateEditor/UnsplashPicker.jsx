import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';

const UNSPLASH_ACCESS_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
const PER_PAGE = 12;

const TABS = { UNSPLASH: 'unsplash', UPLOAD: 'upload', URL: 'url' };

const CATEGORIES = [
  { key: 'trending', icon: '🔥' },
  { key: 'nature', icon: '🌿' },
  { key: 'technology', icon: '💻' },
  { key: 'architecture', icon: '🏛' },
  { key: 'people', icon: '👤' },
  { key: 'animals', icon: '🐾' },
  { key: 'food', icon: '☕' },
  { key: 'travel', icon: '✈️' },
  { key: 'business', icon: '💼' },
  { key: 'textures', icon: '🎨' },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const UnsplashPicker = ({ isOpen, onSelect, onClose }) => {
  const { t } = useTranslation('contact');
  const [activeTab, setActiveTab] = useState(TABS.UNSPLASH);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('trending');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadPreview, setUploadPreview] = useState(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const overlayRef = useRef(null);
  const hasFetchedInitial = useRef(false);

  // Focus input when opened or tab changes
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, activeTab]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const fetchCurated = useCallback(async (pageNum = 1) => {
    if (!UNSPLASH_ACCESS_KEY) return;
    setLoading(true);
    setError(null);
    setIsSearchMode(false);

    try {
      const res = await fetch(
        `https://api.unsplash.com/photos?page=${pageNum}&per_page=${PER_PAGE}&order_by=popular`,
        { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
      );
      if (!res.ok) {
        const apiError = new Error('Unsplash API error');
        apiError.status = res.status;
        throw apiError;
      }
      const data = await res.json();

      if (pageNum === 1) {
        setResults(data);
      } else {
        setResults((prev) => [...prev, ...data]);
      }
      setHasMore(data.length === PER_PAGE);
      setPage(pageNum);
    } catch (err) {
      setError(
        err.status
          ? t('imagePicker.errors.api', { status: err.status })
          : t('imagePicker.errors.load')
      );
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Load initial photos when the picker first opens on the Unsplash tab.
  useEffect(() => {
    if (isOpen && UNSPLASH_ACCESS_KEY && activeTab === TABS.UNSPLASH && !hasFetchedInitial.current) {
      hasFetchedInitial.current = true;
      fetchCurated(1);
    }
  }, [isOpen, activeTab, fetchCurated]);

  const searchUnsplash = useCallback(
    async (searchQuery, pageNum = 1) => {
      if (!UNSPLASH_ACCESS_KEY || !searchQuery.trim()) return;
      setLoading(true);
      setError(null);
      setIsSearchMode(true);

      try {
        const res = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
            searchQuery
          )}&page=${pageNum}&per_page=${PER_PAGE}&orientation=landscape`,
          { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
        );
        if (!res.ok) {
          const apiError = new Error('Unsplash API error');
          apiError.status = res.status;
          throw apiError;
        }
        const data = await res.json();

        if (pageNum === 1) {
          setResults(data.results);
        } else {
          setResults((prev) => [...prev, ...data.results]);
        }
        setHasMore(pageNum < data.total_pages);
        setPage(pageNum);
      } catch (err) {
        setError(
          err.status
            ? t('imagePicker.errors.api', { status: err.status })
            : t('imagePicker.errors.load')
        );
      } finally {
        setLoading(false);
      }
    },
    [t]
  );

  const handleCategoryClick = (categoryKey) => {
    setActiveCategory(categoryKey);
    setQuery('');
    if (categoryKey === 'trending') {
      setResults([]);
      hasFetchedInitial.current = false;
      fetchCurated(1);
    } else {
      searchUnsplash(categoryKey, 1);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setActiveCategory(null);
      searchUnsplash(query, 1);
    }
  };

  const handleLoadMore = () => {
    if (isSearchMode) {
      const term = query.trim() || activeCategory;
      searchUnsplash(term, page + 1);
    } else {
      fetchCurated(page + 1);
    }
  };

  const handleSelectImage = (photo) => {
    onSelect(photo.urls.regular, photo.user?.name, photo.links?.html);
    onClose();
    reset();
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualUrl.trim()) {
      onSelect(manualUrl.trim());
      onClose();
      setManualUrl('');
    }
  };

  // ── File upload handlers ──
  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError(t('imagePicker.errors.fileType'));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError(t('imagePicker.errors.fileSize'));
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadPreview({ url: e.target.result, name: file.name, size: file.size });
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e) => {
    processFile(e.target.files?.[0]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const handleUploadInsert = () => {
    if (uploadPreview) {
      onSelect(uploadPreview.url);
      onClose();
      reset();
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const reset = () => {
    setQuery('');
    setResults([]);
    setError(null);
    setPage(1);
    setHasMore(false);
    setIsSearchMode(false);
    setActiveCategory('trending');
    setUploadPreview(null);
    setDragActive(false);
    setManualUrl('');
    hasFetchedInitial.current = false;
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
      reset();
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError(null);
    if (tab === TABS.UNSPLASH && results.length === 0) {
      hasFetchedInitial.current = false;
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      ref={overlayRef}
      className="unsplash-overlay"
      onMouseDown={handleOverlayClick}
      role="presentation"
    >
      <div className="unsplash-picker" role="dialog" aria-modal="true" aria-label={t('imagePicker.title')}>
        {/* Header */}
        <div className="unsplash-header">
          <span className="unsplash-title">{t('imagePicker.title')}</span>
          <button
            type="button"
            className="unsplash-close"
            onClick={() => { onClose(); reset(); }}
            aria-label={t('imagePicker.closeAria')}
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="picker-tabs">
          <button
            type="button"
            className={`picker-tab ${activeTab === TABS.UNSPLASH ? 'active' : ''}`}
            onClick={() => switchTab(TABS.UNSPLASH)}
          >
            <span className="picker-tab-icon">🖼</span> Unsplash
          </button>
          <button
            type="button"
            className={`picker-tab ${activeTab === TABS.UPLOAD ? 'active' : ''}`}
            onClick={() => switchTab(TABS.UPLOAD)}
          >
            <span className="picker-tab-icon">📁</span> {t('imagePicker.tabs.upload')}
          </button>
          <button
            type="button"
            className={`picker-tab ${activeTab === TABS.URL ? 'active' : ''}`}
            onClick={() => switchTab(TABS.URL)}
          >
            <span className="picker-tab-icon">🔗</span> URL
          </button>
        </div>

        {/* ── TAB: Unsplash ── */}
        {activeTab === TABS.UNSPLASH && (
          <>
            {/* Category chips */}
            <div className="unsplash-categories">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  className={`unsplash-category-chip ${activeCategory === cat.key ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(cat.key)}
                >
                  <span className="category-chip-icon">{cat.icon}</span>
                  {t(`imagePicker.categories.${cat.key}`)}
                </button>
              ))}
            </div>

            {/* Search */}
            <form className="unsplash-search-form" onSubmit={handleSearch}>
              <input
                ref={inputRef}
                type="text"
                className="unsplash-search-input"
                placeholder={t('imagePicker.searchPlaceholder')}
                aria-label={t('imagePicker.searchAria')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                type="submit"
                className="unsplash-search-btn"
                disabled={loading || !query.trim()}
              >
                {loading && results.length === 0 ? '...' : t('imagePicker.search')}
              </button>
            </form>

            {error && <div className="unsplash-error">{error}</div>}

            {loading && results.length === 0 && (
              <div className="unsplash-loading">{t('imagePicker.loadingPhotos')}</div>
            )}

            {results.length > 0 && (
              <>
                {!isSearchMode && activeCategory === 'trending' && (
                  <div className="unsplash-section-label">{t('imagePicker.trendingPhotos')}</div>
                )}
                {isSearchMode && activeCategory && activeCategory !== 'trending' && (
                  <div className="unsplash-section-label">
                    {t(`imagePicker.categories.${activeCategory}`)}
                  </div>
                )}
                <div className="unsplash-grid">
                  {results.map((photo) => (
                    <div
                      key={photo.id}
                      className="unsplash-grid-item"
                      onClick={() => handleSelectImage(photo)}
                    >
                      <img
                        src={photo.urls.small}
                        alt={photo.alt_description || t('imagePicker.unsplashPhotoAlt')}
                        loading="lazy"
                      />
                      <div className="unsplash-photo-credit">
                        {photo.user?.name}
                      </div>
                    </div>
                  ))}
                </div>

                {hasMore && (
                  <button
                    type="button"
                    className="unsplash-load-more"
                    onClick={handleLoadMore}
                    disabled={loading}
                  >
                    {loading ? t('imagePicker.loading') : t('imagePicker.loadMore')}
                  </button>
                )}
              </>
            )}

            {!loading && results.length === 0 && isSearchMode && (
              <div className="unsplash-empty">
                {t('imagePicker.noResults')}
              </div>
            )}

            {results.length > 0 && (
              <div className="unsplash-attribution">
                {t('imagePicker.photosBy')}{' '}
                <a
                  href="https://unsplash.com/?utm_source=portfolio&utm_medium=referral"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Unsplash
                </a>
              </div>
            )}
          </>
        )}

        {/* ── TAB: Upload ── */}
        {activeTab === TABS.UPLOAD && (
          <div className="upload-tab-content">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="upload-file-input"
              aria-label={t('imagePicker.chooseFileAria')}
            />

            {!uploadPreview ? (
              <div
                className={`upload-dropzone ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="upload-dropzone-icon">📤</div>
                <div className="upload-dropzone-text">
                  {t('imagePicker.dropzone.title')}
                </div>
                <div className="upload-dropzone-subtext">
                  {t('imagePicker.dropzone.subtitle')}
                </div>
                <div className="upload-dropzone-hint">
                  {t('imagePicker.dropzone.hint')}
                </div>
              </div>
            ) : (
              <div className="upload-preview">
                <img
                  src={uploadPreview.url}
                  alt={t('imagePicker.uploadPreviewAlt')}
                  className="upload-preview-img"
                />
                <div className="upload-preview-info">
                  <span className="upload-preview-name">{uploadPreview.name}</span>
                  <span className="upload-preview-size">{formatSize(uploadPreview.size)}</span>
                </div>
                <div className="upload-preview-actions">
                  <button
                    type="button"
                    className="upload-btn-change"
                    onClick={() => {
                      setUploadPreview(null);
                      fileInputRef.current.value = '';
                    }}
                  >
                    {t('imagePicker.change')}
                  </button>
                  <button
                    type="button"
                    className="upload-btn-insert"
                    onClick={handleUploadInsert}
                  >
                    {t('imagePicker.insertImage')}
                  </button>
                </div>
              </div>
            )}

            {error && <div className="unsplash-error">{error}</div>}
          </div>
        )}

        {/* ── TAB: URL ── */}
        {activeTab === TABS.URL && (
          <div className="url-tab-content">
            <form className="unsplash-url-form" onSubmit={handleManualSubmit}>
              <input
                ref={inputRef}
                type="url"
                className="unsplash-search-input"
                placeholder="https://example.com/image.jpg"
                aria-label={t('imagePicker.imageUrlAria')}
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
              />
              <button
                type="submit"
                className="unsplash-search-btn"
                disabled={!manualUrl.trim()}
              >
                {t('imagePicker.insert')}
              </button>
            </form>
            <div className="url-tab-hint">
              {t('imagePicker.urlHint')}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default UnsplashPicker;
