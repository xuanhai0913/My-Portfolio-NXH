import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Squares from '../Squares';
import PortfolioTitle from '../PortfolioTitle';
import './styles/Portfolio.css';

// Import project images
import prj1 from '../../images/project/prj1.png';
import prj3 from '../../images/project/prj3.png';
import prj5 from '../../images/project/prj5.png';
import prj6 from '../../images/project/prj6.png';
import prj7 from '../../images/project/prj7.png';
// Temporary placeholder for Great Link Mai House project
// Replace with actual screenshot: import prj8 from '../../images/project/prj8.png';
import prj8 from '../../images/project/prj8.png'; // Temporary using prj1 as placeholder
import prj9 from '../../images/project/prj9.png';
import prj10 from '../../images/project/prj10.png';
import visionKey from '../../images/project/visionKey.png';

const Portfolio = () => {
  const projects = [
    {
      title: "Great Link Mai House - B2B Import-Export Platform",
      description: "Corporate website for Great Link Mai House, a leading Media & B2B Import-Export company. Features include business consultation, trade connections, import-export support, and event management services.",
      image: prj8,
      github: "#", // Private company project
      demo: "https://greatlinkmaihouse.com/",
      technologies: ["ASP.NET Core", "C#", "SQL Server", "Bootstrap", "JavaScript", "HTML5", "CSS3"],
      isCommercial: true,
      company: "CÔNG TY GREATLINK MAIHOUSE"
    },
    {
      title: "Website Education English Community",
      description: "Educational website that teaches English for free to people in difficult circumstances. Features comprehensive English learning resources, interactive lessons, and community support. Built with WordPress CMS for easy content management.",
      image: prj6,
      github: "#", // Private educational project
      demo: "https://ech.edu.vn",
      technologies: ["PHP", "MySQL", "CSS3", "JavaScript"],
      isCommercial: true,
      company: "English Community House (ECH)"
    },
    {
      title: "VN Media Hub - Full-Stack Blog Platform",
      description: "Professional blog platform for VN Media Hub with ASP.NET Core backend and React frontend. Features include multi-category management, SEO-friendly URLs, post tagging system, view counter, featured posts, and responsive design. Supports content in categories like Events, Reviews, Partners, and Videos.",
      image: prj3,
      github: "#", // Private company project
      demo: "https://vnmediahub.com",
      technologies: ["ASP.NET Core", "C#", "React", "SQL Server", "Entity Framework", "Vite", "REST API"],
      isCommercial: true,
      company: "CÔNG TY VN MEDIA HUB",
      category: "Full-Stack Web Application",
      year: 2025,
      highlights: ["Multi-Category System", "SEO Optimized", "Admin Panel", "Tag Management"]
    },
    {
      title: "Vision Key Premium - AI Screen Assistant",
      description: "A multi-platform AI assistant integrating Google Gemini 2.0 Flash for intelligent screen analysis and Auto-Click support for Quizizz/Wayground. Available as native macOS app, Chrome Extension Premium (SaaS), and Windows version in development. Features auto-answer, license key system, and secure proxy server.",
      image: visionKey,
      customLinks: [
        {
          url: "https://visionpremium.hailamdev.space",
          label: "Landing Page",
          icon: "fas fa-globe"
        },
        {
          url: "https://github.com/xuanhai0913/Extension-Vision-Premium",
          label: "Chrome Premium",
          icon: "fab fa-chrome"
        },
        {
          url: "https://github.com/xuanhai0913/Vision-Key",
          label: "macOS Core",
          icon: "fab fa-apple"
        }
      ],
      technologies: ["Swift", "SwiftUI", "JavaScript", "Next.js", "MongoDB", "Gemini AI", "SaaS"],
      isCommercial: false,
      noDemo: true,
      category: "AI/Desktop Application",
      year: 2025,
      highlights: ["AI Integration", "Auto-Click Quizizz", "Multi-Platform", "SaaS License System"],
      platform: "macOS / Chrome / Windows (Dev)"
    },
    {
      title: "Portfolio Website",
      description: "Modern React portfolio with interactive animations and responsive design. Using React, GSAP, and CSS3.",
      image: prj1,
      github: "https://github.com/xuanhai0913/My-Portfolio-NXH",
      demo: "https://www.hailamdev.space/",
      technologies: ["React", "JavaScript", "CSS3", "GSAP", "HTML5"]
    },
    {
      title: "Website Happy New Year",
      description: "A simple website to wish Happy New Year, using HTML, CSS, and JavaScript.",
      image: prj5,
      github: "https://github.com/xuanhai0913/HappyNewYear",
      demo: "https://happynewyear.hailamdev.space/",
      technologies: ["HTML5", "CSS3", "JavaScript", "Animation"]
    },
    {
      title: "SPRM - Student Performance & Resource Management",
      description: "Full-stack education management system featuring student performance tracking, resource management, and administrative tools. Technologies: React.js, C# ASP.NET Core Web API, SQL Server, JWT Authentication, responsive design.",
      image: prj7,
      github: "https://github.com/xuanhai0913/CNPM-Fullstack-React-CSharp",
      demo: "https://cnpm-fullstack-react-csharp.onrender.com",
      technologies: ["React", "C#", "ASP.NET Core", "SQL Server", "JWT"]
    },
    {
      title: "OTP API - Phone Number Rental Service",
      description: "Web service for renting phone numbers to receive OTP codes. Provides temporary phone numbers for verification purposes with real-time OTP retrieval.",
      image: prj9,
      github: "https://github.com/xuanhai0913/OTP-API",
      demo: "https://shop.hailamdev.space/",
      technologies: ["API", "Node.js", "Express", "MongoDB", "SMS Gateway"]
    },
    {
      title: "LLM-Powered Unit Test Generator",
      description: "Intelligent web application using Deepseek LLM to automatically generate comprehensive unit tests from source code. Supports Python, JavaScript, TypeScript with pytest, unittest, Jest, and Mocha frameworks. Features Monaco code editor and generation history.",
      image: prj10,
      github: "https://github.com/xuanhai0913/LLM-Unit-tests",
      demo: "/videos",
      technologies: ["React", "Node.js", "Deepseek AI", "Monaco Editor", "Vite", "SQLite"],
      hasVideoDemo: true,
      category: "AI/Web Application",
      year: 2025,
      highlights: ["AI-Powered", "Multi-Language", "Multiple Frameworks", "Generation History"]
    },

  ];

  const projectRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px"
      }
    );

    projectRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="portfolio" className="portfolio-section">
      <Squares
        speed={0.4}
        squareSize={window.innerWidth < 768 ? 25 : 35}
        direction='diagonal'
        borderColor='rgba(255, 255, 255, 0.08)'
        hoverFillColor='rgba(74, 144, 226, 0.2)'
      />
      <div className="portfolio-content">
        <PortfolioTitle text="Portfolio" />
        <div className="portfolio-grid">
          {projects.map((project, index) => (
            <div
              key={index}
              className="project-card hidden"
              ref={el => projectRefs.current[index] = el}
              style={{
                '--delay': `${index * 0.1}s`
              }}
            >
              <div className="project-image">
                <img src={project.image} alt={project.title} />
              </div>
              <div className="project-content">
                <div className="project-text">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  {project.technologies && (
                    <div className="project-technologies">
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="project-links">
                  {project.isCommercial ? (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className="demo-link">
                      <i className="fas fa-external-link-alt"></i> Visit Website
                    </a>
                  ) : project.customLinks ? (
                    project.customLinks.map((link, idx) => (
                      <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="github-link">
                        <i className={link.icon}></i> {link.label}
                      </a>
                    ))
                  ) : (
                    <>
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="github-link">
                        <i className="fab fa-github"></i> Source Code
                      </a>
                      {!project.noDemo && (
                        project.hasVideoDemo ? (
                          <Link to={project.demo} className="demo-link">
                            <i className="fas fa-play-circle"></i> Watch Demo
                          </Link>
                        ) : (
                          <a href={project.demo} target="_blank" rel="noopener noreferrer" className="demo-link">
                            <i className="fas fa-external-link-alt"></i> Live Demo
                          </a>
                        )
                      )}
                    </>
                  )}
                </div>
                {project.company && (
                  <div className="project-company">
                    <i className="fas fa-building"></i> {project.company}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;