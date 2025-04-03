import React from 'react';
import Squares from '../Squares';
import './styles/About.css';

const About = () => {
  const projects = [
    {
      title: "Portfolio Website",
      description: "Modern React portfolio with interactive animations and responsive design",
      image: require("../../images/project/prj1.png"), // Updated path
      github: "https://github.com/xuanhai0913/My-Portfolio-NXH"
    },
    {
      title: "Koi Farm Management",
      description: "This project aims to build a Koi farm management website, providing customers with comprehensive information about Koi breeds, as well as Koi-related services such as buying, selling, consignment and care.",
      image: require("../../images/project/prj2.png"), // Updated path
      github: "https://github.com/xuanhai0913/Koi-Farm-Shop_Group-H"
    },
    {
      title: "🚀 Flutter Team Members App",
      description: "This is a simple Flutter application that displays a team member list using PageView. The app allows navigation between members and includes an option to return to the home screen.",
      image: require("../../images/project/prj3.png"), // Updated path
      github: "https://github.com/xuanhai0913/Flutter-my-app"
    },
    {
      title: "Koi Farm Management",
      description: "This project aims to build a Koi farm management website, providing customers with comprehensive information about Koi breeds, as well as Koi-related services such as buying, selling, consignment and care.",
      image: require("../../images/project/prj2.png"), // Updated path
      github: "https://github.com/xuanhai0913/Koi-Farm-Shop_Group-H"
    },
  ];

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
        <div className="about-header">
          <h2>About Me</h2>
          <h3>Nguyễn Xuân Hải</h3>
          <p className="title">Full Stack Developer 👨‍💻</p>
          <p className="description">
            Passionate about creating innovative web solutions and delivering exceptional user experiences.
          </p>
        </div>

        <div className="skills-section">
          <h4>Technical Skills</h4>
          <div className="skills">
            <span className="skill-tag">HTML5</span>
            <span className="skill-tag">CSS3</span>
            <span className="skill-tag">JavaScript</span>
            <span className="skill-tag">React.js</span>
            <span className="skill-tag">Node.js</span>
            <span className="skill-tag">SQL</span>
            <span className="skill-tag">WordPress</span>
          </div>

          <h4>Soft Skills</h4>
          <div className="skills">
            <span className="skill-tag soft">Teamwork</span>
            <span className="skill-tag soft">Problem Solving</span>
            <span className="skill-tag soft">Communication</span>
          </div>
        </div>

        <div className="projects-section">
          <h4>Featured Projects</h4>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <div key={index} className="project-card">
                <div className="project-image">
                  <img src={project.image} alt={project.title} />
                </div>
                <div className="project-content">
                  <h5>{project.title}</h5>
                  <p>{project.description}</p>
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-github"></i> View Project
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="career-goal">
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