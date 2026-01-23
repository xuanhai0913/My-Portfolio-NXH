import React, { useRef, useEffect, useState } from 'react';
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const allProjects = [
    {
      title: "Great Link Mai House",
      description: "Corporate website for leading Media & B2B company.",
      image: prj8,
      demo: "https://greatlinkmaihouse.com/",
      technologies: ["ASP.NET Core", "SQL Server", "C#"],
      badge: "B2B",
      company: "GREATLINK MAIHOUSE"
    },
    {
      title: "Education English",
      description: "Free English teaching platform for community.",
      image: prj6,
      demo: "https://ech.edu.vn",
      technologies: ["PHP", "MySQL", "WordPress"],
      company: "ECH COMMUNITY",
    },
    {
      title: "VN Media Hub",
      description: "Professional blog platform with .NET Core backend.",
      image: prj3,
      demo: "https://vnmediahub.com",
      github: "https://github.com/xuanhai0913/VNMediaHub",
      technologies: [".NET Core", "React", "SQL"],
      company: "VN MEDIA HUB"
    },
    {
      title: "Vision Key AI",
      description: "Multi-platform AI assistant with Gemini 2.0.",
      image: visionKey,
      technologies: ["Swift", "Next.js", "AI"],
      badge: "AI",
      demo: "https://visionpremium.hailamdev.space",
      githubLinks: [
        { url: "https://github.com/xuanhai0913/Vision-Key", label: "MacOS" },
        { url: "https://github.com/xuanhai0913/Extension-Vision-Premium", label: "Premium" },
        { url: "https://github.com/xuanhai0913/Extension-Vision-Key", label: "Standard" }
      ]
    },
    {
      title: "LLM Unit Test Gen",
      description: "AI tool generating unit tests using Deepseek LLM.",
      image: prj10,
      demo: "/videos",
      github: "https://github.com/xuanhai0913/LLM-Unit-tests",
      technologies: ["React", "Deepseek", "Node.js"],
      badge: "FEATURED"
    },
    {
      title: "Portfolio Website",
      description: "Modern brutalist portfolio with GSAP animations.",
      image: prj1,
      demo: "https://www.hailamdev.space/",
      github: "https://github.com/xuanhai0913/My-Portfolio-NXH",
      technologies: ["React", "GSAP", "CSS3"]
    },
    {
      title: "Happy New Year",
      description: "Animated festive greeting website.",
      image: prj5,
      demo: "https://happynewyear.hailamdev.space/",
      github: "https://github.com/xuanhai0913/Happy-New-Year",
      technologies: ["HTML5", "JS", "Canvas"],
    },
    {
      title: "SPRM Management",
      description: "Student performance tracking system.",
      image: prj7,
      demo: "https://cnpm-fullstack-react-csharp.onrender.com",
      github: "https://github.com/xuanhai0913/CNPM-Fullstack-React-CSharp",
      technologies: ["React", "C#", "EF Core"]
    },
    {
      title: "OTP API Service",
      description: "Phone rental service for OTP verification.",
      image: prj9,
      demo: "https://shop.hailamdev.space/",
      technologies: ["Node.js", "MongoDB", "Express"],
      badge: "API",
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;

      const scrolled = -rect.top;
      const totalScrollable = sectionHeight - viewportHeight;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

      setScrollProgress(progress);

      // Determine active index based on scroll progress
      const newIndex = Math.min(
        allProjects.length - 1,
        Math.floor(progress * allProjects.length)
      );
      setActiveIndex(newIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [allProjects.length]);

  // Calculate layout state for each card
  const getCardStyle = (index) => {
    // Only render nearby cards
    if (Math.abs(index - activeIndex) > 1) return { display: 'none' };

    const isPast = index < activeIndex;
    const isActive = index === activeIndex;
    const isFuture = index > activeIndex;

    let style = {};

    if (isActive) {
      style = {
        opacity: 1,
        transform: 'scale(1) translateY(0)',
        zIndex: 10,
        filter: 'blur(0px)'
      };
    } else if (isPast) {
      style = {
        opacity: 0,
        transform: 'scale(0.9) translateY(-50px)',
        zIndex: 5,
        filter: 'blur(10px)',
        pointerEvents: 'none'
      };
    } else if (isFuture) {
      style = {
        opacity: 0,
        transform: 'scale(1.1) translateY(100px)',
        zIndex: 5,
        filter: 'blur(10px)',
        pointerEvents: 'none'
      };
    }

    return style;
  };

  return (
    <section id="portfolio" className="portfolio-section" ref={sectionRef}>
      <div className="portfolio-sticky">

        {/* Fixed Header */}
        <div className="portfolio-header">
          <h2 className="section-title">PROJECTS_</h2>
          <div className="project-counter">
            <span className="current">{String(activeIndex + 1).padStart(2, '0')}</span>
            <span className="divider">/</span>
            <span className="total">{String(allProjects.length).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Cards Container */}
        <div className="cards-container">
          {allProjects.map((project, index) => (
            <article
              key={index}
              className={`project-card ${activeIndex === index ? 'active' : ''}`}
              style={getCardStyle(index)}
            >
              <div className="card-glass">
                <div className="card-visual">
                  <img src={project.image} alt={project.title} />
                  {project.badge && (
                    <div className="card-badge">{project.badge}</div>
                  )}
                </div>

                <div className="card-content">
                  <div className="content-header">
                    {project.company && (
                      <span className="company-label">{project.company}</span>
                    )}
                    <h3 className="project-title">{project.title}</h3>
                  </div>

                  <p className="project-desc">{project.description}</p>

                  <div className="tech-stack">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="tech-tag">{tech}</span>
                    ))}
                  </div>

                  <div className="card-actions">
                    {project.demo && (
                      <a href={project.demo} target={project.demo.startsWith('/') ? '_self' : '_blank'} rel="noopener noreferrer" className="action-btn primary">
                        VISIT SITE ↗
                      </a>
                    )}
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="action-btn secondary">
                        GITHUB_
                      </a>
                    )}
                    {project.githubLinks && project.githubLinks.map((link, i) => (
                      <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="action-btn secondary">
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="scroll-progress">
          <div
            className="progress-bar"
            style={{ height: `${scrollProgress * 100}%` }}
          ></div>
        </div>

      </div>
    </section>
  );
};

export default Portfolio;