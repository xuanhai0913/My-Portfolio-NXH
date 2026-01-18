import React from 'react';
import './styles/About.css';

const About = () => {
  const technicalSkills = ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Node.js', 'SQL', 'WordPress'];
  const softSkills = ['Teamwork', 'Problem Solving', 'Communication'];

  return (
    <section id="about" className="about-section">
      <div className="about-container">
        {/* Left Column */}
        <div className="about-content">
          <h2 className="about-title header-outline">ABOUT ME</h2>

          <div className="about-info">
            <p className="about-name">NGUYỄN XUÂN HẢI</p>
            <p className="about-description">
              Passionate about creating innovative web solutions and delivering
              exceptional user experiences. I thrive on solving complex problems
              with elegant code.
            </p>

            <div className="about-quote">
              <p>
                "Seeking opportunities to contribute to innovative projects while
                continuously expanding my technical expertise and creating impactful
                web solutions."
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Skills */}
        <div className="about-skills">
          <div className="skills-group">
            <h3 className="skills-title">TECHNICAL SKILLS</h3>
            <div className="skills-list">
              {technicalSkills.map((skill) => (
                <span key={skill} className="skill-tag tech">{skill}</span>
              ))}
            </div>
          </div>

          <div className="skills-group">
            <h3 className="skills-title">SOFT SKILLS</h3>
            <div className="skills-list">
              {softSkills.map((skill) => (
                <span key={skill} className="skill-tag soft">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;