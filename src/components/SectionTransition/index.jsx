import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './SectionTransition.css';

gsap.registerPlugin(ScrollTrigger);

const SectionTransition = () => {
    const sectionRef = useRef(null);
    const videoRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        const video = videoRef.current;

        if (!section || !video) return;

        // Ensure video is paused and invisible initially
        video.pause();
        gsap.set(video, { opacity: 0 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "+=200%", // Pin for 2 screens length
                pin: true,
                scrub: true,
                onEnter: () => {
                    // Play video when entering pins
                    video.play().catch(e => console.log("Video play failed", e));
                    gsap.to(video, { opacity: 1, duration: 0.5 });
                },
                onLeave: () => {
                    // Fade out when leaving
                    gsap.to(video, { opacity: 0, duration: 0.5 });
                },
                onEnterBack: () => {
                    // Resume if scrolling back up
                    gsap.to(video, { opacity: 1, duration: 0.5 });
                },
                onLeaveBack: () => {
                    // Reset if scrolling all the way back up
                    gsap.to(video, { opacity: 0, duration: 0.5 });
                    video.pause();
                    video.currentTime = 0;
                }
            }
        });

        return () => {
            if (tl.scrollTrigger) tl.scrollTrigger.kill();
            tl.kill();
        };
    }, []);

    return (
        <div className="transition-container" ref={sectionRef}>
            <video
                ref={videoRef}
                className="transition-video"
                src="/Neon_Projects.webm"
                muted
                playsInline
                loop={false}
            />
        </div>
    );
};

export default SectionTransition;
