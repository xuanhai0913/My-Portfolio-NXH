import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useLocaleNavigation from '../../hooks/useLocaleNavigation';
import './VideoDemo.css';

// Import video
import llmsVideo from '../../videos/LLMs.mp4';

const VideoDemo = () => {
    const { t } = useTranslation('misc');
    const { localizePath } = useLocaleNavigation();
    const featuredProject = {
        title: "LLM-Powered Unit Test Generator",
        description: t('video.description'),
        videoSrc: llmsVideo,
        technologies: ["React", "Node.js", "DeepSeek AI", "Docker"],
        github: "https://github.com/xuanhai0913/LLM-Unit-tests"
    };

    return (
        <div className="video-demo-page">
            <Link to={localizePath('/')} className="back-btn">
                ← {t('video.back')}
            </Link>

            <div className="cinema-container">
                {/* Left: Video Player */}
                <div className="player-section">
                    <div className="monitor-frame">
                        <div className="screen-content">
                            <video controls className="cinema-video">
                                <source src={featuredProject.videoSrc} type="video/mp4" />
                                {t('video.unsupported')}
                            </video>
                            <div className="live-tag">{t('video.livePreview')}</div>
                        </div>
                    </div>
                </div>

                {/* Right: Info Panel */}
                <div className="info-panel">
                    <div className="project-meta">{t('video.featured')}</div>
                    <h1 className="project-hero-title">{featuredProject.title}</h1>
                    <p className="project-detail">{featuredProject.description}</p>

                    <div className="tech-row">
                        {featuredProject.technologies.map((t, i) => (
                            <span key={i} className="tech-pill">{t}</span>
                        ))}
                    </div>

                    <a
                        href={featuredProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-github-cinema"
                    >
                        {t('video.source')} ↗
                    </a>
                </div>
            </div>
        </div>
    );
};

export default VideoDemo;
