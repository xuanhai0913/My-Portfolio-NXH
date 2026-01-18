import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './styles/Portfolio.css';

// Import project images
import prj1 from '../../images/project/prj1.png';
import prj3 from '../../images/project/prj3.png';
import prj6 from '../../images/project/prj6.png';
import prj7 from '../../images/project/prj7.png';
import prj8 from '../../images/project/prj8.png';
import prj10 from '../../images/project/prj10.png';
import visionKey from '../../images/project/visionKey.png';

const Portfolio = () => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const projects = [
    {
      title: "Great Link Mai House",
      subtitle: "B2B Import-Export Platform",
      description: "Corporate website for Great Link Mai House, a leading Media & B2B Import-Export company.",
      image: prj8,
      demo: "https://greatlinkmaihouse.com/",
      technologies: ["ASP.NET Core", "SQL Server"],
      badge: "B2B"
    },
    {
      title: "VN Media Hub",
      subtitle: "Full-Stack Blog Platform",
      description: "Professional blog platform with ASP.NET Core backend. Features category management and SEO.",
      image: prj3,
      demo: "https://vnmediahub.com",
      technologies: [".NET Core", "React"]
    },
    {
      title: "Vision Key AI",
      subtitle: "Multi-Platform AI Assistant",
      description: "AI assistant integrating Google Gemini 2.0 Flash for intelligent screen analysis.",
      image: visionKey,
      demo: "https://visionpremium.hailamdev.space",
      technologies: ["Swift", "Next.js", "Gemini AI"],
      badge: "AI"
    },
    {
      title: "LLM Unit Test Generator",
      subtitle: "AI-Powered Testing Tool",
      description: "Intelligent web app using Deepseek LLM to generate unit tests from source code.",
      image: prj10,
      github: "https://github.com/xuanhai0913/LLM-Unit-tests",
      demo: "/videos",
      technologies: ["React", "Node.js", "Deepseek"],
      hasVideoDemo: true
    },
    {
      title: "Education English",
      subtitle: "ECH Community Platform",
      description: "Educational website teaching English for free. Features learning resources and CMS.",
      image: prj6,
      demo: "https://ech.edu.vn",
      technologies: ["PHP", "MySQL"]
    },
    {
      title: "Portfolio Website",
      subtitle: "React + GSAP",
      description: "Modern React portfolio with interactive animations and responsive design.",
      image: prj1,
      github: "https://github.com/xuanhai0913/My-Portfolio-NXH",
      demo: "https://www.hailamdev.space/",
      technologies: ["React", "GSAP"]
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const containerHeight = container.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Calculate how far we've scrolled through the container
      const scrolled = viewportHeight - rect.top;
      const totalScrollable = containerHeight;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

      setScrollProgress(progress);

      // Calculate active project index
      const projectCount = projects.length;
      const newIndex = Math.floor(progress * projectCount);
      setActiveIndex(Math.min(newIndex, projectCount - 1));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [projects.length]);

  return (
    <section id="portfolio" className="portfolio-section" ref={containerRef}>
      <div className="portfolio-sticky">
        {/* Title */}
        <h2 className="portfolio-title">PROJECTS_</h2>

        {/* Progress Bar */}
        <div className="portfolio-progress">
          <div
            className="portfolio-progress-bar"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>

        {/* Project Counter */}
        <div className="portfolio-counter">
          <span className="counter-current">{String(activeIndex + 1).padStart(2, '0')}</span>
          <span className="counter-divider">/</span>
          <span className="counter-total">{String(projects.length).padStart(2, '0')}</span>
        </div>

        {/* Project Cards Container */}
        <div className="portfolio-cards">
          {projects.map((project, index) => {
            const isActive = index === activeIndex;
            const isPast = index < activeIndex;
            const isFuture = index > activeIndex;

            return (
              <div
                key={index}
                className={`portfolio-card ${isActive ? 'active' : ''} ${isPast ? 'past' : ''} ${isFuture ? 'future' : ''}`}
              >
                {/* Image Side */}
                <div className="card-image-container">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="card-image"
                  />
                  {project.badge && (
                    <span className="card-badge">{project.badge}</span>
                  )}
                </div>

                {/* Content Side */}
                <div className="card-content">
                  <span className="card-number">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="card-title">{project.title}</h3>
                  <p className="card-subtitle">{project.subtitle}</p>
                  <p className="card-description">{project.description}</p>

                  <div className="card-technologies">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="card-tech">{tech}</span>
                    ))}
                  </div>

                  <div className="card-actions">
                    {project.hasVideoDemo ? (
                      <Link to={project.demo} className="card-btn">
                        WATCH DEMO
                      </Link>
                    ) : (
                      <a href={project.demo} target="_blank" rel="noopener noreferrer" className="card-btn">
                        VIEW PROJECT
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Dots */}
        <div className="portfolio-dots">
          {projects.map((_, index) => (
            <div
              key={index}
              className={`portfolio-dot ${index === activeIndex ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;