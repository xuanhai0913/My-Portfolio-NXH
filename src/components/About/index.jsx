import React, { useRef, useEffect, useState } from 'react';
import './styles/About.css';

const About = () => {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const skills = {
    technical: [
      { name: 'React / Next.js', level: 90 },
      { name: 'Node.js / Express', level: 85 },
      { name: 'ASP.NET Core', level: 80 },
      { name: 'SQL / MongoDB', level: 75 },
      { name: 'DeepSeek / AI', level: 70 }
    ]
  };

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      <div className={`about-grid ${inView ? 'in-view' : ''}`}>

        {/* Left: Bio & Header */}
        <div className="about-left">
          <h2 className="about-header">ABOUT_ME</h2>
          <div className="bio-container">
            <p className="bio-text">
              Passionate Full-Stack Developer with a knack for building
              <span className="highlight"> robust digital ecosystems</span>.
            </p>
            <p className="bio-sub">
              I bridge the gap between complex backend logic and immersive frontend experiences.
              Currently exploring the intersection of Web Development and Generative AI.
            </p>

            <div className="code-quote">
              <span className="comment">{'/* Vision */'}</span>
              <br />
              <span className="keyword">return</span> <span className="string">"Seeking opportunities to create impactful web solutions."</span>;
            </div>
          </div>
        </div>

        {/* Right: Terminal Skills */}
        <div className="about-right">
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="btns">
                <span className="circle red"></span>
                <span className="circle yellow"></span>
                <span className="circle green"></span>
              </div>
              <div className="title">skills.exe</div>
            </div>
            <div className="terminal-body">
              {skills.technical.map((skill, index) => (
                <div key={index} className="skill-row">
                  <div className="skill-label">
                    <span className="prompt">{'>'}</span> {skill.name}
                  </div>
                  <div className="skill-bar-track">
                    <div
                      className="skill-bar-fill"
                      style={{
                        width: inView ? `${skill.level}%` : '0%',
                        transitionDelay: `${index * 0.1 + 0.5}s`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
              <div className="cursor-line">
                <span className="prompt">{'>'}</span> <span className="cursor">_</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;