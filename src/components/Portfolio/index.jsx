import React, { useEffect, useRef } from 'react';
import Squares from '../Squares';
import TextPressure from '../TextPressure';
import './styles/Portfolio.css';

const Portfolio = () => {
  const projects = [
    {
      title: "Portfolio Website",
      description: "Modern React portfolio with interactive animations and responsive design. Using React, GSAP, and CSS3.",
      image: require("../../images/project/prj1.png"),
      github: "https://github.com/xuanhai0913/My-Portfolio-NXH",
      demo: "https://my-portfolio-nxh.vercel.app"
    },
    {
      title: "Website education English Comunity ",
      description: "This is a website that teaches English for free to people in difficult circumstances. Using wordpress to develop",
      image: require("../../images/project/prj6.png"),
      github: "https://github.com/xuanhai0913/",
      demo: "ech.edu.vn"
    },
    {
      title: "Koi Farm Management",
      description: "This project aims to build a Koi farm management website, providing customers with comprehensive information about Koi breeds, as well as Koi-related services such as buying, selling, consignment and care.",
      image: require("../../images/project/prj2.png"),
      github: "https://github.com/xuanhai0913/Koi-Farm-Shop_Group-H",
      demo: "cakoi01.vercel.app/search"
    },
    {
      title: "🚀 Flutter Team Members App",
      description: "This is a simple Flutter application that displays a team member list using PageView. The app allows navigation between members and includes an option to return to the home screen.",
      image: require("../../images/project/prj3.png"),
      github: "https://github.com/xuanhai0913/Flutter-my-app",
      demo: "https://flutter-my-app-three.vercel.app"
    },
    {
      title: "Management students",
      description: "Student management application by class, supports displaying student list, allows filtering and searching for names, and provides contact information of home school.",
      image: require("../../images/project/prj4.png"),
      github: "https://github.com/xuanhai0913/Manage-student-grades",
      demo: "https://grades-lovat.vercel.app/"
    },
    {
      title: "Website Happy New Year",
      description: "A simple website to wish Happy New Year, using HTML, CSS, and JavaScript.",
      image: require("../../images/project/prj5.png"),
      github: "https://github.com/xuanhai0913/HappyNewYear",
      demo: "https://happy-new-year-five-olive.vercel.app/"
    },

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
            minFontSize={window.innerWidth < 768 ? 32 : 48}
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
                <div className="project-text">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
                <div className="project-links">
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="github-link">
                    <i className="fab fa-github"></i> Source Code
                  </a>
                  <a href={project.demo} target="_blank" rel="noopener noreferrer" className="demo-link">
                    <i className="fas fa-external-link-alt"></i> Live Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;