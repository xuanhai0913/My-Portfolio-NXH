import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { WORK_EXPERIENCE } from '../../utils/constants';
import './homeTranslations';

const ExperiencePopup = ({ onClose }) => {
    const { t } = useTranslation('home');
    const closeButtonRef = useRef(null);

    useEffect(() => {
        const previouslyFocused = document.activeElement;
        closeButtonRef.current?.focus();

        const closeOnEscape = (event) => {
            if (event.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', closeOnEscape);
        return () => {
            window.removeEventListener('keydown', closeOnEscape);
            previouslyFocused?.focus();
        };
    }, [onClose]);

    return (
        <div className="experience-popup-overlay" onClick={onClose} role="presentation">
            <div
                className="experience-popup-content"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="experience-popup-title"
            >
                <button
                    ref={closeButtonRef}
                    type="button"
                    className="popup-close-btn"
                    onClick={onClose}
                    aria-label={t('experience.closeAria')}
                >
                    ×
                </button>

                <h3 id="experience-popup-title" className="popup-title">{t('experience.title')}</h3>

                <div className="popup-list">
                    {WORK_EXPERIENCE.map((job, index) => (
                        <div key={index} className="popup-item">
                            <div className="popup-item-header">
                                <span className="popup-company">{t(`experience.jobs.${index}.company`, { defaultValue: job.company })}</span>
                                <span className="popup-duration">{t(`experience.jobs.${index}.role`, { defaultValue: job.role })}</span>
                            </div>
                            <div className="popup-period">{t(`experience.jobs.${index}.period`, { defaultValue: job.period })}</div>
                        </div>
                    ))}
                </div>

                <div className="popup-footer">
                    <div className="total-exp">
                        <span>{t('experience.companyExperience')}</span>
                        <span className="scramble-text">{t('experience.companyCount')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExperiencePopup;
