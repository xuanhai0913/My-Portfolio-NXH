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
  const [rotation, setRotation] = useState(0);

  // Full detailed projects list
  const allProjects = [
    {
      title: "Great Link Mai House",
      description: "Corporate website for leading Media & B2B company. Features consultation, trade connections, and event services.",
      image: prj8,
      demo: "https://greatlinkmaihouse.com/",
      technologies: ["ASP.NET Core", "SQL Server", "C#", "Bootstrap"],
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
      technologies: [".NET Core", "React"],
      isCommercial: true,
      company: "VN MEDIA HUB"
    },
    {
      title: "Vision Key AI",
      description: "Multi-platform AI assistant with Gemini 2.0. Auto-click support, screen analysis.",
      image: visionKey,
      technologies: ["Swift", "Next.js", "AI"],
      badge: "AI",
      variant: "accent",
      customLinks: [
        { url: "https://visionpremium.hailamdev.space", label: "Landing" }
      ]
    },
    {
      title: "LLM Unit Test Gen",
      description: "AI tool generating unit tests using Deepseek LLM.",
      image: prj10,
      demo: "/videos",
      technologies: ["React", "Deepseek"],
      hasVideoDemo: true,
      variant: "dark"
    },
    {
      title: "Portfolio Website",
      description: "Modern brutalist portfolio with GSAP animations.",
      image: prj1,
      demo: "https://www.hailamdev.space/",
      technologies: ["React", "GSAP"]
    },
    {
      title: "Happy New Year",
      description: "Animated festive greeting website.",
      image: prj5,
      demo: "https://happynewyear.hailamdev.space/",
      technologies: ["HTML5", "JS"],
      variant: "dark"
    },
    {
      title: "SPRM Management",
      description: "Student performance tracking system.",
      image: prj7,
      demo: "https://cnpm-fullstack-react-csharp.onrender.com",
      technologies: ["React", "C#"],
      variant: "default"
    },
    {
      title: "OTP API Service",
      description: "Phone rental service for OTP verification.",
      image: prj9,
      demo: "https://shop.hailamdev.space/",
      technologies: ["Node.js", "Mongo"],
      badge: "API",
      variant: "accent"
    }
  ];

  // Distribute to Left/Right
  const leftProjects = allProjects.filter((_, i) => i % 2 === 0);
  const rightProjects = allProjects.filter((_, i) => i % 2 !== 0);

  const itemSpacing = 45; // Spacing in degrees

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrolled = -rect.top + viewportHeight * 0.5;

      // Calculate rotation based on scroll
      const newRotation = scrolled * 0.1;
      setRotation(newRotation);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderCard = (project, index, side) => {
    const itemAngle = index * itemSpacing;
    const variantClass = project.variant ? `card-${project.variant}` : 'card-default';

    // Calculate current global angle of this item
    // Left wheel rotates clockwise (positive), Right wheel counter-clockwise (negative) if we want standard entry?
    // Let's standardise: Wheel rotates, Items attached.

    // Left Wheel:
    const wheelRotation = rotation;
    const currentItemAngle = itemAngle + wheelRotation; // Global angle

    // Determine visibility/falling state
    // We want items to appear at "entry" point and "fall" at "exit" point
    // Entry: around -90deg? Exit: around 90deg?
    // Let's normalize angle to 0-360
    const normAngle = ((currentItemAngle % 360) + 360) % 360;

    // If side is RIGHT, the wheel rotates opposite?
    // Let's keep logic simple: Wheel container rotates.
    // Item container counter-rotates to stay upright.

    // Counter-rotation to keep card upright:
    // transform: rotate(-rotation)

    const wrapperRotate = side === 'left' ? rotation : -rotation;
    const counterRotate = -wrapperRotate; // Keeps card perfectly vertical

    // "Gravity" Fall Effect
    // If the card is moving "out" of the view, add 'fall' transform
    // We can use the normalized angle to determine position in the arc
    // But CSS transition is smoother.

    return (
      <div
        key={index}
        className={`wheel-item ${side}`}
        style={{
          transform: `rotate(${itemAngle}deg) translate(var(--radius)) rotate(${-itemAngle}deg) rotate(${counterRotate}deg)`
        }}
      >
        <div className={`wheel-card-content ${variantClass}`}>
          {/* Card Content Structure */}
          <div className="card-header-mini">
            <span className="mini-index">{(index + 1).toString().padStart(2, '0')}</span>
            <span className="mini-company">{project.company || "PERSONAL"}</span>
          </div>

          <div className="wheel-card-image">
            <img src={project.image} alt={project.title} />
            {project.badge && <span className="card-badge">{project.badge}</span>}
          </div>

          <div className="wheel-card-info">
            <h3 className="project-title">{project.title}</h3>
            <p className="project-desc">{project.description}</p>

            <div className="wheel-techs">
              {project.technologies.slice(0, 4).map((t, i) => (
                <span key={i} className="tech-tag">{t}</span>
              ))}
            </div>

            <div className="card-actions">
              {/* Show all available links */}
              {project.customLinks ? (
                project.customLinks.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="wheel-btn">
                    {link.label}
                  </a>
                ))
              ) : (
                <>
                  {project.demo && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className="wheel-btn primary">
                      {project.hasVideoDemo ? 'WATCH DEMO' : 'VISIT SITE'}
                    </a>
                  )}
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="wheel-btn secondary">
                      GITHUB
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
          <span>SCROLL FOR GRAVITY</span>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;