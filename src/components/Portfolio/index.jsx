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
  const videoRef = useRef(null);
  const projectListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

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

      // Parallax effect for video
      if (videoRef.current) {
        const parallaxOffset = scrolled * 0.3;
        videoRef.current.style.transform = `translateY(${parallaxOffset}px) scale(1.1)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [allProjects.length]);

  // Handle project click from list
  const handleProjectClick = (index) => {
    setActiveIndex(index);
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

  const activeProject = allProjects[activeIndex];

  return (
    <section id="portfolio" className="portfolio-section portfolio-scrollytelling" ref={sectionRef}>
      {/* Video Background */}
      <div className="video-background">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          className={`bg-video ${isVideoLoaded ? 'loaded' : ''}`}
        >
          <source src="/Nhan_Gai_Optimized.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
        <div className="video-grain"></div>
      </div>

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
            <article className="showcase-card" key={activeIndex}>
              <div className="showcase-visual">
                <div className="visual-frame">
                  <img
                    src={activeProject.image}
                    alt={activeProject.title}
                    className="showcase-image"
                  />
                  <div className="visual-glitch"></div>
                </div>
                {activeProject.badge && (
                  <div className="showcase-badge">{activeProject.badge}</div>
                )}
              </div>

              <div className="showcase-info">
                {activeProject.company && (
                  <span className="showcase-company">{activeProject.company}</span>
                )}
                <h3 className="showcase-title">{activeProject.title}</h3>
                <p className="showcase-desc">{activeProject.description}</p>

                <div className="showcase-tech">
                  {activeProject.technologies.map((tech, i) => (
                    <span key={i} className="tech-pill">{tech}</span>
                  ))}
                </div>

                <div className="showcase-actions">
                  {activeProject.demo && (
                    <a
                      href={activeProject.demo}
                      target={activeProject.demo.startsWith('/') ? '_self' : '_blank'}
                      rel="noopener noreferrer"
                      className="action-btn primary"
                    >
                      <span className="btn-text">VISIT SITE</span>
                      <span className="btn-icon">↗</span>
                    </a>
                  )}
                  {activeProject.github && (
                    <a
                      href={activeProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-btn secondary"
                    >
                      <span className="btn-text">GITHUB_</span>
                    </a>
                  )}
                  {activeProject.githubLinks && activeProject.githubLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-btn secondary"
                    >
                      <span className="btn-text">{link.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </article>
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

        {/* Scroll Hint */}
        <div className={`scroll-hint ${scrollProgress > 0.1 ? 'hidden' : ''}`}>
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