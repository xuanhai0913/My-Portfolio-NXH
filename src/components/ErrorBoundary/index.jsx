import React, { Component } from 'react';
import { useTranslation } from 'react-i18next';

const CHUNK_RELOAD_KEY = 'nxh:chunk-error-reload-attempted';
const CHUNK_ERROR_PATTERN = /chunkloaderror|loading (?:css )?chunk .* failed|css_chunk_load_failed|failed to fetch dynamically imported module|importing a module script failed|failed to load module script/i;

export const isChunkLoadError = (error) => {
  const name = error?.name || '';
  const message = error?.message || String(error || '');

  return CHUNK_ERROR_PATTERN.test(`${name} ${message}`);
};

export const canRetryChunkReload = () => {
  if (typeof window === 'undefined') return false;

  try {
    if (window.sessionStorage.getItem(CHUNK_RELOAD_KEY)) return false;
    window.sessionStorage.setItem(CHUNK_RELOAD_KEY, 'true');
    return true;
  } catch {
    return false;
  }
};

const refreshPage = () => {
  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.removeItem(CHUNK_RELOAD_KEY);
  } catch {
    // Storage can be unavailable in private browsing contexts.
  }

  window.location.reload();
};

const DefaultErrorFallback = () => {
  const { t } = useTranslation();

  return t('error.generic');
};

const ChunkLoadFallback = () => {
  const { t } = useTranslation();

  return (
    <>
      <p className="error-fallback__message">{t('error.newVersionAvailable')}</p>
      <button type="button" className="error-fallback__action" onClick={refreshPage}>
        {t('error.refreshPage')}
      </button>
    </>
  );
};

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (isChunkLoadError(error) && canRetryChunkReload()) {
      window.location.reload();
      return;
    }

    console.error('Component Error:', error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      const chunkLoadFailed = isChunkLoadError(this.state.error);

      return (
        <div className="error-fallback" role="alert">
          {chunkLoadFailed
            ? <ChunkLoadFallback />
            : (this.props.errorMessage || <DefaultErrorFallback />)}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
