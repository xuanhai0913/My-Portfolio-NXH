import React from 'react';
import Squares from '../Squares';
import './styles/About.css';

const About = () => {
  return (
    <section id="about" className="about-section">
      <Squares 
        speed={0.5} 
        squareSize={40}
        direction='diagonal'
        borderColor='rgba(255, 255, 255, 0.1)'
        hoverFillColor='rgba(74, 144, 226, 0.3)'
      />
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