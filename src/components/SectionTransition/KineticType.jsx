import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './SectionTransition.css';

const KineticType = ({ text }) => {
    const { t } = useTranslation('misc');
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return undefined;

        let frameId = null;

        const updateProgress = () => {
            frameId = null;
            const rect = container.getBoundingClientRect();
            const start = window.innerHeight * 0.9;
            const end = window.innerHeight * 0.12;
            const rawProgress = (start - rect.top) / Math.max(start - end, 1);
            const progress = Math.max(0, Math.min(1, rawProgress));
            container.style.setProperty('--scroll-progress', progress.toFixed(4));
        };

        const requestUpdate = () => {
            if (frameId !== null) return;
            frameId = window.requestAnimationFrame(updateProgress);
        };

        window.addEventListener('scroll', requestUpdate, { passive: true });
        window.addEventListener('resize', requestUpdate);
        updateProgress();

        return () => {
            window.removeEventListener('scroll', requestUpdate);
            window.removeEventListener('resize', requestUpdate);
            if (frameId !== null) window.cancelAnimationFrame(frameId);
        };
    }, []);

    const characters = text.split('');

    return (
        <div
            className="kinetic-container simple-mode"
            ref={containerRef}
            style={{ '--char-count': Math.max(characters.length, 1) }}
        >
            <div className="kinetic-hline"></div>
            <div className="kinetic-vline"></div>

            <div className="geo-line line-left"></div>
            <div className="geo-line line-center"></div>
            <div className="geo-line line-right"></div>

            <div className="geo-circle circle-left"></div>
            <div className="geo-circle circle-right"></div>

            <div className="kinetic-chars-wrapper">
                {characters.map((char, i) => (
                    <span
                        key={`${char}-${i}`}
                        className="kinetic-char"
                        style={{ '--char-index': i, '--char-start': (i * 0.035).toFixed(3) }}
                    >
                        {char === ' ' ? '\u00a0' : char}
                    </span>
                ))}
            </div>

            <div className="kinetic-subtitle">
                <span className="subtitle-dash">—</span>
                <span>{t('transition.scroll')}</span>
                <span className="subtitle-dash">—</span>
            </div>

            <div className="scroll-arrow" aria-hidden="true">↓</div>
        </div>
    );
};

export default KineticType;
