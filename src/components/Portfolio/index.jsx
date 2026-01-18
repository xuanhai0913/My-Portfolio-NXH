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
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Full detailed projects list
  const allProjects = [
    {
      title: "Great Link Mai House",
      description: "Corporate website for leading Media & B2B company. Features consultation, trade connections, and event services.",
      image: prj8,
      demo: "https://greatlinkmaihouse.com/",
      technologies: ["ASP.NET Core", "SQL Server"],
      badge: "B2B",
      company: "GREATLINK MAIHOUSE"
    },
    {
      title: "Education English",
      description: "Free English teaching platform for community. Comprehensive learning resources and support.",
      image: prj6,
      demo: "https://ech.edu.vn",
      technologies: ["PHP", "MySQL"],
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

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Calculate scroll progress through the section
      // We want the scroll to drive the card stack
      const scrolled = -rect.top;
      const totalScrollable = sectionHeight - viewportHeight;
      const scrollProgress = Math.max(0, Math.min(1, scrolled / totalScrollable));

      setProgress(scrollProgress);

      // Map progress to active card index
      // Map 0 -> length
      const index = Math.min(
        Math.floor(scrollProgress * allProjects.length),
        allProjects.length - 1
      );
      setActiveIndex(index);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [allProjects.length]);

  return (
    <section id="portfolio" className="portfolio-section" ref={sectionRef}>
      <div className="portfolio-sticky">
        <h2 className="portfolio-title">PROJECTS_</h2>

        <div className="card-stack-container">
          {allProjects.map((project, index) => {
            // Determine state of this card
            // 0 -> Active/Top
            // < 0 -> Past (Felled)
            // > 0 -> Future (Stacked below)

            // Calculate a continuous "card index" based on scroll
            const realIndex = progress * allProjects.length;
            const diff = index - realIndex;

            // Logic for visual state:
            // If index < realIndex (it's past): It should fall down
            // If index is current (active): It stays
            // If index > realIndex (future): Stacked underneath

            let style = {};
            let className = 'stack-card';

            if (index < Math.floor(realIndex)) {
              // PAST (Fallen)
              className += ' past';
            } else if (index === Math.floor(realIndex)) {
              // ACTIVE
              // As we scroll through this index (e.g. 2.0 -> 2.9)
              // The card starts to fall
              const exitProgress = realIndex - index; // 0 to 1
              if (exitProgress > 0) {
                // It's starting to fall
                // Initial stage: slight tilt
                // Late stage: Drop
                style = {
                  '--exit-progress': exitProgress,
                  transform: `
                     translateY(${exitProgress * 50}vh) 
                     rotate(${exitProgress * 10}deg)
                     scale(${1 - exitProgress * 0.1})
                   `,
                  opacity: 1 - exitProgress * 0.5,
                  zIndex: 100 - index
                };
              } else {
                className += ' active';
                style = { zIndex: 100 - index };
              }
            } else {
              // FUTURE (Stacked)
              className += ' future';
              const depth = index - Math.floor(realIndex);
              // Stack effect: smaller and lower
              style = {
                transform: `
                   translateY(${depth * 10}px) 
                   scale(${1 - depth * 0.05})
                 `,
                opacity: 1 - depth * 0.2,
                zIndex: 100 - index,
                filter: `blur(${depth * 2}px)`
              };
            }

            return (
              <div key={index} className={className} style={style}>
                <div className={`card-inner ${project.variant ? `variant-${project.variant}` : ''}`}>
                  <div className="card-header">
                    <span className="card-index">{(index + 1).toString().padStart(2, '0')}</span>
                    {project.company && <span className="card-company">{project.company}</span>}
                  </div>

                  <div className="card-image-wrapper">
                    <img src={project.image} alt={project.title} />
                    {project.badge && <span className="card-badge">{project.badge}</span>}
                  </div>

                  <div className="card-body">
                    <h3 className="card-title">{project.title}</h3>
                    <p className="card-desc">{project.description}</p>

                    <div className="card-techs">
                      {project.technologies.map((t, i) => (
                        <span key={i}>{t}</span>
                      ))}
                    </div>

                    <div className="card-links">
                      {project.customLinks ? (
                        project.customLinks.map((l, i) => (
                          <a key={i} href={l.url} target="_blank" rel="noopener" className="card-btn">{l.label}</a>
                        ))
                      ) : (
                        <>
                          {project.demo && (
                            project.hasVideoDemo
                              ? <Link to={project.demo} className="card-btn">DEMO</Link>
                              : <a href={project.demo} target="_blank" rel="noopener" className="card-btn">VISIT</a>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Binding clip effect for Calendar look */}
                <div className="card-binding"></div>
              </div>
            );
          })}
        </div>

        <div className="portfolio-counter">
          Scroll for Gravity
        </div>
      </div>
    </section>
  );
};

export default Portfolio;