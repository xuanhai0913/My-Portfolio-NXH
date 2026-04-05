import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useParallax — Hook that adds scroll-driven parallax depth to sections.
 * Inspired by Active Theory's multi-layer Z-depth scroll effect.
 *
 * @param {string} selector — CSS selector for sections to parallax
 * @param {object} options — { bgSpeed, fgSpeed }
 */
const useParallax = (selector = '.profile-section, .experience-section, .portfolio-section', options = {}) => {
  const { bgSpeed = -30, fgSpeed = -10 } = options;

  useEffect(() => {
    // Skip if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const sections = document.querySelectorAll(selector);
    const triggers = [];

    sections.forEach((section) => {
      // Background elements move slower (further away feel)
      const bgElements = section.querySelectorAll(
        '.bg-noise, .hero-particles-canvas, .geo-line, .geo-circle'
      );

      // Foreground decorations move faster
      const fgElements = section.querySelectorAll(
        '.floating-badge, .grid-deco, .glitch-frame'
      );

      bgElements.forEach((el) => {
        const st = gsap.to(el, {
          yPercent: bgSpeed,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
        triggers.push(st.scrollTrigger);
      });

      fgElements.forEach((el) => {
        const st = gsap.to(el, {
          yPercent: fgSpeed,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
        triggers.push(st.scrollTrigger);
      });
    });

    return () => {
      triggers.forEach((st) => st?.kill());
    };
  }, [selector, bgSpeed, fgSpeed]);
};

export default useParallax;
