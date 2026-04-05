import React, { useRef, useEffect, useState } from 'react';
import { trackProjectClick } from '../../utils/analytics';
import ProjectCard3D from './ProjectCard3D';
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
  const projectListRef = useRef(null);
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);
  const prevIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const allProjects = [
    {
      title: "Great Link Mai House",
      description: "Corporate website for leading Media & B2B company. Built with enterprise-grade security and scalability in mind.",
      image: prj8,
      demo: "https://greatlinkmaihouse.com/",
      technologies: ["ASP.NET Core", "SQL Server", "C#"],
      badge: "B2B",
      company: "GREATLINK MAIHOUSE",
      year: "2024"
    },
    {
      title: "Education English",
      description: "Free English teaching platform for community. Empowering students with accessible education.",
      image: prj6,
      demo: "https://ech.edu.vn",
      technologies: ["PHP", "MySQL", "WordPress"],
      company: "ECH COMMUNITY",
      year: "2024"
    },
    {
      title: "VN Media Hub",
      description: "Professional blog platform with .NET Core backend. Modern CMS with SEO optimization.",
      image: prj3,
      demo: "https://vnmediahub.com",
      github: "https://github.com/xuanhai0913/VNMediaHub",
      technologies: [".NET Core", "React", "SQL"],
      company: "VN MEDIA HUB",
      year: "2024"
    },
    {
      title: "Vision Key AI",
      description: "Multi-platform AI assistant powered by Gemini 2.0. Available on MacOS, Chrome Extension.",
      image: visionKey,
      technologies: ["Swift", "Next.js", "AI"],
      badge: "AI",
      demo: "https://visionpremium.hailamdev.space",
      githubLinks: [
        { url: "https://github.com/xuanhai0913/Vision-Key", label: "MacOS" },
        { url: "https://github.com/xuanhai0913/Extension-Vision-Premium", label: "Premium" },
        { url: "https://github.com/xuanhai0913/Extension-Vision-Key", label: "Standard" }
      ],
      year: "2025"
    },
    {
      title: "LLM Unit Test Gen",
      description: "AI-powered tool generating unit tests using Deepseek LLM. Boost your development productivity.",
      image: prj10,
      demo: "/videos",
      github: "https://github.com/xuanhai0913/LLM-Unit-tests",
      technologies: ["React", "Deepseek", "Node.js"],
      badge: "FEATURED",
      year: "2025"
    },
    {
      title: "Portfolio Website",
      description: "Modern brutalist portfolio with GSAP animations. Showcasing creative design and development skills.",
      image: prj1,
      demo: "https://www.hailamdev.space/",
      github: "https://github.com/xuanhai0913/My-Portfolio-NXH",
      technologies: ["React", "GSAP", "CSS3"],
      year: "2024"
    },
    {
      title: "Happy New Year",
      description: "Animated festive greeting website with interactive canvas animations and particle effects.",
      image: prj5,
      demo: "https://happynewyear.hailamdev.space/",
      github: "https://github.com/xuanhai0913/Happy-New-Year",
      technologies: ["HTML5", "JS", "Canvas"],
      year: "2024"
    },
    {
      title: "SPRM Management",
      description: "Student performance tracking system. Comprehensive dashboard for educators and students.",
      image: prj7,
      demo: "https://cnpm-fullstack-react-csharp.onrender.com",
      github: "https://github.com/xuanhai0913/CNPM-Fullstack-React-CSharp",
      technologies: ["React", "C#", "EF Core"],
      year: "2023"
    },
    {
      title: "OTP API Service",
      description: "Phone rental service for OTP verification. Secure and reliable API infrastructure.",
      image: prj9,
      demo: "https://shop.hailamdev.space/",
      technologies: ["Node.js", "MongoDB", "Express"],
      badge: "API",
      year: "2023"
    }
  ];

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 900px)');
    const updateMode = () => setIsMobile(mediaQuery.matches);

    updateMode();
    mediaQuery.addEventListener('change', updateMode);
    return () => mediaQuery.removeEventListener('change', updateMode);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setScrollProgress((activeIndex + 1) / allProjects.length);
      return undefined;
    }

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
      if (newIndex !== prevIndexRef.current) {
        prevIndexRef.current = newIndex;
        setActiveIndex(newIndex);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [allProjects.length, activeIndex, isMobile]);

  // Handle project click from list
  const handleProjectClick = (index) => {
    setActiveIndex(index);
    prevIndexRef.current = index;

    if (isMobile) return;

    // Scroll to appropriate position
    if (sectionRef.current) {
      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      const totalScrollable = sectionHeight - viewportHeight;
      const targetScroll = sectionTop + (index / allProjects.length) * totalScrollable;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  const handlePrevProject = () => {
    setActiveIndex((prev) => (prev - 1 + allProjects.length) % allProjects.length);
  };

  const handleNextProject = () => {
    setActiveIndex((prev) => (prev + 1) % allProjects.length);
  };

  const handleStageTouchStart = (event) => {
    if (!isMobile) return;
    const firstTouch = event.touches[0];
    touchStartXRef.current = firstTouch.clientX;
    touchStartYRef.current = firstTouch.clientY;
  };

  const handleStageTouchEnd = (event) => {
    if (!isMobile || touchStartXRef.current === null || touchStartYRef.current === null) {
      return;
    }

    const endTouch = event.changedTouches[0];
    const deltaX = endTouch.clientX - touchStartXRef.current;
    const deltaY = endTouch.clientY - touchStartYRef.current;

    touchStartXRef.current = null;
    touchStartYRef.current = null;

    // Ignore mostly vertical gestures so natural page scrolling still works.
    if (Math.abs(deltaX) < Math.abs(deltaY)) return;

    const SWIPE_THRESHOLD = 45;
    if (deltaX <= -SWIPE_THRESHOLD) {
      handleNextProject();
    } else if (deltaX >= SWIPE_THRESHOLD) {
      handlePrevProject();
    }
  };

  const activeProject = allProjects[activeIndex];

  const renderShowcaseCard = (project) => (
    <article className="showcase-card">
      <div className="showcase-visual">
        <div className="visual-frame">
          <ProjectCard3D image={project.image} isActive={true} />
        </div>
        {project.badge && (
          <div className="showcase-badge">{project.badge}</div>
        )}
      </div>

      <div className="showcase-info">
        {project.company && (
          <span className="showcase-company">{project.company}</span>
        )}
        <h3 className="showcase-title">{project.title}</h3>
        <p className="showcase-desc">{project.description}</p>

        <div className="showcase-tech">
          {project.technologies.map((tech, i) => (
            <span key={i} className="tech-pill">{tech}</span>
          ))}
        </div>

        <div className="showcase-actions">
          {project.demo && (
            <a
              href={project.demo}
              target={project.demo.startsWith('/') ? '_self' : '_blank'}
              rel="noopener noreferrer"
              className="action-btn primary"
              onClick={() => trackProjectClick(project.title, 'demo')}
            >
              <span className="btn-text">VISIT SITE</span>
              <span className="btn-icon">↗</span>
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn secondary"
              onClick={() => trackProjectClick(project.title, 'github')}
            >
              <span className="btn-text">GITHUB_</span>
            </a>
          )}
          {project.githubLinks && project.githubLinks.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn secondary"
              onClick={() => trackProjectClick(project.title, `github-${link.label}`)}
            >
              <span className="btn-text">{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </article>
  );

  return (
    <section id="portfolio" className="portfolio-section portfolio-scrollytelling" ref={sectionRef}>
      <div className="portfolio-sticky">
        {/* Fixed Header */}
        <div className="portfolio-header scrolly-header">
          <h2 className="section-title glitch-text" data-text="PROJECTS_">PROJECTS_</h2>
          <div className="project-counter">
            <span className="current">{String(activeIndex + 1).padStart(2, '0')}</span>
            <span className="divider">/</span>
            <span className="total">{String(allProjects.length).padStart(2, '0')}</span>
          </div>
        </div>

        {isMobile ? (
          <div className="portfolio-mobile">
            <div className="mobile-project-nav" role="tablist" aria-label="Project navigation">
              {allProjects.map((project, index) => (
                <button
                  key={index}
                  role="tab"
                  aria-selected={activeIndex === index}
                  className={`mobile-nav-item ${activeIndex === index ? 'active' : ''}`}
                  onClick={() => handleProjectClick(index)}
                >
                  <span className="mobile-nav-index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="mobile-nav-title">{project.title}</span>
                </button>
              ))}
            </div>

            <div
              className="mobile-project-stage"
              onTouchStart={handleStageTouchStart}
              onTouchEnd={handleStageTouchEnd}
            >
              {renderShowcaseCard(activeProject)}
            </div>

            <p className="mobile-swipe-hint">Swipe left or right to change project</p>

            <div className="mobile-project-controls">
              <button type="button" className="mobile-control-btn" onClick={handlePrevProject}>
                PREV
              </button>
              <span className="mobile-control-counter">
                {String(activeIndex + 1).padStart(2, '0')} / {String(allProjects.length).padStart(2, '0')}
              </span>
              <button type="button" className="mobile-control-btn" onClick={handleNextProject}>
                NEXT
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Main Content Grid */}
            <div className="scrollytelling-grid">
              {/* Project List (Left Side) */}
              <div className="project-list" ref={projectListRef}>
                <div className="list-inner">
                  {allProjects.map((project, index) => (
                    <button
                      key={index}
                      className={`project-list-item ${activeIndex === index ? 'active' : ''} ${index < activeIndex ? 'passed' : ''}`}
                      onClick={() => handleProjectClick(index)}
                    >
                      <span className="item-index">{String(index + 1).padStart(2, '0')}</span>
                      <div className="item-content">
                        <span className="item-title">{project.title}</span>
                        {project.badge && <span className="item-badge">{project.badge}</span>}
                      </div>
                      <span className="item-year">{project.year}</span>
                      <div className="item-progress">
                        <div
                          className="progress-fill"
                          style={{
                            transform: `scaleX(${activeIndex === index ? 1 : activeIndex > index ? 1 : 0})`,
                          }}
                        ></div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Project Detail (Right Side) */}
              <div className="project-showcase">
                {renderShowcaseCard(activeProject)}
              </div>
            </div>

            {/* Vertical Progress Indicator */}
            <div className="scroll-progress">
              <div
                className="progress-bar"
                style={{ height: `${scrollProgress * 100}%` }}
              ></div>
              <div className="progress-dots">
                {allProjects.map((_, index) => (
                  <div
                    key={index}
                    className={`progress-dot ${activeIndex >= index ? 'active' : ''}`}
                    onClick={() => handleProjectClick(index)}
                  ></div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Scroll Hint */}
        <div className={`scroll-hint ${scrollProgress > 0.1 || isMobile ? 'hidden' : ''}`}>
          <span className="hint-text">SCROLL TO EXPLORE</span>
          <div className="hint-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5L12 19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;