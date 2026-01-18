import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './styles/Portfolio.css';

// Import project images
import prj1 from '../../images/project/prj1.png';
import prj3 from '../../images/project/prj3.png';
import prj5 from '../../images/project/prj5.png';
import prj6 from '../../images/project/prj6.png';
import prj7 from '../../images/project/prj7.png';
import prj8 from '../../images/project/prj8.png';
import prj9 from '../../images/project/prj9.png';
import prj10 from '../../images/project/prj10.png';
import visionKey from '../../images/project/visionKey.png';

const Portfolio = () => {
  const sectionRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  // All 9 projects
  const projects = [
    {
      title: "Great Link Mai House",
      description: "B2B Import-Export Platform for leading Media & B2B company.",
      image: prj8,
      demo: "https://greatlinkmaihouse.com/",
      technologies: ["ASP.NET Core", "SQL Server"],
      badge: "B2B"
    },
    {
      title: "VN Media Hub",
      description: "Full-Stack Blog Platform with .NET Core and React.",
      image: prj3,
      demo: "https://vnmediahub.com",
      technologies: [".NET Core", "React"]
    },
    {
      title: "Vision Key AI",
      description: "Multi-platform AI assistant with Gemini 2.0 Flash.",
      image: visionKey,
      demo: "https://visionpremium.hailamdev.space",
      technologies: ["Swift", "Next.js", "AI"],
      badge: "AI"
    },
    {
      title: "LLM Unit Test Generator",
      description: "AI-powered testing tool using Deepseek LLM.",
      image: prj10,
      demo: "/videos",
      technologies: ["React", "Node.js", "AI"],
      hasVideoDemo: true
    },
    {
      title: "Education English",
      description: "Free English learning platform for ECH Community.",
      image: prj6,
      demo: "https://ech.edu.vn",
      technologies: ["PHP", "MySQL"]
    },
    {
      title: "Portfolio Website",
      description: "Modern React portfolio with GSAP animations.",
      image: prj1,
      demo: "https://www.hailamdev.space/",
      technologies: ["React", "GSAP"]
    },
    {
      title: "Happy New Year",
      description: "Animated greeting website with festive effects.",
      image: prj5,
      demo: "https://happynewyear.hailamdev.space/",
      technologies: ["HTML5", "CSS3", "JS"]
    },
    {
      title: "SPRM Education",
      description: "Student performance & resource management system.",
      image: prj7,
      demo: "https://cnpm-fullstack-react-csharp.onrender.com",
      technologies: ["React", "C#", "SQL"]
    },
    {
      title: "OTP API Service",
      description: "Phone number rental service for OTP verification.",
      image: prj9,
      demo: "https://shop.hailamdev.space/",
      technologies: ["Node.js", "MongoDB"],
      badge: "API"
    }
  ];

  const itemCount = projects.length;
  const anglePerItem = 360 / itemCount;

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Progress through section
      const scrolled = viewportHeight - rect.top;
      const scrollableHeight = sectionHeight - viewportHeight;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));

      // Calculate rotation (full rotation = all items)
      const totalRotation = (itemCount - 1) * anglePerItem;
      const currentRotation = progress * totalRotation;

      setRotation(currentRotation);
      setActiveIndex(Math.round(currentRotation / anglePerItem) % itemCount);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [itemCount, anglePerItem]);

  return (
    <section id="portfolio" className="portfolio-section" ref={sectionRef}>
      <div className="portfolio-sticky">
        {/* Title */}
        <h2 className="portfolio-title">PROJECTS_</h2>

        {/* Counter */}
        <div className="portfolio-counter">
          <span className="current">{String(activeIndex + 1).padStart(2, '0')}</span>
          <span className="divider">/</span>
          <span className="total">{String(itemCount).padStart(2, '0')}</span>
        </div>

        {/* Rolodex Container */}
        <div className="rolodex-container">
          {/* Left Wheel */}
          <div className="rolodex-wheel wheel-left">
            <div
              className="wheel-inner"
              style={{ transform: `rotateX(${rotation}deg)` }}
            >
              {projects.map((project, index) => {
                const itemRotation = index * anglePerItem;
                const isActive = index === activeIndex;

                return (
                  <div
                    key={index}
                    className={`wheel-card ${isActive ? 'active' : ''}`}
                    style={{
                      transform: `rotateX(${-itemRotation}deg) translateZ(300px)`
                    }}
                  >
                    <div className="card-image">
                      <img src={project.image} alt={project.title} />
                      {project.badge && <span className="card-badge">{project.badge}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Center Info */}
          <div className="rolodex-center">
            <div className="center-card">
              <h3 className="center-title">{projects[activeIndex]?.title}</h3>
              <p className="center-description">{projects[activeIndex]?.description}</p>
              <div className="center-techs">
                {projects[activeIndex]?.technologies.map((tech, i) => (
                  <span key={i}>{tech}</span>
                ))}
              </div>
              <div className="center-actions">
                {projects[activeIndex]?.hasVideoDemo ? (
                  <Link to={projects[activeIndex].demo} className="center-btn">
                    <i className="fas fa-play-circle"></i> WATCH DEMO
                  </Link>
                ) : (
                  <a
                    href={projects[activeIndex]?.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="center-btn"
                  >
                    VIEW PROJECT <i className="fas fa-arrow-right"></i>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Wheel (Mirror) */}
          <div className="rolodex-wheel wheel-right">
            <div
              className="wheel-inner"
              style={{ transform: `rotateX(${-rotation}deg)` }}
            >
              {projects.map((project, index) => {
                const itemRotation = index * anglePerItem;
                const mirrorIndex = (itemCount - 1 - index + activeIndex) % itemCount;
                const isActive = mirrorIndex === activeIndex;

                return (
                  <div
                    key={index}
                    className={`wheel-card ${isActive ? 'active' : ''}`}
                    style={{
                      transform: `rotateX(${itemRotation}deg) translateZ(300px)`
                    }}
                  >
                    <div className="card-image">
                      <img src={projects[(index + 1) % itemCount].image} alt="" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="portfolio-dots">
          {projects.map((_, index) => (
            <div
              key={index}
              className={`dot ${index === activeIndex ? 'active' : ''} ${index < activeIndex ? 'past' : ''}`}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <div className="scroll-hint">
          <span>SCROLL TO EXPLORE</span>
          <div className="scroll-line"></div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;