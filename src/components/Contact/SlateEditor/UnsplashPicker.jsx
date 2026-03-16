import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';

const UNSPLASH_ACCESS_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
const PER_PAGE = 12;

const UnsplashPicker = ({ isOpen, onSelect, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const inputRef = useRef(null);
  const overlayRef = useRef(null);
  const hasFetchedInitial = useRef(false);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, urlMode]);

  // Load curated/trending photos when picker opens
  useEffect(() => {
    if (isOpen && UNSPLASH_ACCESS_KEY && !urlMode && !hasFetchedInitial.current) {
      hasFetchedInitial.current = true;
      fetchCurated(1);
    }
  }, [isOpen, urlMode]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const fetchCurated = async (pageNum = 1) => {
    if (!UNSPLASH_ACCESS_KEY) return;
    setLoading(true);
    setError(null);
    setIsSearchMode(false);

    try {
      const res = await fetch(
        `https://api.unsplash.com/photos?page=${pageNum}&per_page=${PER_PAGE}&order_by=popular`,
        {
          headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
        }
      );
      if (!res.ok) throw new Error(`Unsplash API error: ${res.status}`);
      const data = await res.json();

      if (pageNum === 1) {
        setResults(data);
      } else {
        setResults((prev) => [...prev, ...data]);
      }
      setHasMore(data.length === PER_PAGE);
      setPage(pageNum);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
          {
            headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
          }
        );
        if (!res.ok) throw new Error(`Unsplash API error: ${res.status}`);
        const data = await res.json();

        if (pageNum === 1) {
          setResults(data.results);
        } else {
          setResults((prev) => [...prev, ...data.results]);
        }
        setHasMore(pageNum < data.total_pages);
        setPage(pageNum);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      searchUnsplash(query, 1);
    }
  };

  const handleLoadMore = () => {
    if (isSearchMode) {
      searchUnsplash(query, page + 1);
    } else {
      fetchCurated(page + 1);
    }
  };

  const handleSelectImage = (photo) => {
    // Use regular size for embedding, give attribution
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

  const reset = () => {
    setQuery('');
    setResults([]);
    setError(null);
    setPage(1);
    setHasMore(false);
    setIsSearchMode(false);
    hasFetchedInitial.current = false;
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
      reset();
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      ref={overlayRef}
      className="unsplash-overlay"
      onMouseDown={handleOverlayClick}
    >
      <div className="unsplash-picker">
        {/* Header */}
        <div className="unsplash-header">
          <span className="unsplash-title">
            {urlMode ? 'Insert Image URL' : 'Unsplash Photos'}
          </span>
          <div className="unsplash-header-actions">
            <button
              type="button"
              className="unsplash-toggle-mode"
              onClick={() => setUrlMode(!urlMode)}
            >
              {urlMode ? 'Browse Unsplash' : 'Paste URL'}
            </button>
            <button
              type="button"
              className="unsplash-close"
              onClick={() => {
                onClose();
                reset();
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {urlMode ? (
          /* Manual URL mode */
          <form className="unsplash-url-form" onSubmit={handleManualSubmit}>
            <input
              ref={inputRef}
              type="url"
              className="unsplash-search-input"
              placeholder="https://example.com/image.jpg"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
            />
            <button
              type="submit"
              className="unsplash-search-btn"
              disabled={!manualUrl.trim()}
            >
              INSERT
            </button>
          </form>
        ) : (
          /* Unsplash search mode */
          <>
            <form className="unsplash-search-form" onSubmit={handleSearch}>
              <input
                ref={inputRef}
                type="text"
                className="unsplash-search-input"
                placeholder="Search photos... (e.g. landscape, code, coffee)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                type="submit"
                className="unsplash-search-btn"
                disabled={loading || !query.trim()}
              >
                {loading && results.length === 0 ? '...' : 'SEARCH'}
              </button>
            </form>

            {error && <div className="unsplash-error">{error}</div>}

            {loading && results.length === 0 && (
              <div className="unsplash-loading">Loading photos...</div>
            )}

            {results.length > 0 && (
              <>
                {!isSearchMode && !query && (
                  <div className="unsplash-section-label">Trending photos</div>
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
                        alt={photo.alt_description || 'Unsplash photo'}
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
                    {loading ? 'Loading...' : 'Load more'}
                  </button>
                )}
              </>
            )}

            {!loading && results.length === 0 && isSearchMode && (
              <div className="unsplash-empty">
                No results. Try a different search term.
              </div>
            )}

            {results.length > 0 && (
              <div className="unsplash-attribution">
                Photos by{' '}
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
      </div>
    </div>,
    document.body
  );
};

export default UnsplashPicker;
