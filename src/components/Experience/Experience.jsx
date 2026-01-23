import React, { useRef, useEffect, useState } from 'react';
import './styles/Experience.css';
import { WORK_EXPERIENCE } from '../../utils/constants';

const Experience = () => {
    const sectionRef = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setInView(true);
            },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section id="experience" className="experience-section" ref={sectionRef}>
            <div className={`experience-container ${inView ? 'in-view' : ''}`}>
                <h2 className="section-title">
                    <span className="hollow-text">WORK</span>_HISTORY
                </h2>

                <div className="experience-timeline">
                    {WORK_EXPERIENCE.map((job, index) => (
                        <div key={index} className="experience-item" style={{ '--delay': `${index * 0.2}s` }}>
                            <div className="experience-marker"></div>
                            <div className="experience-content">
                                <div className="experience-header">
                                    <div className="company-info">
                                        {job.logo && (
                                            <a href={job.link} target="_blank" rel="noopener noreferrer" className="company-logo-link">
                                                <img src={job.logo} alt={`${job.company} logo`} className="company-logo" />
                                            </a>
                                        )}
                                        <a href={job.link} target="_blank" rel="noopener noreferrer" className="company-name-link">
                                            <h3 className="company-name">{job.company}</h3>
                                        </a>
                                    </div>
                                    <span className="job-period">{job.period}</span>
                                </div>
                                <h4 className="job-role">{job.role}</h4>
                                <p className="job-description">{job.description}</p>

                                <div className="tech-stack-mini">
                                    {job.technologies.slice(0, 5).map((tech, i) => (
                                        <span key={i} className="tech-badge">{tech}</span>
                                    ))}
                                    {job.technologies.length > 5 && (
                                        <span className="tech-badge more">+{job.technologies.length - 5}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
