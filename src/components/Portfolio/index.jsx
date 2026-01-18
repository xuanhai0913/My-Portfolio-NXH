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
  const [activePair, setActivePair] = useState(0);
  const [pairProgress, setPairProgress] = useState(0);

  // All 9 projects in pairs (2 at a time, last pair has 1)
  const projectPairs = [
    // Pair 1
    [
      {
        title: "Great Link Mai House",
        description: "B2B Import-Export Platform. Corporate website for leading Media & B2B company. Features consultation, trade connections, and event services.",
        image: prj8,
        demo: "https://greatlinkmaihouse.com/",
        technologies: ["ASP.NET Core", "SQL Server", "C#"],
        badge: "B2B",
        isCommercial: true
      },
      {
        title: "Education English Community",
        description: "Free English learning platform for ECH Community. Features comprehensive resources, interactive lessons, and community support.",
        image: prj6,
        demo: "https://ech.edu.vn",
        technologies: ["PHP", "MySQL", "WordPress"],
        isCommercial: true
      }
    ],
    // Pair 2
    [
      {
        title: "VN Media Hub",
        description: "Full-Stack Blog Platform with ASP.NET Core backend and React frontend. Multi-category management, SEO-friendly URLs, view counter.",
        image: prj3,
        demo: "https://vnmediahub.com",
        technologies: [".NET Core", "React", "SQL Server"],
        isCommercial: true
      },
      {
        title: "Vision Key AI",
        description: "Multi-platform AI assistant with Google Gemini 2.0 Flash. Available as macOS app, Chrome Extension Premium (SaaS), Windows coming.",
        image: visionKey,
        demo: "https://visionpremium.hailamdev.space",
        technologies: ["Swift", "Next.js", "Gemini AI"],
        badge: "AI"
      }
    ],
    // Pair 3
    [
      {
        title: "LLM Unit Test Generator",
        description: "AI-powered testing tool using Deepseek LLM to generate unit tests. Supports Python, JavaScript, TypeScript with multiple frameworks.",
        image: prj10,
        demo: "/videos",
        technologies: ["React", "Node.js", "Deepseek AI"],
        hasVideoDemo: true,
        badge: "AI"
      },
      {
        title: "Portfolio Website",
        description: "Modern React portfolio with interactive GSAP animations and responsive design. Clean brutalist aesthetic.",
        image: prj1,
        demo: "https://www.hailamdev.space/",
        github: "https://github.com/xuanhai0913/My-Portfolio-NXH",
        technologies: ["React", "GSAP", "CSS3"]
      }
    ],
    // Pair 4
    [
      {
        title: "Happy New Year",
        description: "Animated greeting website with festive effects. Using HTML, CSS, and JavaScript animations.",
        image: prj5,
        demo: "https://happynewyear.hailamdev.space/",
        github: "https://github.com/xuanhai0913/HappyNewYear",
        technologies: ["HTML5", "CSS3", "JavaScript"]
      },
      {
        title: "SPRM - Student Management",
        description: "Full-stack education management system. Student performance tracking, resource management, and admin tools.",
        image: prj7,
        demo: "https://cnpm-fullstack-react-csharp.onrender.com",
        github: "https://github.com/xuanhai0913/CNPM-Fullstack-React-CSharp",
        technologies: ["React", "C#", "ASP.NET Core"]
      }
    ],
    // Pair 5 (single card)
    [
      {
        title: "OTP API Service",
        description: "Web service for renting phone numbers to receive OTP codes. Real-time OTP retrieval with SMS Gateway integration.",
        image: prj9,
        demo: "https://shop.hailamdev.space/",
        github: "https://github.com/xuanhai0913/OTP-API",
        technologies: ["Node.js", "Express", "MongoDB"],
        badge: "API"
      },
      null // Empty slot for odd number
    ]
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;

      const scrolled = viewportHeight - sectionTop;
      const scrollableHeight = sectionHeight - viewportHeight;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));

      const totalPairs = projectPairs.length;
      const pairIndex = Math.floor(progress * totalPairs);
      const currentPair = Math.min(pairIndex, totalPairs - 1);

      const pairSegment = 1 / totalPairs;
      const pairStart = currentPair * pairSegment;
      const withinPair = (progress - pairStart) / pairSegment;

      setActivePair(currentPair);
      setPairProgress(Math.max(0, Math.min(1, withinPair)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [projectPairs.length]);

  const renderCard = (project, isLeft) => {
    if (!project) return <div className="project-card empty"></div>;

    return (
      <div className={`project-card ${isLeft ? 'card-left' : 'card-right'}`}>
        <div className="card-image-box">
          <img src={project.image} alt={project.title} />
          {project.badge && <span className="card-badge">{project.badge}</span>}
        </div>
        <div className="card-info">
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <div className="card-techs">
            {project.technologies.map((t, i) => <span key={i}>{t}</span>)}
          </div>
          <div className="card-actions">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="card-link secondary">
                <i className="fab fa-github"></i> SOURCE
              </a>
            )}
            {project.hasVideoDemo ? (
              <Link to={project.demo} className="card-link">WATCH DEMO</Link>
            ) : (
              <a href={project.demo} target="_blank" rel="noopener noreferrer" className="card-link">
                {project.isCommercial ? 'VISIT SITE' : 'LIVE DEMO'}
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="portfolio" className="portfolio-section" ref={sectionRef}>
      <div className="portfolio-sticky">
        <h2 className="portfolio-title">PROJECTS_</h2>

        <div className="portfolio-nav">
          {projectPairs.map((_, index) => (
            <div
              key={index}
              className={`nav-dot ${index === activePair ? 'active' : ''} ${index < activePair ? 'past' : ''}`}
            />
          ))}
        </div>

        <div className="portfolio-stage">
          {projectPairs.map((pair, pairIndex) => {
            const isActive = pairIndex === activePair;
            const isPast = pairIndex < activePair;
            const isFuture = pairIndex > activePair;

            let leftOffset = 0;
            let rightOffset = 0;
            let opacity = 0;

            if (isActive) {
              if (pairProgress < 0.25) {
                const slideIn = pairProgress / 0.25;
                leftOffset = -100 * (1 - slideIn);
                rightOffset = 100 * (1 - slideIn);
                opacity = slideIn;
              } else if (pairProgress < 0.75) {
                leftOffset = 0;
                rightOffset = 0;
                opacity = 1;
              } else {
                const slideOut = (pairProgress - 0.75) / 0.25;
                leftOffset = -100 * slideOut;
                rightOffset = 100 * slideOut;
                opacity = 1 - slideOut;
              }
            }

            return (
              <div
                key={pairIndex}
                className={`portfolio-pair ${isActive ? 'active' : ''} ${isPast ? 'past' : ''} ${isFuture ? 'future' : ''}`}
                style={isActive ? {
                  '--left-offset': `${leftOffset}%`,
                  '--right-offset': `${rightOffset}%`,
                  '--opacity': opacity
                } : {}}
              >
                <div className="pair-left" style={isActive ? { transform: `translateX(${leftOffset}%)`, opacity } : {}}>
                  {renderCard(pair[0], true)}
                </div>
                <div className="pair-right" style={isActive ? { transform: `translateX(${rightOffset}%)`, opacity } : {}}>
                  {renderCard(pair[1], false)}
                </div>
              </div>
            );
          })}
        </div>

        <div className="portfolio-counter">
          <span className="current">{String(activePair + 1).padStart(2, '0')}</span>
          <span className="divider">/</span>
          <span className="total">{String(projectPairs.length).padStart(2, '0')}</span>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;