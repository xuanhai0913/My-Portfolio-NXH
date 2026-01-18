import React, { useEffect, useRef } from 'react';
import './SectionTransition.css';

const SectionTransition = ({ text = "PROJECTS", fromSection, toSection }) => {
    const containerRef = useRef(null);
    const lettersRef = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const letters = text.split('');

    return (
        <div className="section-transition" ref={containerRef}>
            <div className="transition-bg">
                <div className="bg-circle bg-circle-1"></div>
                <div className="bg-circle bg-circle-2"></div>
                <div className="bg-line bg-line-1"></div>
                <div className="bg-line bg-line-2"></div>
                <div className="bg-line bg-line-3"></div>
            </div>

            <div className="transition-content">
                <div className="falling-text">
                    {letters.map((letter, index) => (
                        <span
                            key={index}
                            ref={(el) => (lettersRef.current[index] = el)}
                            className="falling-letter"
                            style={{
                                animationDelay: `${index * 0.08}s`,
                                '--random-x': `${(Math.random() - 0.5) * 100}px`,
                                '--random-rotate': `${(Math.random() - 0.5) * 60}deg`
                            }}
                        >
                            {letter === ' ' ? '\u00A0' : letter}
                        </span>
                    ))}
                </div>

                <div className="transition-arrow">
                    <div className="arrow-line"></div>
                    <div className="arrow-head"></div>
                </div>
            </div>
        </div>
    );
};

export default SectionTransition;
