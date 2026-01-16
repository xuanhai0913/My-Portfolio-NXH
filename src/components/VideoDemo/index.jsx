import React from 'react';
import { Link } from 'react-router-dom';
import './VideoDemo.css';

// Import video
import llmsVideo from '../../videos/LLMs.mp4';

const VideoDemo = () => {
    const videos = [
        {
            id: 1,
            title: "LLM-Powered Unit Test Generator",
            description: "Demo showcasing the AI-powered unit test generator that uses Deepseek LLM to automatically generate comprehensive unit tests from source code. Supports Python, JavaScript, and TypeScript with multiple testing frameworks.",
            videoSrc: llmsVideo,
            technologies: ["React", "Node.js", "Deepseek AI", "Monaco Editor", "Vite"],
            github: "https://github.com/xuanhai0913/LLM-Unit-tests"
        }
    ];

    return (
        <div className="video-demo-page">
            <div className="video-demo-header">
                <Link to="/" className="back-button">
                    <i className="fas fa-arrow-left"></i>
                    <span>Back to Portfolio</span>
                </Link>
                <h1>Project Demos</h1>
                <p className="header-subtitle">Watch live demonstrations of my projects</p>
            </div>

            <div className="video-demo-content">
                {videos.map((video) => (
                    <div key={video.id} className="video-card">
                        <div className="video-container">
                            <video
                                controls
                                preload="metadata"
                                poster=""
                            >
                                <source src={video.videoSrc} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                        <div className="video-info">
                            <h2>{video.title}</h2>
                            <p>{video.description}</p>
                            <div className="video-technologies">
                                {video.technologies.map((tech, index) => (
                                    <span key={index} className="tech-badge">{tech}</span>
                                ))}
                            </div>
                            <div className="video-links">
                                <a
                                    href={video.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="github-link"
                                >
                                    <i className="fab fa-github"></i>
                                    <span>View Source Code</span>
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoDemo;
