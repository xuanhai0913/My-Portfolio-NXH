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
      description: "Free English teaching platform for community. Comprehensive learning resources.",
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

  // Pinned positions - spread evenly across the whole viewport
  const pinnedPositions = [
    { x: -38, y: -32, rotate: -6, scale: 0.35 },  // Top Left
    { x: 38, y: -30, rotate: 5, scale: 0.33 },    // Top Right
    { x: -40, y: 0, rotate: -4, scale: 0.34 },    // Middle Left
    { x: 40, y: 5, rotate: 6, scale: 0.32 },      // Middle Right
    { x: -35, y: 30, rotate: -5, scale: 0.33 },   // Bottom Left
    { x: 35, y: 32, rotate: 4, scale: 0.34 },     // Bottom Right
    { x: 0, y: -35, rotate: 3, scale: 0.32 },     // Top Center
    { x: -20, y: 38, rotate: -3, scale: 0.31 },   // Bottom Left-Center
    { x: 20, y: 35, rotate: 2, scale: 0.33 },     // Bottom Right-Center
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

      // Active card based on progress
      const projectIndex = Math.floor(progress * allProjects.length);
      setActiveIndex(Math.min(projectIndex, allProjects.length - 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [allProjects.length]);

  // Get card state: 'active', 'pinned', or 'waiting'
  const getCardState = (index) => {
    if (index === activeIndex) return 'active';
    if (index < activeIndex) return 'pinned';
    return 'waiting';
  };

  // Get transition progress within current card (0 to 1)
  const getCardTransitionProgress = (index) => {
    const cardDuration = 1 / allProjects.length;
    const cardStart = index * cardDuration;
    const localProgress = (scrollProgress - cardStart) / cardDuration;
    return Math.max(0, Math.min(1, localProgress));
  };

  return (
    <section id="portfolio" className="portfolio-section" ref={sectionRef}>
      <div className="portfolio-sticky">
        {/* Title */}
        <h2 className="portfolio-title">PROJECTS_</h2>

        {/* Counter */}
        <div className="portfolio-counter">
          <span className="counter-current">{String(activeIndex + 1).padStart(2, '0')}</span>
          <span className="counter-divider">/</span>
          <span className="counter-total">{String(allProjects.length).padStart(2, '0')}</span>
        </div>

        {/* Pinboard Background - shows pinned cards */}
        <div className="pinboard">
          {allProjects.map((project, index) => {
            const state = getCardState(index);
            const pos = pinnedPositions[index];
            const transitionProgress = getCardTransitionProgress(index);

            // Only show pinned cards in the pinboard
            if (state !== 'pinned') return null;

            return (
              <div
                key={`pinned-${index}`}
                className={`pinned-card ${project.variant ? `card-${project.variant}` : ''}`}
                style={{
                  transform: `translate(${pos.x}%, ${pos.y}%) rotate(${pos.rotate}deg) scale(${pos.scale})`,
                  opacity: 0.6,
                }}
              >
                <div className="pinned-card__pin">📌</div>
                <img src={project.image} alt={project.title} />
                <div className="pinned-card__label">{project.title}</div>
              </div>
            );
          })}
        </div>

        {/* Active Card Stage */}
        <div className="card-stage">
          {allProjects.map((project, index) => {
            const state = getCardState(index);
            const transitionProgress = getCardTransitionProgress(index);
            const variantClass = project.variant ? `card-${project.variant}` : '';

            let style = {};
            let className = `story-card ${variantClass}`;

            if (state === 'active') {
              className += ' active';
              // Entrance animation (first 30%), Stay (40%-70%), Exit animation (last 30%)
              if (transitionProgress < 0.3) {
                // Entering
                const enterProgress = transitionProgress / 0.3;
                style = {
                  transform: `translateY(${(1 - enterProgress) * 100}px) scale(${0.9 + enterProgress * 0.1})`,
                  opacity: enterProgress,
                };
              } else if (transitionProgress < 0.7) {
                // Staying visible
                style = {
                  transform: 'translateY(0) scale(1)',
                  opacity: 1,
                };
              } else {
                // Exiting - moving to pinboard position
                const exitProgress = (transitionProgress - 0.7) / 0.3;
                const pos = pinnedPositions[index];
                style = {
                  transform: `
                    translate(${exitProgress * pos.x}%, ${exitProgress * pos.y}%)
                    rotate(${exitProgress * pos.rotate}deg)
                    scale(${1 - exitProgress * (1 - pos.scale)})
                  `,
                  opacity: 1 - exitProgress * 0.4,
                };
              }
            } else if (state === 'waiting') {
              className += ' waiting';
              style = {
                transform: 'translateY(100px) scale(0.9)',
                opacity: 0,
                pointerEvents: 'none',
              };
            } else {
              // Pinned - handled in pinboard layer
              return null;
            }

            return (
              <article key={index} className={className} style={style}>
                <div className="story-card__inner">
                  {/* Image Side */}
                  <div className="story-card__media">
                    <img src={project.image} alt={project.title} />
                    {project.badge && <span className="story-card__badge">{project.badge}</span>}
                    <div className="story-card__index">{String(index + 1).padStart(2, '0')}</div>
                  </div>

                  {/* Content Side */}
                  <div className="story-card__content">
                    {project.company && (
                      <div className="story-card__company">{project.company}</div>
                    )}
                    <h3 className="story-card__title">{project.title}</h3>
                    <p className="story-card__desc">{project.description}</p>

                    <div className="story-card__techs">
                      {project.technologies.map((tech, i) => (
                        <span key={i}>{tech}</span>
                      ))}
                    </div>

                    <div className="story-card__actions">
                      {project.demo && (
                        <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn-primary">
                          Visit Site →
                        </a>
                      )}
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                          GitHub
                        </a>
                      )}
                      {project.githubLinks && project.githubLinks.map((link, i) => (
                        <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator" style={{ opacity: scrollProgress < 0.05 ? 1 : 0 }}>
          <span>Scroll to explore projects</span>
          <div className="scroll-arrow">↓</div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;