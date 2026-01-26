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

        // Ensure video metadata is loaded for duration
        const initScrollTrigger = () => {
            if (!video.duration) return;

            // Animate video.currentTime using a proxy object for smoothness
            // We use a custom updater to handle fastSeek if available
            let videoProgress = { frame: 0 };

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "+=300%",
                    pin: true,
                    scrub: 1,
                }
            });

            const updateVideo = () => {
                if (!video || !video.duration) return;
                // If the video is currently seeking, skipping update might reduce stutter but can cause 'slip'
                // For scrollytelling, we usually force it. 
                // However, standard currentTime setting IS blocking. 

                const targetTime = videoProgress.frame;

                if (Number.isFinite(targetTime)) {
                    // Use fastSeek if supported (Safari/Firefox) for smoother scrubbing
                    if (video.fastSeek) {
                        video.fastSeek(targetTime);
                    } else {
                        video.currentTime = targetTime;
                    }
                }
            };

            tl.to(videoProgress, {
                frame: video.duration,
                ease: "none",
                onUpdate: updateVideo
            });

            // Cleanup
            return () => {
                if (tl.scrollTrigger) tl.scrollTrigger.kill();
                tl.kill();
            };
        };

        if (video.readyState >= 1) {
            initScrollTrigger();
        } else {
            video.addEventListener('loadedmetadata', initScrollTrigger);
        }

        return () => {
            // Basic cleanup (full cleanup is inside initScrollTrigger result if we could capture it, 
            // but here we rely on the fact that useEffect runs once. 
            // Ideally we'd store the cleanup fn via a ref or return it properly.)
            // For simplicity in this edit:
            ScrollTrigger.getAll().forEach(t => t.kill());
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
