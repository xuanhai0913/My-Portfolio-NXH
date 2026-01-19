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

  const allProjects = [
    {
      title: "Great Link Mai House",
      description: "Corporate website for leading Media & B2B company.",
      image: prj8,
      demo: "https://greatlinkmaihouse.com/",
      technologies: ["ASP.NET Core", "SQL Server"],
      badge: "B2B",
      company: "GREATLINK MAIHOUSE"
    },
    {
      title: "Education English",
      description: "Free English teaching platform for community.",
      image: prj6,
      demo: "https://ech.edu.vn",
      technologies: ["PHP", "MySQL"],
      company: "ECH COMMUNITY",
      variant: "dark"
    },
    {
      title: "VN Media Hub",
      description: "Professional blog platform with .NET Core backend.",
      image: prj3,
      demo: "https://vnmediahub.com",
      github: "https://github.com/xuanhai0913/VNMediaHub",
      technologies: [".NET Core", "React"],
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
      technologies: ["React", "Deepseek"],
      variant: "dark"
    },
    {
      title: "Portfolio Website",
      description: "Modern brutalist portfolio with GSAP animations.",
      image: prj1,
      demo: "https://www.hailamdev.space/",
      github: "https://github.com/xuanhai0913/My-Portfolio-NXH",
      technologies: ["React", "GSAP"]
    },
    {
      title: "Happy New Year",
      description: "Animated festive greeting website.",
      image: prj5,
      demo: "https://happynewyear.hailamdev.space/",
      github: "https://github.com/xuanhai0913/Happy-New-Year",
      technologies: ["HTML5", "JS"],
      variant: "dark"
    },
    {
      title: "SPRM Management",
      description: "Student performance tracking system.",
      image: prj7,
      demo: "https://cnpm-fullstack-react-csharp.onrender.com",
      github: "https://github.com/xuanhai0913/CNPM-Fullstack-React-CSharp",
      technologies: ["React", "C#"]
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

  const itemSpacing = 55; // Degrees between items

  // Initial offset to start first project in view
  const initialOffset = -30;

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Calculate scroll progress through section (0 to 1)
      const scrolled = -rect.top;
      const totalScroll = sectionHeight - viewportHeight;
      const progress = Math.max(0, Math.min(1, scrolled / totalScroll));

      // Calculate total rotation needed to show all projects
      // 5 projects per side × itemSpacing + buffer for first/last visibility
      const maxRotation = (5 * itemSpacing) + 60;

      // Apply rotation with initial offset
      const newRotation = initialOffset + (progress * maxRotation);
      setRotation(newRotation);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderCard = (project, index, side) => {
    const itemAngle = index * itemSpacing;
    const variantClass = project.variant ? `card-${project.variant}` : '';
    const wrapperRotate = side === 'left' ? rotation : -rotation;
    const counterRotate = -wrapperRotate;

    return (
      <div
        key={index}
        className="wheel-item"
        style={{
          transform: `rotate(${itemAngle}deg) translate(var(--radius)) rotate(${-itemAngle}deg) rotate(${counterRotate}deg)`
        }}
      >
        <div className={`wheel-card ${variantClass}`}>
          <div className="wheel-card__header">
            <span>{(index + 1).toString().padStart(2, '0')}</span>
            <span>{project.company || "PERSONAL"}</span>
          </div>

          <div className="wheel-card__image">
            <img src={project.image} alt={project.title} />
            {project.badge && <span className="wheel-card__badge">{project.badge}</span>}
          </div>

          <div className="wheel-card__body">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="wheel-card__techs">
              {project.technologies.map((tech, i) => (
                <span key={i}>{tech}</span>
              ))}
            </div>
            <div className="wheel-card__actions">
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="wheel-card__btn">
                  VISIT
                </a>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="wheel-card__btn wheel-card__btn--secondary">
                  GITHUB
                </a>
              )}
              {project.githubLinks && project.githubLinks.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="wheel-card__btn wheel-card__btn--secondary">
                  {link.label}
                </a>
              ))}
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
            className="wheel-wrapper wheel-wrapper--left"
            style={{ transform: `translate(-50%, -50%) rotate(${rotation}deg)` }}
          >
            {leftProjects.map((p, i) => renderCard(p, i, 'left'))}
          </div>

          <div
            className="wheel-wrapper wheel-wrapper--right"
            style={{ transform: `translate(50%, -50%) rotate(${-rotation}deg)` }}
          >
            {rightProjects.map((p, i) => renderCard(p, i, 'right'))}
          </div>
        </div>

        <div className="scroll-hint">SCROLL FOR GRAVITY</div>
      </div>
    </section>
  );
};

export default Portfolio;