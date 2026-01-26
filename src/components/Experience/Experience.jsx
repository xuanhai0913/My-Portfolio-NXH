import React, { useRef, useEffect, useState } from 'react';
import './styles/Experience.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WORK_EXPERIENCE } from '../../utils/constants';

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
    const sectionRef = useRef(null);
    const videoRef = useRef(null);
    const [inView, setInView] = useState(false);

    React.useLayoutEffect(() => {
        // Intersection Observer for Text Animation
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setInView(true);
            },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);

        let tl;

        // GSAP ScrollTrigger for Video Background
        const video = videoRef.current;
        if (video) {
            // Fetch blob for smooth scrubbing
            fetch("/Nhan_Gai_Optimized.mp4")
                .then(res => res.blob())
                .then(blob => {
                    const objectUrl = URL.createObjectURL(blob);
                    video.src = objectUrl;
                    video.onloadedmetadata = () => {
                        tl = gsap.timeline({
                            scrollTrigger: {
                                trigger: sectionRef.current,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: true,
                            }
                        });
                        tl.fromTo(video,
                            { currentTime: 0 },
                            { currentTime: video.duration, ease: "none" }
                        );
                        // Force recalculation of start/end positions after video load
                        ScrollTrigger.refresh();
                    };
                })
                .catch(() => {
                    video.src = "/Nhan_Gai_Optimized.mp4";
                });
        }


        return () => {
            observer.disconnect();
            // Only kill the local timeline/trigger
            if (tl) {
                if (tl.scrollTrigger) tl.scrollTrigger.kill();
                tl.kill();
            }
        };
    }, []);

    return (
        <section id="experience" className="experience-section" ref={sectionRef}>
            {/* Scrollytelling Background Video */}
            <div className="experience-bg-video-container">
                <video
                    ref={videoRef}
                    className="experience-bg-video"
                    src="/Nhan_Gai_Optimized.mp4"
                    muted
                    playsInline
                    loop={false}
                />
                <div className="experience-bg-overlay"></div>
            </div>

            <div className={`experience-container ${inView ? 'in-view' : ''}`}>
                <h2 className="section-title">
                    <span className="hollow-text">WORK</span>_HISTORY
                </h2>
                {/* ... rest of the content ... */}

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
