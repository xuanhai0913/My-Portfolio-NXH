import React, { useState, useEffect } from 'react';
import './styles/CVPreview.css';

const CV_VISUAL_URL = 'https://my-portfolio-nxh.vercel.app/CV_NguyenXuanHai_visual.pdf';

const CVPreview = ({ onClose }) => {
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
            <div className="cv-preview-container" onClick={(e) => e.stopPropagation()}>
                <div className="cv-preview-header">
                    <h3 className="cv-preview-title">CV_PREVIEW.PDF</h3>
                    <div className="cv-actions">
                        <a
                            href={CV_VISUAL_URL}
                            download
                            className="cv-download-btn"
                        >
                            DOWNLOAD
                        </a>
                        <button className="cv-close-btn" onClick={onClose}>×</button>
                    </div>
                </div>

                <div className="cv-preview-body">
                    {loading && (
                        <div className="cv-loading">
                            <div className="loading-spinner"></div>
                            <span>LOADING_DOCUMENT...</span>
                        </div>
                    )}
                    <iframe
                        src={CV_VISUAL_URL}
                        title="CV Preview"
                        className="cv-iframe"
                        onLoad={handleLoad}
                    />
                </div>
            </div>
        </div>
    );
};

export default CVPreview;
