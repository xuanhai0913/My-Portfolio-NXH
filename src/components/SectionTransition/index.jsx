import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './SectionTransition.css';
import KineticType from './KineticType';

const VideoMode = ({ videoSrc }) => {
    const { t } = useTranslation('misc');
    const sectionRef = useRef(null);
    const videoRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        const section = sectionRef.current;
        if (!video || !section) return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    video.play().catch(() => { });
                } else {
                    video.pause();
                }
            },
            { rootMargin: '200px 0px', threshold: 0.05 }
        );

        observer.observe(section);

        return () => {
            observer.disconnect();
            video.pause();
        };
    }, []);

    return (
        <div className="transition-container" ref={sectionRef}>
            <div className={`video-loader ${isLoaded ? 'hidden' : ''}`}>{t('transition.loading')}</div>
            <video
                ref={videoRef}
                className={`transition-video ${isLoaded ? 'visible' : ''}`}
                muted
                playsInline
                loop
                preload="none"
                src={videoSrc}
                onLoadedData={() => setIsLoaded(true)}
            />
        </div>
    );
};

const SectionTransition = ({ text, videoSrc }) => {
    if (!videoSrc) {
        return <KineticType text={text} />;
    }
    return <VideoMode videoSrc={videoSrc} />;
};

export default SectionTransition;
