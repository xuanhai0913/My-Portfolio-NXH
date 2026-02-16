import React, { useRef, useCallback, useState } from 'react';
import './styles/Experience.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WORK_EXPERIENCE } from '../../utils/constants';

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
    const sectionRef = useRef(null);
    const videoRef = useRef(null);
    const audioRef = useRef(null);
    const [inView, setInView] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [audioReady, setAudioReady] = useState(false);
    const fadeIntervalRef = useRef(null);

    // Fade audio volume smoothly
    const fadeAudio = useCallback((audio, targetVol, duration = 800) => {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        const steps = 20;
        const stepTime = duration / steps;
        const volumeDiff = (targetVol - audio.volume) / steps;
        let step = 0;

        fadeIntervalRef.current = setInterval(() => {
            step++;
            audio.volume = Math.max(0, Math.min(1, audio.volume + volumeDiff));
            if (step >= steps) {
                clearInterval(fadeIntervalRef.current);
                audio.volume = targetVol;
                if (targetVol === 0) audio.pause();
            }
        }, stepTime);
    }, []);

    React.useLayoutEffect(() => {
        // Intersection Observer for Text Animation + Audio
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    // Play audio when entering section
                    const audio = audioRef.current;
                    if (audio && !isMuted) {
                        audio.volume = 0;
                        audio.play().then(() => {
                            setAudioReady(true);
                            fadeAudio(audio, 0.4, 1200);
                        }).catch(() => {
                            // Autoplay blocked by browser – ignore
                        });
                    }
                } else {
                    // Fade out when leaving section
                    const audio = audioRef.current;
                    if (audio && !audio.paused) {
                        fadeAudio(audio, 0, 600);
                    }
                }
            },
            { threshold: 0.15 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);

        let tl;

        // GSAP ScrollTrigger for Video Background
        const video = videoRef.current;
        if (video) {
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
                        ScrollTrigger.refresh();
                    };
                })
                .catch(() => {
                    video.src = "/Nhan_Gai_Optimized.mp4";
                });
        }

        return () => {
            observer.disconnect();
            if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
            if (tl) {
                if (tl.scrollTrigger) tl.scrollTrigger.kill();
                tl.kill();
            }
            // Stop audio on unmount
            const audio = audioRef.current;
            if (audio) { audio.pause(); audio.currentTime = 0; }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleMute = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isMuted) {
            // Unmute – resume playing if section is in view
            setIsMuted(false);
            audio.volume = 0;
            audio.play().then(() => {
                fadeAudio(audio, 0.4, 600);
            }).catch(() => { });
        } else {
            // Mute – fade out
            setIsMuted(true);
            fadeAudio(audio, 0, 400);
        }
    };

    return (
        <section id="experience" className="experience-section" ref={sectionRef}>
            {/* Background Audio */}
            <audio ref={audioRef} src="/audio/EXPERIENCE.mp3" loop preload="auto" />

            {/* Mute/Unmute Toggle */}
            {audioReady && (
                <button
                    className={`audio-toggle ${isMuted ? 'muted' : ''}`}
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute background music' : 'Mute background music'}
                    title={isMuted ? 'Bật nhạc nền' : 'Tắt nhạc nền'}
                >
                    <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>
                </button>
            )}

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

