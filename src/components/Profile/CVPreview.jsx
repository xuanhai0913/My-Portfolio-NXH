import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './homeTranslations';
import './styles/CVPreview.css';

const CV_VISUAL_URLS = {
    en: 'https://my-portfolio-nxh.vercel.app/CV_NguyenXuanHai_visual.pdf',
    vi: 'https://my-portfolio-nxh.vercel.app/CV_NguyenXuanHai_visual_vi.pdf',
};
const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'iframe',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(', ');

const getFocusableElements = (container) => (
    Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter((element) => (
        element.tabIndex >= 0
        && !element.hasAttribute('hidden')
        && element.getAttribute('aria-hidden') !== 'true'
        && element.getAttribute('type') !== 'hidden'
    ))
);

const CVPreview = ({ onClose }) => {
    const { t, i18n } = useTranslation('home');
    const [loading, setLoading] = useState(true);
    const dialogRef = useRef(null);
    const closeButtonRef = useRef(null);
    const onCloseRef = useRef(onClose);
    const visualCvUrl = i18n.resolvedLanguage?.startsWith('vi')
        ? CV_VISUAL_URLS.vi
        : CV_VISUAL_URLS.en;

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        setLoading(true);
    }, [visualCvUrl]);

    useEffect(() => {
        const previouslyFocused = document.activeElement;
        const previousBodyOverflow = document.body.style.overflow;
        const previousDocumentOverflow = document.documentElement.style.overflow;

        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        closeButtonRef.current?.focus();

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onCloseRef.current();
                return;
            }

            if (event.key !== 'Tab') return;

            const dialog = dialogRef.current;
            if (!dialog) return;

            const focusableElements = getFocusableElements(dialog);
            if (focusableElements.length === 0) {
                event.preventDefault();
                dialog.focus();
                return;
            }

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (!dialog.contains(document.activeElement)) {
                event.preventDefault();
                (event.shiftKey ? lastElement : firstElement).focus();
            } else if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        };

        const keepFocusInDialog = (event) => {
            const dialog = dialogRef.current;
            if (dialog && !dialog.contains(event.target)) {
                closeButtonRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('focusin', keepFocusInDialog);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('focusin', keepFocusInDialog);
            document.body.style.overflow = previousBodyOverflow;
            document.documentElement.style.overflow = previousDocumentOverflow;

            if (previouslyFocused?.isConnected && typeof previouslyFocused.focus === 'function') {
                previouslyFocused.focus();
            }
        };
    }, []);

    const handleLoad = () => {
        setLoading(false);
    };

    return (
        <div
            className="cv-preview-overlay"
            data-lenis-prevent
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div
                ref={dialogRef}
                className="cv-preview-container"
                role="dialog"
                aria-modal="true"
                aria-labelledby="cv-preview-title"
                tabIndex="-1"
            >
                <div className="cv-preview-header">
                    <h3 id="cv-preview-title" className="cv-preview-title">{t('cvPreview.title')}</h3>
                    <div className="cv-actions">
                        <a
                            href={visualCvUrl}
                            download
                            className="cv-download-btn"
                            aria-label={t('cvPreview.downloadAria')}
                        >
                            {t('cvPreview.download')}
                        </a>
                        <button
                            ref={closeButtonRef}
                            type="button"
                            className="cv-close-btn"
                            onClick={onClose}
                            aria-label={t('cvPreview.closeAria')}
                        >
                            ×
                        </button>
                    </div>
                </div>

                <div className="cv-preview-body" aria-busy={loading}>
                    {loading && (
                        <div className="cv-loading" role="status" aria-live="polite">
                            <div className="loading-spinner" aria-hidden="true"></div>
                            <span>{t('cvPreview.loading')}</span>
                        </div>
                    )}
                    <iframe
                        src={visualCvUrl}
                        title={t('cvPreview.iframeTitle')}
                        className="cv-iframe"
                        onLoad={handleLoad}
                    />
                </div>
            </div>
        </div>
    );
};

export default CVPreview;
