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
            {/* AI-extractable definition block (40-60 words, self-contained) */}
            <p className="bio-text">
              Nguyễn Xuân Hải is a <span className="highlight">Full-Stack Developer</span> based
              in Ho Chi Minh City, Vietnam, specializing in React, .NET Core,
              and AI integration. He builds production web applications —
              from B2B platforms handling real business operations
              to AI assistants powered by Google Gemini.
            </p>
            {/* AI-extractable stats block (+37% citation boost per GEO study) */}
            <p className="bio-sub">
              9+ projects shipped to production, including 3 commercial platforms
              serving real users in Vietnam. Tech stack spans React frontends,
              .NET Core backends, Node.js APIs, and AI integrations
              with Gemini 2.0 and Deepseek LLM.
            </p>

            <div className="code-quote">
              <span className="comment">{'/* Currently */'}</span>
              <br />
              <span className="keyword">building</span> <span className="string">"AI-powered tools with Gemini & Deepseek"</span>;
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