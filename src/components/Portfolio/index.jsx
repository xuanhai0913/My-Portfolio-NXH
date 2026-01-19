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
      description: "Corporate website for leading Media & B2B company. Features consultation, trade connections, and event services.",
      image: prj8,
      demo: "https://greatlinkmaihouse.com/",
      technologies: ["ASP.NET Core", "SQL Server", "C#"],
      badge: "B2B",
      company: "GREATLINK MAIHOUSE"
    },
    {
      title: "Education English",
      description: "Free English teaching platform for community. Comprehensive learning resources and support.",
      image: prj6,
      demo: "https://ech.edu.vn",
      technologies: ["PHP", "MySQL", "WordPress"],
      company: "ECH COMMUNITY",
      variant: "dark"
    },
    {
      title: "VN Media Hub",
      description: "Professional blog platform with .NET Core backend. Multi-category, SEO-friendly.",
      image: prj3,
      demo: "https://vnmediahub.com",
      github: "https://github.com/xuanhai0913/VNMediaHub",
      technologies: [".NET Core", "React", "SQL"],
      company: "VN MEDIA HUB"
    },
    {
      title: "Vision Key AI",
      description: "Multi-platform AI assistant with Gemini 2.0. Auto-click support, screen analysis.",
      image: visionKey,
      technologies: ["Swift", "Next.js", "AI"],
      badge: "AI",
      variant: "accent",
      demo: "https://visionpremium.hailamdev.space",
      githubLinks: [
        { url: "https://github.com/xuanhai0913/Vision-Key", label: "MacOS" },
        { url: "https://github.com/xuanhai0913/Extension-Vision-Premium", label: "Premium" },
        { url: "https://github.com/xuanhai0913/Extension-Vision-Key", label: "Standard" }
      ]
    },
    {
      title: "LLM Unit Test Gen",
      description: "AI tool generating unit tests using Deepseek LLM. Smart code analysis.",
      image: prj10,
      demo: "/videos",
      github: "https://github.com/xuanhai0913/LLM-Unit-tests",
      technologies: ["React", "Deepseek", "Node.js"],
      variant: "dark"
    },
    {
      title: "Portfolio Website",
      description: "Modern brutalist portfolio with GSAP animations and scroll effects.",
      image: prj1,
      demo: "https://www.hailamdev.space/",
      github: "https://github.com/xuanhai0913/My-Portfolio-NXH",
      technologies: ["React", "GSAP", "CSS3"]
    },
    {
      title: "Happy New Year",
      description: "Animated festive greeting website with particle effects.",
      image: prj5,
      demo: "https://happynewyear.hailamdev.space/",
      github: "https://github.com/xuanhai0913/Happy-New-Year",
      technologies: ["HTML5", "JS", "Canvas"],
      variant: "dark"
    },
    {
      title: "SPRM Management",
      description: "Student performance tracking system with analytics dashboard.",
      image: prj7,
      demo: "https://cnpm-fullstack-react-csharp.onrender.com",
      github: "https://github.com/xuanhai0913/CNPM-Fullstack-React-CSharp",
      technologies: ["React", "C#", "EF Core"]
    },
    {
      title: "OTP API Service",
      description: "Phone rental service for OTP verification. RESTful API.",
      image: prj9,
      demo: "https://shop.hailamdev.space/",
      technologies: ["Node.js", "MongoDB", "Express"],
      badge: "API",
      variant: "accent"
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;

      const scrolled = -rect.top;
      const totalScroll = sectionHeight - viewportHeight;
      const progress = Math.max(0, Math.min(1, scrolled / totalScroll));

      setScrollProgress(progress);

      // Calculate active project based on scroll
      const projectIndex = Math.floor(progress * allProjects.length);
      setActiveIndex(Math.min(projectIndex, allProjects.length - 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [allProjects.length]);

  // Calculate individual card progress (0-1 for each card's visibility phase)
  const getCardProgress = (index) => {
    const cardDuration = 1 / allProjects.length;
    const cardStart = index * cardDuration;
    const cardProgress = (scrollProgress - cardStart) / cardDuration;
    return Math.max(0, Math.min(1, cardProgress));
  };

  return (
    <section id="portfolio" className="portfolio-section" ref={sectionRef}>
      <div className="portfolio-sticky">
        {/* Background Elements */}
        <div className="portfolio-bg">
          <div className="bg-line bg-line--1"></div>
          <div className="bg-line bg-line--2"></div>
          <div className="bg-line bg-line--3"></div>
        </div>

        {/* Title */}
        <h2 className="portfolio-title">
          <span className="title-label">FEATURED</span>
          <span className="title-main">PROJECTS_</span>
        </h2>

        {/* Progress Indicator */}
        <div className="portfolio-progress">
          <div className="progress-bar" style={{ width: `${scrollProgress * 100}%` }}></div>
        </div>

        {/* Counter */}
        <div className="portfolio-counter">
          <span className="counter-current">{String(activeIndex + 1).padStart(2, '0')}</span>
          <span className="counter-divider">/</span>
          <span className="counter-total">{String(allProjects.length).padStart(2, '0')}</span>
        </div>

        {/* Project Cards - Scrollytelling Stack */}
        <div className="project-stage">
          {allProjects.map((project, index) => {
            const cardProgress = getCardProgress(index);
            const isActive = index === activeIndex;
            const isPast = index < activeIndex;
            const isFuture = index > activeIndex;

            // Calculate transforms based on progress
            let transform = '';
            let opacity = 0;
            let scale = 0.9;
            let blur = 10;

            if (isActive) {
              // Entrance: scale up and fade in during first half of progress
              // Stay visible during middle
              // Exit: scale down and fade out during last half
              const entranceProgress = Math.min(cardProgress * 2, 1);
              const exitProgress = Math.max((cardProgress - 0.5) * 2, 0);

              opacity = entranceProgress - exitProgress * 0.5;
              scale = 0.8 + entranceProgress * 0.2 - exitProgress * 0.1;
              blur = 10 * (1 - entranceProgress);
              transform = `scale(${scale}) translateY(${(1 - entranceProgress) * 50 + exitProgress * -30}px)`;
            } else if (isPast) {
              opacity = 0;
              transform = 'scale(0.8) translateY(-100px)';
            } else if (isFuture) {
              opacity = 0;
              transform = 'scale(0.8) translateY(100px)';
            }

            const variantClass = project.variant ? `card-${project.variant}` : '';

            return (
              <article
                key={index}
                className={`project-card ${variantClass} ${isActive ? 'active' : ''}`}
                style={{
                  transform,
                  opacity,
                  filter: `blur(${blur}px)`,
                  zIndex: isActive ? 10 : 1
                }}
              >
                <div className="card-inner">
                  {/* Left: Image */}
                  <div className="card-media">
                    <div className="media-frame">
                      <img src={project.image} alt={project.title} />
                      {project.badge && <span className="card-badge">{project.badge}</span>}
                    </div>
                    <div className="media-index">{String(index + 1).padStart(2, '0')}</div>
                  </div>

                  {/* Right: Content */}
                  <div className="card-content">
                    {project.company && (
                      <div className="card-company">{project.company}</div>
                    )}
                    <h3 className="card-title">{project.title}</h3>
                    <p className="card-description">{project.description}</p>

                    <div className="card-techs">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="tech-tag">{tech}</span>
                      ))}
                    </div>

                    <div className="card-actions">
                      {project.demo && (
                        <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
                          <span>Visit Site</span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M7 17L17 7M17 7H7M17 7V17" />
                          </svg>
                        </a>
                      )}
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn--secondary">
                          <span>GitHub</span>
                        </a>
                      )}
                      {project.githubLinks && project.githubLinks.map((link, i) => (
                        <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="btn btn--secondary">
                          <span>{link.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Scroll Hint */}
        <div className="scroll-hint" style={{ opacity: scrollProgress < 0.1 ? 1 : 0 }}>
          <span>Scroll to explore</span>
          <div className="scroll-arrow">↓</div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;