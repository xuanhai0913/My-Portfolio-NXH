import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './PortfolioTitle.css';

gsap.registerPlugin(ScrollTrigger);

const PortfolioTitle = ({ text = "Portfolio" }) => {
  const titleRef = useRef(null);
  const lettersRef = useRef([]);

  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    // Split text into individual letters
    const textContent = text;
    title.innerHTML = '';
    
    textContent.split('').forEach((letter, index) => {
      const span = document.createElement('span');
      span.textContent = letter;
      span.className = 'letter';
      span.style.display = 'inline-block';
      span.style.transformOrigin = 'center bottom';
      title.appendChild(span);
      lettersRef.current[index] = span;
    });

    const letters = lettersRef.current;

    // Set initial state
    gsap.set(letters, {
      y: 100,
      opacity: 0,
      scale: 0.3,
      rotation: 20,
    });

    // Create main animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: title,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      }
    });

    // Animate letters in sequence
    tl.to(letters, {
      y: 0,
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 0.8,
      stagger: {
        amount: 0.8,
        from: 'start',
        ease: 'back.out(1.7)'
      },
      ease: 'back.out(1.7)'
    });

    // Add continuous floating animation
    letters.forEach((letter, index) => {
      gsap.to(letter, {
        y: -10,
        duration: 2 + (index * 0.1),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.1
      });
    });

    // Add hover effects
    letters.forEach((letter) => {
      letter.addEventListener('mouseenter', () => {
        gsap.to(letter, {
          scale: 1.3,
          color: '#ffffff',
          textShadow: '0 0 20px rgba(74, 144, 226, 0.8)',
          duration: 0.3,
          ease: 'back.out(1.7)'
        });
      });

      letter.addEventListener('mouseleave', () => {
        gsap.to(letter, {
          scale: 1,
          color: '#4a90e2',
          textShadow: '0 0 10px rgba(74, 144, 226, 0.3)',
          duration: 0.3,
          ease: 'back.out(1.7)'
        });
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      letters.forEach((letter) => {
        gsap.killTweensOf(letter);
      });
    };
  }, [text]);

  return (
    <div className="portfolio-title-container">
      <h1 ref={titleRef} className="portfolio-title-animated">
        {text}
      </h1>
    </div>
  );
};

export default PortfolioTitle;
