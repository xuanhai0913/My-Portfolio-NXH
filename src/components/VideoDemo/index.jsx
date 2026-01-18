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
            {/* Header */}
            <header className="demo-header">
                <div className="demo-nav">
                    <Link to="/" className="back-link">
                        <i className="fas fa-arrow-left"></i>
                        <span>BACK TO PORTFOLIO</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <section className="demo-section">
                <div className="demo-container">
                    {/* Giant Title */}
                    <h1 className="demo-title">
                        PROJECT <br /> DEMOS
                    </h1>

                    {/* Featured Project */}
                    <div className="featured-grid">
                        {/* Video Player */}
                        <div className="video-wrapper">
                            <div className="video-frame">
                                <div className="live-badge">
                                    <div className="pulse-dot"></div>
                                    LIVE_PREVIEW
                                </div>
                                <div className="video-container">
                                    <video
                                        controls
                                        preload="metadata"
                                        className="video-player"
                                    >
                                        <source src={featuredProject.videoSrc} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            </div>
                        </div>

                        {/* Project Info */}
                        <div className="project-info">
                            <div className="project-tag">FEATURED_PROJECT_01</div>
                            <h2 className="project-title">{featuredProject.title}</h2>
                            <div className="project-description">
                                {featuredProject.description}
                            </div>
                            <div className="tech-tags">
                                {featuredProject.technologies.map((tech, index) => (
                                    <span key={index} className="tech-tag">{tech}</span>
                                ))}
                            </div>
                            <a
                                href={featuredProject.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="github-btn"
                            >
                                <span className="btn-shadow"></span>
                                <span className="btn-content">
                                    <i className="fab fa-github"></i> VIEW SOURCE CODE
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default VideoDemo;
