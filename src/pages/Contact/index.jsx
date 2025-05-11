import React, { useState, useEffect } from 'react';
import { Squares, FuzzyText } from '../../components/common';
import { useResponsive } from '../../hooks';
import './styles/Contact.css';

const Contact = () => {
  const [fontSize, setFontSize] = useState("clamp(2rem, 4vw, 3.5rem)");
  const [intensity, setIntensity] = useState(0.15);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setFontSize("clamp(1.8rem, 3vw, 2.5rem)");
        setIntensity(0.1);
      } else {
        setFontSize("clamp(2rem, 4vw, 3.5rem)");
        setIntensity(0.15);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section id="contact" className="contact-section">
      <Squares 
        speed={0.4} 
        squareSize={window.innerWidth < 768 ? 25 : 35}
        direction='diagonal'
        borderColor='rgba(255, 255, 255, 0.08)'
        hoverFillColor='rgba(74, 144, 226, 0.2)'
      />
      <div className="contact-content">
        <div className="contact-title">
          <FuzzyText
            fontSize={fontSize}
            fontWeight={700}
            color="#4a90e2"
            baseIntensity={intensity}
            hoverIntensity={intensity * 2}
          >
            Contact
          </FuzzyText>
        </div>
        <div className="contact-container">
          <div className="contact-info">
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <p>xuanhai0913750452@gmail.com</p>
            </div>
            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <p>+84 929 501 116</p>
            </div>
            <div className="contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <p>Ho Chi Minh City, Vietnam</p>
            </div>
          </div>
          <div className="social-links">
            <a href="https://github.com/xuanhai0913" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://linkedin.com/in/xuanhai0913" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="https://facebook.com/nguyenhai0913" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;