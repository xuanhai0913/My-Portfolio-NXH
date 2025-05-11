import React, { useEffect, useRef, useCallback } from 'react';
import { Squares } from '../../../components/common';
import { isInViewport } from '../../../utils';
import './styles/About.css';

const About = () => {
  const contentRefs = useRef({
    header: useRef(null),
    techSkills: useRef(null),
    softSkills: useRef(null),
    career: useRef(null)
  }).current;

  const setupObserver = useCallback(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(contentRefs).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      Object.values(contentRefs).forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
      observer.disconnect();
    };
  }, [contentRefs]);

  useEffect(() => {
    const cleanup = setupObserver();
    return cleanup;
  }, [setupObserver]);

  return (
    <section id="about" className="about-section">
      <Squares 
        speed={0.4} 
        squareSize={35}
        direction='diagonal'
        borderColor='rgba(255, 255, 255, 0.08)'
        hoverFillColor='rgba(74, 144, 226, 0.2)'
      />
      <div className="about-content">
        <div className="about-header slide-in" ref={contentRefs.header}>
          <h2>About Me</h2>
          <h3>Nguyễn Xuân Hải</h3>
          <p className="title">Full Stack Developer 👨‍💻</p>
          <p className="description">
            Passionate about creating innovative web solutions and delivering exceptional user experiences.
          </p>
        </div>

        <div className="skills-section fade-in" ref={contentRefs.techSkills}>
          <h4>Technical Skills</h4>
          <div className="skills">
            {['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Node.js', 'SQL', 'WordPress'].map((skill, index) => (
              <span key={skill} className="skill-tag" style={{ animationDelay: `${index * 0.1}s` }}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="skills-section fade-in" ref={contentRefs.softSkills}>
          <h4>Soft Skills</h4>
          <div className="skills">
            {['Teamwork', 'Problem Solving', 'Communication'].map((skill, index) => (
              <span key={skill} className="skill-tag soft" style={{ animationDelay: `${index * 0.1}s` }}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="career-goal slide-up" ref={contentRefs.career}>
          <h4>Career Goal</h4>
          <p>
            Seeking opportunities to contribute to innovative projects while continuously 
            expanding my technical expertise and creating impactful web solutions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;