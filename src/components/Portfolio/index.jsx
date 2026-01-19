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
import brushArrow from '../../images/brush-arrow.png';
import brushLine from '../../images/brush-line.png';

const Portfolio = () => {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showEndArrow, setShowEndArrow] = useState(false);

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
      variant: "dark"
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
      description: "AI tool generating unit tests using Deepseek LLM.",
      image: prj10,
      demo: "/videos",
      github: "https://github.com/xuanhai0913/LLM-Unit-tests",
      technologies: ["React", "Deepseek", "Node.js"],
      variant: "dark"
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
      variant: "dark"
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
      variant: "accent"
    }
  ];

  // Pinned positions - spread evenly across viewport
  const pinnedPositions = [
    { top: 12, left: 5, rotate: -5 },
    { top: 8, left: 75, rotate: 4 },
    { top: 35, left: 3, rotate: -3 },
    { top: 40, left: 78, rotate: 5 },
    { top: 65, left: 8, rotate: -4 },
    { top: 60, left: 72, rotate: 3 },
    { top: 15, left: 40, rotate: 2 },
    { top: 75, left: 25, rotate: -2 },
    { top: 70, left: 60, rotate: 4 },
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
      // Use 90% of scroll for projects, last 10% for end transition
      const projectScrollEnd = totalScroll * 0.85;
      const progress = Math.max(0, Math.min(1, scrolled / projectScrollEnd));

      setScrollProgress(progress);

      // Show arrow when all projects are pinned
      setShowEndArrow(scrolled > projectScrollEnd * 0.95);

      // Active project based on progress
      const projectIndex = Math.floor(progress * allProjects.length);
      setActiveIndex(Math.min(projectIndex, allProjects.length - 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [allProjects.length]);

  // Get card state
  const getCardState = (index) => {
    if (index === activeIndex) return 'active';
    if (index < activeIndex) return 'pinned';
    return 'waiting';
  };

  // Get transition progress for current card
  const getCardTransitionProgress = (index) => {
    const cardDuration = 1 / allProjects.length;
    const cardStart = index * cardDuration;
    const localProgress = (scrollProgress - cardStart) / cardDuration;
    return Math.max(0, Math.min(1, localProgress));
  };

  // Calculate pinning animation progress (for cards transitioning to pinned state)
  const getPinningProgress = (index) => {
    const cardDuration = 1 / allProjects.length;
    const cardEnd = (index + 1) * cardDuration;
    const pinningStart = cardEnd - cardDuration * 0.3; // Last 30% of card duration
    const pinningProgress = (scrollProgress - pinningStart) / (cardDuration * 0.3);
    return Math.max(0, Math.min(1, pinningProgress));
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

        {/* Pinboard with animated pinned cards */}
        <div className="pinboard">
          {allProjects.map((project, index) => {
            const state = getCardState(index);
            const pos = pinnedPositions[index];
            const pinProgress = getPinningProgress(index);

            // Show during pinning animation OR when fully pinned
            if (state !== 'pinned' && !(state === 'active' && pinProgress > 0)) return null;

            // If currently animating to pinned position
            const isAnimating = state === 'active' && pinProgress > 0 && pinProgress < 1;

            let cardStyle;
            if (isAnimating) {
              // Smooth cubic bezier animation to pinned position
              const eased = 1 - Math.pow(1 - pinProgress, 3); // ease-out cubic
              cardStyle = {
                top: `calc(50% + ${(pos.top - 50) * eased}%)`,
                left: `calc(50% + ${(pos.left - 50) * eased}%)`,
                transform: `translate(-50%, -50%) rotate(${pos.rotate * eased}deg) scale(${1 - eased * 0.6})`,
                opacity: 0.9 - eased * 0.15,
                filter: `blur(${eased * 2}px) grayscale(${eased * 0.2})`,
              };
            } else {
              // Fully pinned
              cardStyle = {
                top: `${pos.top}%`,
                left: `${pos.left}%`,
                transform: `rotate(${pos.rotate}deg)`,
              };
            }

            return (
              <div
                key={`pinned-${index}`}
                className={`pinned-card ${project.variant ? `card-${project.variant}` : ''} ${isAnimating ? 'animating' : ''}`}
                style={cardStyle}
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
            const pinProgress = getPinningProgress(index);

            let style = {};
            let className = `story-card ${variantClass}`;

            if (state === 'active') {
              className += ' active';

              // When pinning starts, fade out the main card
              if (pinProgress > 0) {
                style = {
                  opacity: 1 - pinProgress,
                  transform: `scale(${1 - pinProgress * 0.1})`,
                  pointerEvents: 'none',
                };
              } else if (transitionProgress < 0.25) {
                // Entrance - slide up and fade in
                const enterProgress = transitionProgress / 0.25;
                const eased = 1 - Math.pow(1 - enterProgress, 3);
                style = {
                  transform: `translateY(${(1 - eased) * 80}px) scale(${0.92 + eased * 0.08})`,
                  opacity: eased,
                };
              } else {
                // Visible state
                style = {
                  transform: 'translateY(0) scale(1)',
                  opacity: 1,
                };
              }
            } else if (state === 'waiting') {
              className += ' waiting';
              style = {
                transform: 'translateY(80px) scale(0.92)',
                opacity: 0,
                pointerEvents: 'none',
              };
            } else {
              return null;
            }

            return (
              <article key={index} className={className} style={style}>
                <div className="story-card__inner">
                  <div className="story-card__media">
                    <img src={project.image} alt={project.title} />
                    {project.badge && <span className="story-card__badge">{project.badge}</span>}
                    <div className="story-card__index">{String(index + 1).padStart(2, '0')}</div>
                  </div>

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

        {/* End Transition Arrow */}
        <div className={`end-transition ${showEndArrow ? 'visible' : ''}`}>
          <div className="brush-line-container">
            <img src={brushLine} alt="" className="brush-line" />
          </div>
          <div className="brush-arrow-container">
            <img src={brushArrow} alt="Scroll Down" className="brush-arrow" />
          </div>
          <div className="end-transition__label">CERTIFICATIONS</div>
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