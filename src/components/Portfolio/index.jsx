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

  // Full detailed projects list
  const allProjects = [
    {
      title: "Great Link Mai House",
      description: "Corporate website for Great Link Mai House, a leading Media & B2B Import-Export company. Features consultation, trade connections, and event services.",
      image: prj8,
      demo: "https://greatlinkmaihouse.com/",
      technologies: ["ASP.NET Core", "SQL Server", "C#", "Bootstrap"],
      badge: "B2B",
      isCommercial: true,
      company: "CÔNG TY GREATLINK MAIHOUSE"
    },
    {
      title: "Education English",
      description: "Educational website teaching English for free to people in difficult circumstances. Features comprehensive learning resources and community support.",
      image: prj6,
      demo: "https://ech.edu.vn",
      technologies: ["PHP", "MySQL", "WordPress"],
      company: "English Community House",
      variant: "dark"
    },
    {
      title: "VN Media Hub",
      description: "Professional blog platform with ASP.NET Core backend and React frontend. Features multi-category management, SEO-friendly URLs, and view counting.",
      image: prj3,
      demo: "https://vnmediahub.com",
      technologies: [".NET Core", "React", "SQL Server", "Rest API"],
      isCommercial: true,
      company: "CÔNG TY VN MEDIA HUB"
    },
    {
      title: "Vision Key AI",
      description: "Multi-platform AI assistant integrating Gemini 2.0 Flash. Intelligent screen analysis and Auto-Click support. Native macOS app + Chrome Extension.",
      image: visionKey,
      customLinks: [
        { url: "https://visionpremium.hailamdev.space", label: "Landing" },
        { url: "https://github.com/xuanhai0913/Extension-Vision-Premium", label: "Chrome" },
        { url: "https://github.com/xuanhai0913/Vision-Key", label: "macOS" }
      ],
      technologies: ["Swift", "Next.js", "Gemini AI", "SaaS"],
      badge: "AI",
      variant: "accent"
    },
    {
      title: "LLM Unit Test Gen",
      description: "Intelligent web app using Deepseek LLM to automatically generate unit tests. Supports Python, JS, TS with pytest, unittest, Jest.",
      image: prj10,
      demo: "/videos",
      technologies: ["React", "Node.js", "Deepseek AI", "Monaco"],
      hasVideoDemo: true,
      variant: "dark"
    },
    {
      title: "Portfolio Website",
      description: "Modern React portfolio with interactive animations. Brutalist design using GSAP and CSS3 custom properties.",
      image: prj1,
      demo: "https://www.hailamdev.space/",
      github: "https://github.com/xuanhai0913/My-Portfolio-NXH",
      technologies: ["React", "GSAP", "CSS3"]
    },
    {
      title: "Happy New Year",
      description: "Animated greeting website with festive effects. Dynamic JavaScript animations for firework effects.",
      image: prj5,
      demo: "https://happynewyear.hailamdev.space/",
      github: "https://github.com/xuanhai0913/HappyNewYear",
      technologies: ["HTML5", "CSS3", "JavaScript"],
      variant: "dark"
    },
    {
      title: "SPRM Management",
      description: "Full-stack student performance & resource management system. Features tracking, JWT auth, and admin tools.",
      image: prj7,
      demo: "https://cnpm-fullstack-react-csharp.onrender.com",
      github: "https://github.com/xuanhai0913/CNPM-Fullstack-React-CSharp",
      technologies: ["React", "C#", "ASP.NET Core", "SQL"],
      variant: "default"
    },
    {
      title: "OTP API Service",
      description: "Web service for renting phone numbers to receive OTP codes. Real-time retrieval with SMS Gateway integration.",
      image: prj9,
      demo: "https://shop.hailamdev.space/",
      github: "https://github.com/xuanhai0913/OTP-API",
      technologies: ["Node.js", "Express", "MongoDB"],
      badge: "API",
      variant: "accent"
    }
  ];

  // Distribute to Left/Right
  const leftProjects = allProjects.filter((_, i) => i % 2 === 0);
  const rightProjects = allProjects.filter((_, i) => i % 2 !== 0);

  const itemSpacing = 40; // Spacing for 5 items per wheel

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrolled = -rect.top + viewportHeight * 0.5;
      const newRotation = scrolled * 0.08;
      setRotation(newRotation);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderCard = (project, index, side) => {
    const itemAngle = index * itemSpacing;
    const variantClass = project.variant ? `card-${project.variant}` : 'card-default';

    return (
      <div
        key={index}
        className={`wheel-item ${side}`}
        style={{
          transform: `rotate(${itemAngle}deg) translate(var(--radius)) rotate(${-itemAngle}deg)`
        }}
      >
        <div className={`wheel-card-content ${variantClass}`}>
          <div className="wheel-card-image">
            <img src={project.image} alt={project.title} />
            {project.badge && <span className="card-badge">{project.badge}</span>}
          </div>
          <div className="wheel-card-info">
            <h3 className="project-title">{project.title}</h3>
            {project.company && <div className="project-company">{project.company}</div>}

            <p className="project-desc">{project.description}</p>

            <div className="wheel-techs">
              {project.technologies.slice(0, 4).map((t, i) => (
                <span key={i} className="tech-tag">{t}</span>
              ))}
            </div>

            <div className="card-actions">
              {project.customLinks ? (
                project.customLinks.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="wheel-btn small">
                    {link.label}
                  </a>
                ))
              ) : (
                <>
                  {project.hasVideoDemo ? (
                    <Link to={project.demo} className="wheel-btn">WATCH DEMO</Link>
                  ) : (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className="wheel-btn">
                      {project.isCommercial ? 'VISIT SITE' : 'LIVE DEMO'}
                    </a>
                  )}
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="wheel-btn outline">
                      CODE
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="portfolio" className="portfolio-section" ref={sectionRef}>
      <div className="portfolio-sticky">
        <h2 className="portfolio-title">PROJECTS_</h2>

        <div className="wheels-container">
          <div
            className="wheel-wrapper left"
            style={{ transform: `translate(-50%, -50%) rotate(${rotation}deg)` }}
          >
            {leftProjects.map((p, i) => renderCard(p, i, 'left'))}
          </div>

          <div
            className="wheel-wrapper right"
            style={{ transform: `translate(50%, -50%) rotate(${-rotation}deg)` }}
          >
            {rightProjects.map((p, i) => renderCard(p, i, 'right'))}
          </div>
        </div>

        <div className="scroll-hint">
          <div className="scroll-icon"></div>
          <span>SCROLL TO EXPLORE</span>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;