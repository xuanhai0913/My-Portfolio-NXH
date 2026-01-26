import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './SectionTransition.css';

gsap.registerPlugin(ScrollTrigger);

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

export default KineticType;
