import React, { useEffect, useRef } from 'react';
import Squares from '../Squares';
import TextPressure from '../TextPressure';
import './styles/Portfolio.css';

const Portfolio = () => {
  const projects = [
    {
      title: "Portfolio Website",
      description: "Modern React portfolio with interactive animations and responsive design",
      image: require("../../images/project/prj1.png"),
      github: "https://github.com/xuanhai0913/My-Portfolio-NXH"
    },
    {
      title: "Koi Farm Management",
      description: "This project aims to build a Koi farm management website, providing customers with comprehensive information about Koi breeds, as well as Koi-related services such as buying, selling, consignment and care.",
      image: require("../../images/project/prj2.png"),
      github: "https://github.com/xuanhai0913/Koi-Farm-Shop_Group-H"
    },
    {
      title: "🚀 Flutter Team Members App",
      description: "This is a simple Flutter application that displays a team member list using PageView. The app allows navigation between members and includes an option to return to the home screen.",
      image: require("../../images/project/prj3.png"),
      github: "https://github.com/xuanhai0913/Flutter-my-app"
    }
  ];

  const projectRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px"
      }
    );

    projectRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="portfolio" className="portfolio-section">
      <Squares 
        speed={0.4} 
        squareSize={35}
        direction='diagonal'
        borderColor='rgba(255, 255, 255, 0.08)'
        hoverFillColor='rgba(74, 144, 226, 0.2)'
      />
      <div className="portfolio-content">
        <div className="portfolio-title">
          <TextPressure
            text="Portfolio"
            flex={true}
            alpha={false}
            stroke={true}
            width={true}
            weight={true}
            italic={true}
            textColor="#4a90e2"
            strokeColor="rgba(255, 255, 255, 0.1)"
            minFontSize={48}
          />
        </div>
        <div className="portfolio-grid">
          {projects.map((project, index) => (
            <div 
              key={index} 
              className="project-card hidden"
              ref={el => projectRefs.current[index] = el}
            >
              <div className="project-image">
                <img src={project.image} alt={project.title} />
              </div>
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-github"></i> View Project
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;