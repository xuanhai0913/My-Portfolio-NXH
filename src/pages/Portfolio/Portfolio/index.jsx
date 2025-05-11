import React, { useEffect, useRef, useState } from 'react';
import { Squares, TextPressure } from '../../../components/common';
import { isInViewport, throttle } from '../../../utils';
import './styles/Portfolio.css';

const Portfolio = () => {
  const projects = [
    {
      title: "Portfolio Website",
      description: "Modern React portfolio with interactive animations and responsive design. Using React, GSAP, and CSS3.",
      image: require("../../../assets/images/project/prj1.png"),
      github: "https://github.com/xuanhai0913/My-Portfolio-NXH",
      demo: "https://my-portfolio-nxh.vercel.app"
    },
    {
      title: "Website education English Comunity",
      description: "This is a website that teaches English for free to people in difficult circumstances. Using wordpress to develop",
      image: require("../../../assets/images/project/prj6.png"),
      github: "https://github.com/xuanhai0913/",
      demo: "https://ech.edu.vn"
    },
    {
      title: "Koi Farm Management",
      description: "This project aims to build a Koi farm management website, providing customers with comprehensive information about Koi breeds, as well as Koi-related services such as buying, selling, consignment and care.",
      image: require("../../../assets/images/project/prj2.png"),
      github: "https://github.com/xuanhai0913/Koi-Farm-Shop_Group-H",
      demo: "https://cakoi01.vercel.app"
    },
    {
      title: "🚀 Flutter Team Members App",
      description: "This is a simple Flutter application that displays a team member list using PageView. The app allows navigation between members and includes an option to return to the home screen.",
      image: require("../../../assets/images/project/prj3.png"),
      github: "https://github.com/xuanhai0913/Flutter-my-app",
      demo: "https://flutter-my-app-three.vercel.app"
    },
    {
      title: "Management students",
      description: "Student management application by class, supports displaying student list, allows filtering and searching for names, and provides contact information of home school.",
      image: require("../../../assets/images/project/prj4.png"),
      github: "https://github.com/xuanhai0913/Manage-student-grades",
      demo: "https://grades-lovat.vercel.app/"
    },
    {
      title: "Website Happy New Year",
      description: "A simple website to wish Happy New Year, using HTML, CSS, and JavaScript.",
      image: require("../../../assets/images/project/prj5.png"),
      github: "https://github.com/xuanhai0913/HappyNewYear",
      demo: "https://happy-new-year-five-olive.vercel.app/"
    },

  ];

  const projectRefs = useRef([]);
  const [fontSize, setFontSize] = useState(() => {
    return window.innerWidth < 768 ? 28 : 48;
  });

  useEffect(() => {
    const handleResize = () => {
      setFontSize(window.innerWidth < 768 ? 28 : 48);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        squareSize={window.innerWidth < 768 ? 25 : 35}
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
            minFontSize={fontSize}
          />
        </div>
        <div className="portfolio-grid">
          {projects.map((project, index) => (
            <div 
              key={index} 
              className="project-card hidden"
              ref={el => projectRefs.current[index] = el}
              style={{
                '--delay': `${index * 0.1}s`
              }}
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