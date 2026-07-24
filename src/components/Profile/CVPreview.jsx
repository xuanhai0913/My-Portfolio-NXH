import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './homeTranslations';
import './styles/CVPreview.css';

const CV_VISUAL_URL = 'https://my-portfolio-nxh.vercel.app/CV_NguyenXuanHai_visual.pdf';

const CVPreview = ({ onClose }) => {
    const { t } = useTranslation('home');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Lock body scroll when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleLoad = () => {
        setLoading(false);
    };

    return (
        <div className="cv-preview-overlay" onClick={onClose}>
            <div
                className="cv-preview-container"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="cv-preview-title"
                aria-label={t('cvPreview.dialogAria')}
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
                        <button className="cv-close-btn" onClick={onClose} aria-label={t('cvPreview.closeAria')}>×</button>
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
