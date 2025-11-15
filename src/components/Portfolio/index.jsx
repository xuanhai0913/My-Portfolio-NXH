import React, { useEffect, useRef, useState } from 'react';
import Squares from '../Squares';
import PortfolioTitle from '../PortfolioTitle';
import './styles/Portfolio.css';

// Import project images
import prj1 from '../../images/project/prj1.png';
import prj2 from '../../images/project/prj2.png';
import prj3 from '../../images/project/prj3.png';
import prj5 from '../../images/project/prj5.png';
import prj6 from '../../images/project/prj6.png';
import prj7 from '../../images/project/prj7.png';
// Temporary placeholder for Great Link Mai House project
// Replace with actual screenshot: import prj8 from '../../images/project/prj8.png';
import prj8 from '../../images/project/prj8.png'; // Temporary using prj1 as placeholder
import prj9 from '../../images/project/prj9.png';

const Portfolio = () => {
  const projects = [
    {
      title: "Great Link Mai House - B2B Import-Export Platform",
      description: "Corporate website for Great Link Mai House, a leading Media & B2B Import-Export company. Features include business consultation, trade connections, import-export support, and event management services.",
      image: prj8,
      github: "#", // Private company project
      demo: "https://greatlinkmaihouse.com/",
      technologies: ["ASP.NET Core", "C#", "SQL Server", "Bootstrap", "JavaScript", "HTML5", "CSS3"],
      isCommercial: true,
      company: "CÔNG TY TNHH ĐẦU TƯ GREATLINK MAIHOUSE"
    },
    {
      title: "Website Education English Community",
      description: "Educational website that teaches English for free to people in difficult circumstances. Features comprehensive English learning resources, interactive lessons, and community support. Built with WordPress CMS for easy content management.",
      image: prj6,
      github: "#", // Private educational project
      demo: "https://ech.edu.vn",
      technologies: ["WordPress", "PHP", "MySQL", "CSS3", "JavaScript"],
      isCommercial: true,
      company: "English Community House (ECH)"
    },
    {
      title: "Portfolio Website",
      description: "Modern React portfolio with interactive animations and responsive design. Using React, GSAP, and CSS3.",
      image: prj1,
      github: "https://github.com/xuanhai0913/My-Portfolio-NXH",
      demo: "https://my-portfolio-nxh.vercel.app",
      technologies: ["React", "JavaScript", "CSS3", "GSAP", "HTML5"]
    },
    {
      title: "Koi Farm Management",
      description: "This project aims to build a Koi farm management website, providing customers with comprehensive information about Koi breeds, as well as Koi-related services such as buying, selling, consignment and care.",
      image: prj2,
      github: "https://github.com/xuanhai0913/Koi-Farm-Shop_Group-H",
      demo: "https://cakoi01.vercel.app",
      technologies: ["React", "Node.js", "MongoDB", "Express", "CSS3"]
    },
    {
      title: "🚀 Flutter Team Members App",
      description: "This is a simple Flutter application that displays a team member list using PageView. The app allows navigation between members and includes an option to return to the home screen.",
      image: prj3,
      github: "https://github.com/xuanhai0913/Flutter-my-app",
      demo: "https://flutter-my-app-three.vercel.app",
      technologies: ["Flutter", "Dart", "Android", "iOS"]
    },
    {
      title: "Website Happy New Year",
      description: "A simple website to wish Happy New Year, using HTML, CSS, and JavaScript.",
      image: prj5,
      github: "https://github.com/xuanhai0913/HappyNewYear",
      demo: "https://happy-new-year-five-olive.vercel.app/",
      technologies: ["HTML5", "CSS3", "JavaScript", "Animation"]
    },
    {
      title: "SPRM - Student Performance & Resource Management",
      description: "Full-stack education management system featuring student performance tracking, resource management, and administrative tools. Technologies: React.js, C# ASP.NET Core Web API, SQL Server, JWT Authentication, responsive design.",
      image: prj7,
      github: "https://github.com/xuanhai0913/CNPM-Fullstack-React-CSharp",
      demo: "https://cnpm-fullstack-react-csharp.onrender.com",
      technologies: ["React", "C#", "ASP.NET Core", "SQL Server", "JWT"]
    },
    {
      title: "OTP API - Phone Number Rental Service",
      description: "Web service for renting phone numbers to receive OTP codes. Provides temporary phone numbers for verification purposes with real-time OTP retrieval.",
      image: prj9,
      github: "https://github.com/xuanhai0913/OTP-API",
      demo: "https://haikey.shop/",
      technologies: ["API", "Node.js", "Express", "MongoDB", "SMS Gateway"]
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
        <PortfolioTitle text="Portfolio" />
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
                  {project.technologies && (
                    <div className="project-technologies">
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="project-links">
                  {project.isCommercial ? (
                    <>
                      <div className="commercial-badge">
                        <i className="fas fa-building"></i> Commercial Project
                      </div>
                      <a href={project.demo} target="_blank" rel="noopener noreferrer" className="demo-link">
                        <i className="fas fa-external-link-alt"></i> Visit Website
                      </a>
                    </>
                  ) : (
                    <>
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="github-link">
                        <i className="fab fa-github"></i> Source Code
                      </a>
                      <a href={project.demo} target="_blank" rel="noopener noreferrer" className="demo-link">
                        <i className="fas fa-external-link-alt"></i> Live Demo
                      </a>
                    </>
                  )}
                </div>
                {project.company && (
                  <div className="project-company">
                    <i className="fas fa-building"></i> {project.company}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;