import React from 'react';
import { Link } from 'react-router-dom';
import './VideoDemo.css';

// Import video
import llmsVideo from '../../videos/LLMs.mp4';

const VideoDemo = () => {
    const featuredProject = {
        title: "LLM-Powered Unit Test Generator",
        description: "An automated testing utility utilizing DeepSeek LLM to generate coverage-focused unit tests. Parses ASTs to identify edge cases and mocks external dependencies automatically.",
        videoSrc: llmsVideo,
        technologies: ["React", "Node.js", "DeepSeek AI", "Docker"],
        github: "https://github.com/xuanhai0913/LLM-Unit-tests"
    };

    return (
        <div className="video-demo-page">
            <Link to="/" className="back-btn">
                ← BACK TO PORTFOLIO
            </Link>

            <div className="cinema-container">
                {/* Left: Video Player */}
                <div className="player-section">
                    <div className="monitor-frame">
                        <div className="screen-content">
                            <video controls className="cinema-video">
                                <source src={featuredProject.videoSrc} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <div className="live-tag">LIVE_PREVIEW</div>
                        </div>
                    </div>
                </div>

                {/* Right: Info Panel */}
                <div className="info-panel">
                    <div className="project-meta">FEATURED_PROJECT_01</div>
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
                        VIEW SOURCE CODE ↗
                    </a>
                </div>
            </div>
        </div>
    );
};

export default VideoDemo;
