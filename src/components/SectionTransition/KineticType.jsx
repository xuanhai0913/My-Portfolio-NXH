import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './SectionTransition.css';

gsap.registerPlugin(ScrollTrigger);

const KineticType = ({ text }) => {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const linesRef = useRef([]);
    const circlesRef = useRef([]);

    // useLayoutEffect prevents layout thrashing with ScrollTrigger
    React.useLayoutEffect(() => {
        const container = containerRef.current;
        const textEl = textRef.current;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: "top top",
                end: "+=100%", // Pin shorter
                pin: true,
                scrub: 1,
            }
        });

        // Simple Reveal Animation
        // 1. Lines grow from top
        tl.fromTo(linesRef.current,
            { height: "0%" },
            { height: "100%", duration: 1, ease: "power2.out", stagger: 0.2 }
        );

        // 2. Text scales slightly and brightens
        tl.fromTo(textEl,
            { scale: 0.8, opacity: 0, y: 50 },
            { scale: 1, opacity: 1, y: 0, duration: 1, ease: "back.out(1.7)" },
            "<0.2" // Overlap start
        );

        // 3. Circles rotate
        tl.to(circlesRef.current, { rotation: 90, duration: 1 }, "<");

        return () => {
            if (tl.scrollTrigger) tl.scrollTrigger.kill();
            tl.kill();
        };
    }, []);

    const addToLines = (el) => {
        if (el && !linesRef.current.includes(el)) linesRef.current.push(el);
    };

    const addToCircles = (el) => {
        if (el && !circlesRef.current.includes(el)) circlesRef.current.push(el);
    };

    return (
        <div className="kinetic-container simple-mode" ref={containerRef}>
            {/* Background Lines */}
            <div className="geo-line line-left" ref={addToLines}></div>
            <div className="geo-line line-center" ref={addToLines}></div>
            <div className="geo-line line-right" ref={addToLines}></div>

            {/* Decorative Circles */}
            <div className="geo-circle circle-left" ref={addToCircles}></div>
            <div className="geo-circle circle-right" ref={addToCircles}></div>

            {/* Main Text */}
            <h2 className="kinetic-text-simple" ref={textRef}>{text}</h2>

            {/* Down Arrow */}
            <div className="scroll-arrow">↓</div>
        </div>
    );
};

export default KineticType;
