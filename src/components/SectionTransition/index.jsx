import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './SectionTransition.css';
import KineticType from './KineticType';

gsap.registerPlugin(ScrollTrigger);

const VideoMode = ({ videoSrc }) => {
    const sectionRef = useRef(null);
    const videoRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const VideoMode = ({ videoSrc }) => {
        const sectionRef = useRef(null);
        const videoRef = useRef(null);
        const [isLoaded, setIsLoaded] = useState(false);

        React.useLayoutEffect(() => {
            const video = videoRef.current;
            if (!video) return;

            let objectUrl = null;
            let tl = null;

            const loadVideo = async () => {
                try {
                    const response = await fetch(videoSrc);
                    const blob = await response.blob();
                    objectUrl = URL.createObjectURL(blob);
                    video.src = objectUrl;
                } catch (error) {
                    console.error("Video load failed, falling back to stream", error);
                    video.src = videoSrc;
                }
            };

            loadVideo();

            // Initialize GSAP
            const initScrollTrigger = () => {
                if (!video.duration) return;
                setIsLoaded(true);

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
            };
        }, [videoSrc]);

        return (
            <div className="transition-container" ref={sectionRef}>
                <div className={`video-loader ${isLoaded ? 'hidden' : ''}`}>Loading...</div>
                <video
                    ref={videoRef}
                    className={`transition-video ${isLoaded ? 'visible' : ''}`}
                    muted
                    playsInline
                    loop={false}
                    preload="auto"
                />
            </div>
        );
    };

    const SectionTransition = ({ text, videoSrc }) => {
        // Branching at Route level component, avoiding conditional hooks
        if (!videoSrc) {
            return <KineticType text={text} />;
        }
        return <VideoMode videoSrc={videoSrc} />;
    };

    export default SectionTransition;
