import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './SectionTransition.css';

gsap.registerPlugin(ScrollTrigger);

const KineticType = ({ text }) => {
    const containerRef = useRef(null);
    const charsContainerRef = useRef(null);
    const lineHorizontalRef = useRef(null);
    const lineVerticalRef = useRef(null);
    const subtitleRef = useRef(null);
    const arrowRef = useRef(null);
    const linesRef = useRef([]);
    const circlesRef = useRef([]);

    React.useLayoutEffect(() => {
        const container = containerRef.current;
        const charsContainer = charsContainerRef.current;
        const chars = charsContainer?.querySelectorAll('.kinetic-char');
        const hLine = lineHorizontalRef.current;
        const vLine = lineVerticalRef.current;
        const subtitle = subtitleRef.current;
        const arrow = arrowRef.current;
        const lines = linesRef.current;
        const circles = circlesRef.current;

        if (!chars?.length) return;

        const prefersReducedMotion =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            gsap.set(chars, { y: 0, opacity: 1, rotateX: 0, scale: 1 });
            gsap.set([hLine, vLine], { scaleX: 1, scaleY: 1 });
            gsap.set([...lines, ...circles, subtitle, arrow], { opacity: 1 });
            gsap.set(circles, { scale: 1 });
            return undefined;
        }

        // Initial hidden state
        gsap.set(chars, { y: 120, opacity: 0, rotateX: -90, scale: 0.6 });
        gsap.set([hLine, vLine], { scaleX: 0, scaleY: 0 });
        gsap.set([...lines, ...circles, subtitle, arrow], { opacity: 0 });
        gsap.set(circles, { scale: 0.5 });

        // Scroll-driven animation (scrub, NO pin)
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: "top 85%",
                end: "top 10%",
                scrub: 0.8,
            }
        });

        // 1. Horizontal reveal line sweeps across
        tl.to(hLine, {
            scaleX: 1, duration: 0.3, ease: "power2.inOut"
        });

        // 2. Vertical lines grow from center
        tl.to(lines, {
            opacity: 1, height: "100%",
            duration: 0.4, stagger: 0.05, ease: "power2.out"
        }, "<0.1");

        // 3. Characters fly in one by one (the hero moment)
        tl.to(chars, {
            y: 0, opacity: 1, rotateX: 0, scale: 1,
            duration: 0.5, stagger: 0.04, ease: "back.out(1.4)"
        }, "<0.15");

        // 4. Vertical accent line
        tl.to(vLine, {
            scaleY: 1, duration: 0.3, ease: "power2.out"
        }, "<0.2");

        // 5. Circles expand with rotation
        tl.to(circles, {
            opacity: 0.6, scale: 1, rotation: 90,
            duration: 0.5, ease: "power2.out"
        }, "<0.1");

        // 6. Subtitle fades in
        tl.to(subtitle, {
            opacity: 1, duration: 0.3, ease: "power1.out"
        }, "-=0.2");

        // 7. Arrow bounces in
        tl.to(arrow, {
            opacity: 1, y: 0, duration: 0.2
        }, "-=0.1");

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

    // Split text into individual characters
    const characters = text.split('');

    return (
        <div className="kinetic-container simple-mode" ref={containerRef}>
            {/* Horizontal Reveal Line */}
            <div className="kinetic-hline" ref={lineHorizontalRef}></div>

            {/* Vertical Accent Line */}
            <div className="kinetic-vline" ref={lineVerticalRef}></div>

            {/* Background Lines */}
            <div className="geo-line line-left" ref={addToLines}></div>
            <div className="geo-line line-center" ref={addToLines}></div>
            <div className="geo-line line-right" ref={addToLines}></div>

            {/* Decorative Circles */}
            <div className="geo-circle circle-left" ref={addToCircles}></div>
            <div className="geo-circle circle-right" ref={addToCircles}></div>

            {/* Main Text — split into characters */}
            <div className="kinetic-chars-wrapper" ref={charsContainerRef}>
                {characters.map((char, i) => (
                    <span key={i} className="kinetic-char" style={{ '--char-index': i }}>
                        {char}
                    </span>
                ))}
            </div>

            {/* Subtitle */}
            <div className="kinetic-subtitle" ref={subtitleRef}>
                <span className="subtitle-dash">—</span>
                <span>SCROLL TO EXPLORE</span>
                <span className="subtitle-dash">—</span>
            </div>

            {/* Down Arrow */}
            <div className="scroll-arrow" ref={arrowRef}>↓</div>
        </div>
    );
};

export default KineticType;
