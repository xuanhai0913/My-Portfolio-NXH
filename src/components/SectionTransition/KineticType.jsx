import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './SectionTransition.css';

const KineticType = ({ text }) => {
    const { t } = useTranslation('misc');
    const containerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                setIsVisible(true);
                observer.disconnect();
            },
            { rootMargin: '100px 0px', threshold: 0.15 }
        );

        observer.observe(container);

        return () => observer.disconnect();
    }, []);

    const characters = text.split('');

    return (
        <div
            className={`kinetic-container simple-mode ${isVisible ? 'is-visible' : ''}`}
            ref={containerRef}
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
                    <span key={`${char}-${i}`} className="kinetic-char" style={{ '--char-index': i }}>
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
