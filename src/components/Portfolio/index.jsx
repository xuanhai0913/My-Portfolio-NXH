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
  const [activeLeft, setActiveLeft] = useState(0);
  const [activeRight, setActiveRight] = useState(0);

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

  // Split projects: odd indices left, even indices right
  const leftProjects = allProjects.filter((_, i) => i % 2 === 0);
  const rightProjects = allProjects.filter((_, i) => i % 2 !== 0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Progress through the section (0 to 1)
      const scrolled = -rect.top;
      const totalScroll = sectionHeight - viewportHeight;
      const progress = Math.max(0, Math.min(1, scrolled / totalScroll));

      // Map progress to active card index
      const leftIndex = Math.floor(progress * leftProjects.length);
      const rightIndex = Math.floor(progress * rightProjects.length);

      setActiveLeft(Math.min(leftIndex, leftProjects.length - 1));
      setActiveRight(Math.min(rightIndex, rightProjects.length - 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [leftProjects.length, rightProjects.length]);

  const renderCard = (project, index, side, activeIndex) => {
    const variantClass = project.variant ? `card-${project.variant}` : '';
    const isActive = index === activeIndex;
    const isPast = index < activeIndex;
    const isFuture = index > activeIndex;

    let cardClass = 'slide-card';
    if (isActive) cardClass += ' active';
    if (isPast) cardClass += ' past';
    if (isFuture) cardClass += ' future';
    cardClass += ` ${side}`;

    return (
      <div key={index} className={`${cardClass} ${variantClass}`}>
        <div className="slide-card__header">
          <span>{(index * 2 + (side === 'right' ? 2 : 1)).toString().padStart(2, '0')}</span>
          <span>{project.company || "PERSONAL"}</span>
        </div>

        <div className="slide-card__image">
          <img src={project.image} alt={project.title} />
          {project.badge && <span className="slide-card__badge">{project.badge}</span>}
        </div>

        <div className="slide-card__body">
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <div className="slide-card__techs">
            {project.technologies.map((tech, i) => (
              <span key={i}>{tech}</span>
            ))}
          </div>
          <div className="slide-card__actions">
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer" className="slide-card__btn">
                VISIT
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="slide-card__btn slide-card__btn--secondary">
                GITHUB
              </a>
            )}
            {project.githubLinks && project.githubLinks.map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="slide-card__btn slide-card__btn--secondary">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="portfolio" className="portfolio-section" ref={sectionRef}>
      <div className="portfolio-sticky">
        <h2 className="portfolio-title">PROJECTS_</h2>

        <div className="slide-container">
          <div className="slide-track slide-track--left">
            {leftProjects.map((p, i) => renderCard(p, i, 'left', activeLeft))}
          </div>

          <div className="slide-track slide-track--right">
            {rightProjects.map((p, i) => renderCard(p, i, 'right', activeRight))}
          </div>
        </div>

        <div className="portfolio-counter">
          {String(activeLeft + activeRight + 2).padStart(2, '0')} / {String(allProjects.length).padStart(2, '0')}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;