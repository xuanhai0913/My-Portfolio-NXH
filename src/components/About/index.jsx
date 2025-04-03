import React from 'react';
import './styles/About.css';

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-content">
        <h2>About Me</h2>
        <div className="about-text">
          <h3>Frontend Developer</h3>
          <p>Passionate about creating beautiful and functional web experiences.</p>
          <div className="skills">
            <span className="skill-tag">React</span>
            <span className="skill-tag">JavaScript</span>
            <span className="skill-tag">CSS</span>
            <span className="skill-tag">HTML</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;