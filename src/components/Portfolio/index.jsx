import React, { useEffect, useRef } from 'react';
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
  const projects = [
    {
      title: "Great Link Mai House - B2B Import-Export Platform",
      description: "Corporate website for Great Link Mai House, a leading Media & B2B Import-Export company. Features include business consultation, trade connections, import-export support, and event management services.",
      image: prj8,
      github: "#",
      demo: "https://greatlinkmaihouse.com/",
      technologies: ["ASP.NET Core", "C#", "SQL Server", "Bootstrap", "JavaScript", "HTML5", "CSS3"],
      isCommercial: true,
      company: "CÔNG TY GREATLINK MAIHOUSE",
      variant: "default",
      badge: "B2B"
    },
    {
      title: "Website Education English Community",
      description: "Educational website that teaches English for free to people in difficult circumstances. Features comprehensive English learning resources, interactive lessons, and community support. Built with WordPress CMS for easy content management.",
      image: prj6,
      github: "#",
      demo: "https://ech.edu.vn",
      technologies: ["PHP", "MySQL", "CSS3", "JavaScript"],
      isCommercial: true,
      company: "English Community House (ECH)",
      variant: "dark"
    },
    {
      title: "VN Media Hub - Full-Stack Blog Platform",
      description: "Professional blog platform for VN Media Hub with ASP.NET Core backend and React frontend. Features include multi-category management, SEO-friendly URLs, post tagging system, view counter, featured posts, and responsive design.",
      image: prj3,
      github: "#",
      demo: "https://vnmediahub.com",
      technologies: ["ASP.NET Core", "C#", "React", "SQL Server", "Entity Framework", "Vite", "REST API"],
      isCommercial: true,
      company: "CÔNG TY VN MEDIA HUB",
      variant: "default"
    },
    {
      title: "Vision Key Premium - AI Screen Assistant",
      description: "A multi-platform AI assistant integrating Google Gemini 2.0 Flash for intelligent screen analysis and Auto-Click support for Quizizz/Wayground. Available as native macOS app, Chrome Extension Premium (SaaS), and Windows version in development.",
      image: visionKey,
      customLinks: [
        { url: "https://visionpremium.hailamdev.space", label: "Landing Page", icon: "fas fa-globe" },
        { url: "https://github.com/xuanhai0913/Extension-Vision-Premium", label: "Chrome Premium", icon: "fab fa-chrome" },
        { url: "https://github.com/xuanhai0913/Vision-Key", label: "macOS Core", icon: "fab fa-apple" }
      ],
      technologies: ["Swift", "SwiftUI", "JavaScript", "Next.js", "MongoDB", "Gemini AI", "SaaS"],
      isCommercial: false,
      noDemo: true,
      variant: "accent"
    },
    {
      title: "Portfolio Website",
      description: "Modern React portfolio with interactive animations and responsive design. Using React, GSAP, and CSS3.",
      image: prj1,
      github: "https://github.com/xuanhai0913/My-Portfolio-NXH",
      demo: "https://www.hailamdev.space/",
      technologies: ["React", "JavaScript", "CSS3", "GSAP", "HTML5"],
      variant: "default"
    },
    {
      title: "Website Happy New Year",
      description: "A simple website to wish Happy New Year, using HTML, CSS, and JavaScript.",
      image: prj5,
      github: "https://github.com/xuanhai0913/HappyNewYear",
      demo: "https://happynewyear.hailamdev.space/",
      technologies: ["HTML5", "CSS3", "JavaScript", "Animation"],
      variant: "dark"
    },
    {
      title: "SPRM - Student Performance & Resource Management",
      description: "Full-stack education management system featuring student performance tracking, resource management, and administrative tools. Technologies: React.js, C# ASP.NET Core Web API, SQL Server, JWT Authentication, responsive design.",
      image: prj7,
      github: "https://github.com/xuanhai0913/CNPM-Fullstack-React-CSharp",
      demo: "https://cnpm-fullstack-react-csharp.onrender.com",
      technologies: ["React", "C#", "ASP.NET Core", "SQL Server", "JWT"],
      variant: "default"
    },
    {
      title: "OTP API - Phone Number Rental Service",
      description: "Web service for renting phone numbers to receive OTP codes. Provides temporary phone numbers for verification purposes with real-time OTP retrieval.",
      image: prj9,
      github: "https://github.com/xuanhai0913/OTP-API",
      demo: "https://shop.hailamdev.space/",
      technologies: ["API", "Node.js", "Express", "MongoDB", "SMS Gateway"],
      variant: "accent"
    },
    {
      title: "LLM-Powered Unit Test Generator",
      description: "Intelligent web application using Deepseek LLM to automatically generate comprehensive unit tests from source code. Supports Python, JavaScript, TypeScript with pytest, unittest, Jest, and Mocha frameworks.",
      image: prj10,
      github: "https://github.com/xuanhai0913/LLM-Unit-tests",
      demo: "/videos",
      technologies: ["React", "Node.js", "Deepseek AI", "Monaco Editor", "Vite", "SQLite"],
      hasVideoDemo: true,
      variant: "dark"
    },
  ];

  const cardRefs = useRef([]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
        }
      });
    }, observerOptions);

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="portfolio" className="portfolio-section">
      <div className="portfolio-container">
        <h2 className="portfolio-title">PROJECTS_</h2>

        <div className="portfolio-grid">
          {projects.map((project, index) => (
            <div
              key={index}
              className={`project-card card-${project.variant} scroll-card ${index % 2 === 0 ? 'from-left' : 'from-right'}`}
              ref={el => cardRefs.current[index] = el}
            >
              {/* Image */}
              <div className="project-image-container">
                <img
                  src={project.image}
                  alt={project.title}
                  className="project-image"
                />
              </div>

              {/* Content */}
              <div className="project-content">
                <div className="project-header">
                  <h3 className="project-title">{project.title}</h3>
                  {project.badge && (
                    <span className="project-badge">{project.badge}</span>
                  )}
                </div>

                <p className="project-description">{project.description}</p>

                <div className="project-technologies">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="tech-tag">{tech}</span>
                  ))}
                </div>

                {project.company && (
                  <div className="project-company">
                    <i className="fas fa-building"></i> {project.company}
                  </div>
                )}

                <div className="project-actions">
                  {project.isCommercial ? (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className="project-btn primary">
                      VISIT WEBSITE
                    </a>
                  ) : project.customLinks ? (
                    project.customLinks.map((link, i) => (
                      <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="project-btn">
                        <i className={link.icon}></i> {link.label}
                      </a>
                    ))
                  ) : (
                    <>
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-btn">
                        <i className="fab fa-github"></i> Source
                      </a>
                      {!project.noDemo && (
                        project.hasVideoDemo ? (
                          <Link to={project.demo} className="project-btn primary">
                            <i className="fas fa-play-circle"></i> Watch Demo
                          </Link>
                        ) : (
                          <a href={project.demo} target="_blank" rel="noopener noreferrer" className="project-btn primary">
                            Live Demo
                          </a>
                        )
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;