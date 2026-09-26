import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { learnsprint } from '../../data/learnsprint';
import ProjectServices from '../ProjectServices';
import i18n from '../../i18n';
import enProjects from '../../i18n/locales/en/projects.json';
import viProjects from '../../i18n/locales/vi/projects.json';
import { useTranslation } from 'react-i18next';
import useLocaleNavigation from '../../hooks/useLocaleNavigation';
import './VideoDemo.css';

// Import video
import llmsVideo from '../../videos/LLMs.mp4';

i18n.addResourceBundle('en', 'projects', enProjects, true, true);
i18n.addResourceBundle('vi', 'projects', viProjects, true, true);

const VideoDemo = () => {
    const { t } = useTranslation('misc');
    const { localizePath } = useLocaleNavigation();
    const { t: projectText } = useTranslation('projects');
    const [params] = useSearchParams();
    const isLearnSprint = params.get('project') === 'learnsprint';
    const [playDemo, setPlayDemo] = useState(false);
    const featuredProject = isLearnSprint ? {
        ...learnsprint,
        title: projectText('items.learnsprint.title'),
        description: projectText('items.learnsprint.description'),
    } : {
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
                            {isLearnSprint ? (
                                playDemo ? <iframe className="cinema-video demo-embed" src={learnsprint.embed}
                                    title={projectText('learnsprint.play')} allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen /> :
                                <button type="button" className="demo-poster" onClick={() => setPlayDemo(true)}>
                                    <img src={learnsprint.image} alt="" width="1600" height="900" />
                                    <span>▶ {projectText('learnsprint.play')}</span>
                                </button>
                            ) : <video controls preload="metadata" className="cinema-video">
                                <source src={featuredProject.videoSrc} type="video/mp4" />
                                {t('video.unsupported')}
                            </video>}
                            {!isLearnSprint && <div className="live-tag">{t('video.livePreview')}</div>}
                        </div>
                    </div>
                </div>

                {/* Right: Info Panel */}
                <div className="info-panel">
                    <div className="project-meta">{isLearnSprint ? projectText('learnsprint.status') : t('video.featured')}</div>
                    <h1 className="project-hero-title">{featuredProject.title}</h1>
                    <p className="project-detail">{featuredProject.description}</p>

                    {isLearnSprint && <>
                        <a className="demo-event" href={learnsprint.competition} target="_blank" rel="noopener noreferrer">{learnsprint.competitionName} ↗</a>
                        <p className="project-detail">{projectText('learnsprint.track')}</p>
                        <p className="project-detail">{projectText('learnsprint.videoNote')}</p>
                        <ProjectServices services={learnsprint.services} />
                        <div className="demo-links">
                            <a href={learnsprint.submission} target="_blank" rel="noopener noreferrer">{projectText('actions.submission')} ↗</a>
                            <a href={learnsprint.demo} target="_blank" rel="noopener noreferrer">{projectText('actions.visitSite')} ↗</a>
                            <a href={learnsprint.youtube} target="_blank" rel="noopener noreferrer">YouTube ↗</a>
                        </div>
                        <p className="demo-boundaries">{projectText('learnsprint.limits')}</p>
                    </>}
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
