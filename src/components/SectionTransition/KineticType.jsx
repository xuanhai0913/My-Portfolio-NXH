import React, { useRef } from 'react';
import { gsap } from 'gsap';
import './SectionTransition.css';

const KineticType = ({ text }) => {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const arrowRef = useRef(null);
    const linesRef = useRef([]);
    const circlesRef = useRef([]);
    const hasAnimated = useRef(false);

    React.useLayoutEffect(() => {
        const container = containerRef.current;
        const textEl = textRef.current;
        const lines = linesRef.current;
        const circles = circlesRef.current;
        const arrow = arrowRef.current;

        // Hide everything initially
        gsap.set([textEl, ...lines, ...circles, arrow], { opacity: 0 });
        gsap.set(textEl, { scale: 0.8, y: 50 });
        gsap.set(lines, { height: "0%" });
        gsap.set(circles, { rotation: 0 });

        // IntersectionObserver — no GSAP pin, no pin-spacer
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;

                    const tl = gsap.timeline();

                    // 1. Lines grow + fade in
                    tl.to(lines, {
                        height: "100%", opacity: 1,
                        duration: 0.8, ease: "power2.out", stagger: 0.1
                    });

                    // 2. Text reveal
                    tl.to(textEl, {
                        scale: 1, opacity: 1, y: 0,
                        duration: 0.8, ease: "back.out(1.7)"
                    }, "<0.15");

                    // 3. Circles rotate + fade in
                    tl.to(circles, {
                        rotation: 90, opacity: 1,
                        duration: 0.8
                    }, "<");

                    // 4. Arrow fade in
                    tl.to(arrow, { opacity: 1, duration: 0.4 }, "-=0.2");
                }
            },
            { threshold: 0.5 }
        );

        if (container) observer.observe(container);

        return () => {
            observer.disconnect();
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
            <div className="scroll-arrow" ref={arrowRef}>↓</div>
        </div>
    );
};

export default KineticType;
