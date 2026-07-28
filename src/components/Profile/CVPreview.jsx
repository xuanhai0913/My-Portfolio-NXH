import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './homeTranslations';
import './styles/CVPreview.css';

const CV_VISUAL_URL = 'https://my-portfolio-nxh.vercel.app/CV_NguyenXuanHai_visual.pdf';

const CVPreview = ({ onClose }) => {
    const { t } = useTranslation('home');
    const [loading, setLoading] = useState(true);
    const closeButtonRef = useRef(null);

    useEffect(() => {
        const previouslyFocused = document.activeElement;
        document.body.style.overflow = 'hidden';
        closeButtonRef.current?.focus();

        const closeOnEscape = (event) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', closeOnEscape);

        return () => {
            window.removeEventListener('keydown', closeOnEscape);
            document.body.style.overflow = 'unset';
            previouslyFocused?.focus();
        };
    }, [onClose]);

    const handleLoad = () => {
        setLoading(false);
    };

    return (
        <div className="cv-preview-overlay" onClick={onClose} role="presentation">
            <div
                className="cv-preview-container"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="cv-preview-title"
            >
                <div className="cv-preview-header">
                    <h3 id="cv-preview-title" className="cv-preview-title">{t('cvPreview.title')}</h3>
                    <div className="cv-actions">
                        <a
                            href={CV_VISUAL_URL}
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

                <div className="cv-preview-body">
                    {loading && (
                        <div className="cv-loading">
                            <div className="loading-spinner"></div>
                            <span>{t('cvPreview.loading')}</span>
                        </div>
                    )}
                    <iframe
                        src={CV_VISUAL_URL}
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
