import React from 'react';
import { Link } from 'react-router-dom';
import ScrollScene from '../ScrollScene';
import profileImage from '../../images/profile.png';
import './Hero3D.css';

const Hero3D = () => {
    return (
        <div className="hero3d-wrapper">
            {/* 3D Background with Scroll */}
            <ScrollScene>
                {/* Hero Section - Page 1 */}
                <section className="hero3d-section hero3d-page-1">
                    <div className="hero3d-content">
                        <h1 className="hero3d-title">
                            FULL-STACK <br />
                            <span className="hero3d-highlight">DEVELOPER</span>
                        </h1>
                        <div className="hero3d-description">
                            <p>
                                Building digital experiences with modern web technologies.
                                Passionate about creating innovative solutions.
                            </p>
                        </div>
                        <div className="hero3d-actions">
                            <a
                                href="/CV_NguyenXuanHai.pdf"
                                download="CV_NguyenXuanHai.pdf"
                                className="hero3d-btn"
                            >
                                DOWNLOAD CV <i className="fa-solid fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                    <div className="scroll-down-indicator">
                        <span>SCROLL</span>
                        <div className="scroll-arrow"></div>
                    </div>
                </section>

                {/* About Section - Page 2 */}
                <section className="hero3d-section hero3d-page-2">
                    <div className="hero3d-about-content">
                        <h2 className="hero3d-about-title">NGUYỄN XUÂN HẢI</h2>
                        <div className="hero3d-image-container">
                            <img
                                src={profileImage}
                                alt="Nguyễn Xuân Hải"
                                className="hero3d-profile-image"
                            />
                        </div>
                        <div className="hero3d-skills">
                            {['React', 'Node.js', 'TypeScript', 'SQL', 'ASP.NET'].map((skill) => (
                                <span key={skill} className="hero3d-skill-tag">{skill}</span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Transition - Page 3 */}
                <section className="hero3d-section hero3d-page-3">
                    <div className="hero3d-transition-content">
                        <h2 className="hero3d-transition-title">EXPLORE MY WORK</h2>
                        <Link to="/#portfolio" className="hero3d-explore-btn">
                            VIEW PROJECTS <i className="fa-solid fa-arrow-down"></i>
                        </Link>
                    </div>
                </section>
            </ScrollScene>
        </div>
    );
};

export default Hero3D;
