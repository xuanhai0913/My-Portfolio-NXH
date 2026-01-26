import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './SectionTransition.css';

gsap.registerPlugin(ScrollTrigger);

// Kinetic Typography Component (Manual Effect)
const KineticType = ({ text }) => {
    const containerRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        const textEl = textRef.current;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: "top top",
                end: "+=150%", // Pin for 1.5 screens
                pin: true,
                scrub: 1,
            }
        });

        // Effect: Text Scales Up hugely + Opacity shift
        tl.fromTo(textEl,
            { scale: 1, opacity: 0.2, filter: 'blur(10px)' },
            { scale: 15, opacity: 1, filter: 'blur(0px)', ease: "power2.inOut" }
        );

        // Background Grid Animation (Simulated forward movement)
        gsap.to(container, {
            backgroundPosition: "0% 100%",
            ease: "none",
            scrollTrigger: {
                trigger: container,
                start: "top top",
                end: "+=150%",
                scrub: true
            }
        });

        return () => {
            if (tl.scrollTrigger) tl.scrollTrigger.kill();
            tl.kill();
        };
    }, []);

    return (
        <div className="kinetic-container" ref={containerRef}>
            <div className="neon-grid-bg"></div>
            <h2 className="kinetic-text" ref={textRef} data-text={text}>{text}</h2>
        </div>
    );
};

const SectionTransition = ({ text, videoSrc }) => {
    const sectionRef = useRef(null);
    const videoRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // If NO videoSrc -> Render Manual Kinetic Effect
    if (!videoSrc) {
        return <KineticType text={text} />;
    }

    // ... Existing Video Logic ...
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // 1. Fetch Video as Blob for instant scrubbing (No network lag)
        let objectUrl = null;
        let tl = null; // Declared here to be accessible in cleanup

        const loadVideo = async () => {
            try {
                const response = await fetch(videoSrc);
                const blob = await response.blob();
                objectUrl = URL.createObjectURL(blob);

                video.src = objectUrl;
                // Once source is set via blob, we wait for 'loadedmetadata'
                // But since it's local blob, it should be instant.
            } catch (error) {
                console.error("Video load failed, falling back to stream", error);
                video.src = videoSrc; // Fallback
            }
        };

        loadVideo();

        // 2. Initialize GSAP only when we have metadata
        const initScrollTrigger = () => {
            if (!video.duration) return;
            setIsLoaded(true); // Fade in video

            tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=300%",
                    pin: true,
                    scrub: 1,
                }
            });

            let videoProgress = { frame: 0 };

            const updateVideo = () => {
                if (!video.duration) return;
                const targetTime = videoProgress.frame;
                if (Math.abs(video.currentTime - targetTime) > 0.01) {
                    video.currentTime = targetTime;
                }
            };

            tl.to(videoProgress, {
                frame: video.duration,
                ease: "none",
                onUpdate: updateVideo
            });

            ScrollTrigger.refresh();
        };

        const onLoaded = () => {
            initScrollTrigger();
        };

        video.addEventListener('loadedmetadata', onLoaded);

        return () => {
            video.removeEventListener('loadedmetadata', onLoaded);
            if (tl) {
                if (tl.scrollTrigger) tl.scrollTrigger.kill();
                tl.kill();
            }
            if (objectUrl) URL.revokeObjectURL(objectUrl);
            // Do NOT kill all scrolltriggers
        };
    }, [videoSrc]);

    return (
        <div className="transition-container" ref={sectionRef}>
            <div className={`video-loader ${isLoaded ? 'hidden' : ''}`}>Loading...</div>
            <video
                ref={videoRef}
                className={`transition-video ${isLoaded ? 'visible' : ''}`}
                // src is set via JS
                muted
                playsInline
                loop={false}
                preload="auto"
            />
            {/* Text Overlay for Video Mode (Optional, if we want text on top of video too) */}
            {/* But usually the video has text burned in. If Manual mode, KineticType handles text. */}
        </div>
    );
};

export default SectionTransition;
