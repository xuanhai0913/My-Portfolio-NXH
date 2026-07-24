import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../Profile/homeTranslations';
import './styles/About.css';

const About = () => {
  const { t } = useTranslation('home');
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
      { name: 'Python / Odoo 18', level: 75 },
      { name: 'SQL / MongoDB', level: 75 },
      { name: 'AI Agent Workflow', level: 82 }
    ]
  };

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      <div className={`about-grid ${inView ? 'in-view' : ''}`}>

        {/* Left: Bio & Header */}
        <div className="about-left">
          <h2 className="about-header">{t('about.title')}</h2>
          <div className="bio-container">
            {/* AI-extractable definition block (40-60 words, self-contained) */}
            <p className="bio-text">
              {t('about.bioBeforeRole')} <span className="highlight">{t('about.role')}</span>{' '}
              {t('about.bioAfterRole')}
            </p>
            {/* AI-extractable stats block (+37% citation boost per GEO study) */}
            <p className="bio-sub">
              {t('about.stats')}
            </p>

            <div className="code-quote">
              <span className="comment">{t('about.currentlyComment')}</span>
              <br />
              <span className="keyword">{t('about.currentlyAction')}</span>{' '}
              <span className="string">{t('about.currentlyProject')}</span>;
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
              <div className="title">{t('about.terminalTitle')}</div>
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
                      role="progressbar"
                      aria-label={t('about.skillLevelAria', { skill: skill.name, level: skill.level })}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-valuenow={skill.level}
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
