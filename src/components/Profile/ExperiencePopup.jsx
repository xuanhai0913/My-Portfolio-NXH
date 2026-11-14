import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { WORK_EXPERIENCE } from '../../utils/constants';
import './homeTranslations';

const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
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

const ExperiencePopup = ({ onClose }) => {
    const { t } = useTranslation('home');
    const dialogRef = useRef(null);
    const closeButtonRef = useRef(null);
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

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

    return (
        <div
            className="experience-popup-overlay"
            data-lenis-prevent
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div
                ref={dialogRef}
                className="experience-popup-content"
                role="dialog"
                aria-modal="true"
                aria-labelledby="experience-popup-title"
                tabIndex="-1"
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

                <ul className="popup-list">
                    {WORK_EXPERIENCE.map(job => (
                        <li key={job.id} className="popup-item">
                            <div className="popup-item-header">
                                <span className="popup-company">{t(`records.${job.id}.company`, { ns: 'experience', defaultValue: job.company })}</span>
                                <span className="popup-duration">{t(`records.${job.id}.role`, { ns: 'experience', defaultValue: job.role })}</span>
                            </div>
                            <div className="popup-period">{t(`records.${job.id}.period`, { ns: 'experience', defaultValue: job.period })}</div>
                        </li>
                    ))}
                </ul>

                <div className="popup-footer">
                    <div className="total-exp">
                        <span>{t('experience.companyExperience')}</span>
                        <span className="popup-company-count">{t('experience.companyCount', { count: WORK_EXPERIENCE.length })}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExperiencePopup;
