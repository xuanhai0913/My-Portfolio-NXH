import React, { useRef, useEffect, useState } from 'react';
import './styles/About.css';

const About = () => {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const technicalSkills = ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Node.js', 'SQL', 'WordPress'];
  const softSkills = ['Teamwork', 'Problem Solving', 'Communication'];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Calculate progress based on how far the section has scrolled
      const scrolled = -rect.top;
      const totalScroll = sectionHeight - viewportHeight;
      const progress = Math.max(0, Math.min(1, scrolled / totalScroll));

      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation helpers
  const getOpacity = (start, end) => {
    if (scrollProgress < start) return 0;
    if (scrollProgress > end) return 1;
    return (scrollProgress - start) / (end - start);
  };

  const getTranslateY = (start, end, amount = 50) => {
    if (scrollProgress < start) return amount;
    if (scrollProgress > end) return 0;
    const progress = (scrollProgress - start) / (end - start);
    return amount * (1 - progress);
  };

  // Phase 1: Intro (0.05 - 0.25)
  const introOpacity = getOpacity(0.05, 0.25);
  const introY = getTranslateY(0.05, 0.25, 50);

  // Phase 2: Tech Skills (0.3 - 0.5)
  const techOpacity = getOpacity(0.3, 0.5);
  const techY = getTranslateY(0.3, 0.5, 50);

  // Phase 3: Soft Skills (0.55 - 0.75)
  const softOpacity = getOpacity(0.55, 0.75);
  const softY = getTranslateY(0.55, 0.75, 50);

  // Phase 4: Quote (0.8 - 0.95)
  const quoteOpacity = getOpacity(0.8, 0.95);
  const quoteScale = scrollProgress > 0.8 ? 0.9 + ((scrollProgress - 0.8) / 0.15) * 0.1 : 0.9;

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      <div className="about-sticky">
        <div className="about-container">

          {/* Header - Always visible but scales slightly */}
          <h2
            className="about-title header-outline"
            style={{
              transform: `scale(${1 + scrollProgress * 0.2})`,
              opacity: 1 - scrollProgress * 0.5
            }}
          >
            ABOUT ME
          </h2>

          <div className="about-grid">
            {/* Left Column - Intro Info */}
            <div
              className="about-content"
              style={{
                opacity: introOpacity,
                transform: `translateY(${introY}px)`
              }}
            >
              <div className="about-info">
                <p className="about-name">NGUYỄN XUÂN HẢI</p>
                <p className="about-description">
                  Passionate about creating innovative web solutions and delivering
                  exceptional user experiences. I thrive on solving complex problems
                  with elegant code.
                </p>
              </div>
            </div>

            {/* Right Column - Skills */}
            <div className="about-skills">
              {/* Tech Skills */}
              <div
                className="skills-group"
                style={{
                  opacity: techOpacity,
                  transform: `translateY(${techY}px)`
                }}
              >
                <h3 className="skills-title">TECHNICAL SKILLS</h3>
                <div className="skills-list">
                  {technicalSkills.map((skill, i) => (
                    <span
                      key={skill}
                      className="skill-tag tech"
                      style={{ transitionDelay: `${i * 0.05}s` }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Soft Skills */}
              <div
                className="skills-group"
                style={{
                  opacity: softOpacity,
                  transform: `translateY(${softY}px)`
                }}
              >
                <h3 className="skills-title">SOFT SKILLS</h3>
                <div className="skills-list">
                  {softSkills.map((skill) => (
                    <span key={skill} className="skill-tag soft">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quote - Bottom Centered */}
          <div
            className="about-quote-wrapper"
            style={{
              opacity: quoteOpacity,
              transform: `scale(${quoteScale}) translateY(${(1 - quoteOpacity) * 20}px)`
            }}
          >
            <div className="about-quote">
              <p>
                "Seeking opportunities to contribute to innovative projects while
                continuously expanding my technical expertise and creating impactful
                web solutions."
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator for the about section specifically */}
      <div
        className="about-scroll-indicator"
        style={{ opacity: scrollProgress < 0.1 ? 1 : 0 }}
      >
        <span>Keep Scrolling</span>
        <div className="arrow">↓</div>
      </div>
    </section>
  );
};

export default About;