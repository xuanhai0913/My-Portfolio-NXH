import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './SectionTransition.css';

gsap.registerPlugin(ScrollTrigger);

const SectionTransition = ({ videoSrc = "/Neon_Projects_Optimized.mp4" }) => {
    const sectionRef = useRef(null);
    const videoRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // 1. Fetch Video as Blob for instant scrubbing (No network lag)
        let objectUrl = null;

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

            const tl = gsap.timeline({
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

            return () => {
                if (tl.scrollTrigger) tl.scrollTrigger.kill();
                tl.kill();
            };
        };

        let cleanupGsap = null;

        const onLoaded = () => {
            cleanupGsap = initScrollTrigger();
        };

        video.addEventListener('loadedmetadata', onLoaded);

        return () => {
            video.removeEventListener('loadedmetadata', onLoaded);
            if (cleanupGsap) cleanupGsap();
            if (objectUrl) URL.revokeObjectURL(objectUrl);
            ScrollTrigger.getAll().forEach(t => t.kill());
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
        </div>
    );
};

export default SectionTransition;
