import React, { useRef, useEffect, useState } from 'react';
import { Aurora, RotatingText, VariableProximity } from '../../components/common';
import { useResponsive } from '../../hooks';
import profileImage from '../../assets/images/profile.png';
import './styles/Profile.css';

const Profile = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [auroraError, setAuroraError] = useState(false);
  const [rotatingTextError, setRotatingTextError] = useState(false);
  const [proximityError, setProximityError] = useState(false);

  useEffect(() => {
    if (containerRef.current && textRef.current) {
      const container = containerRef.current; // Store ref in variable for cleanup

      const updateProximityEffect = (e) => {
        if (!textRef.current) return;
        const rect = textRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        textRef.current.style.setProperty('--mouse-x', `${x}px`);
        textRef.current.style.setProperty('--mouse-y', `${y}px`);
      };

      container.addEventListener('mousemove', updateProximityEffect);

      return () => {
        container.removeEventListener('mousemove', updateProximityEffect);
      };
    }
  }, []);

  // Render Aurora with error handling
  const renderAurora = () => {
    try {
      return (
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.2}
          amplitude={0.8}
          speed={1.5}
        />
      );
    } catch (error) {
      console.error('Aurora component failed to render:', error);
      setAuroraError(true);
      return <div className="aurora-fallback"></div>;
    }
  };

  // Render RotatingText with error handling
  const renderRotatingText = () => {
    try {
      return (
        <RotatingText
          texts={[
            'Full-Stack Developer',
            'React Developer',
            'Web Designer',
            'Problem Solver'
          ]}
          mainClassName="rotating-title"
          staggerFrom="center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 200,
            mass: 0.5
          }}
          staggerDuration={0.015}
          rotationInterval={3000}
          splitLevelClassName="title-split"
        />
      );
    } catch (error) {
      console.error('RotatingText component failed to render:', error);
      setRotatingTextError(true);
      return <span className="rotating-title-fallback">Full-Stack Developer</span>;
    }
  };

  // Render VariableProximity with error handling
  const renderVariableProximity = () => {
    try {
      return (
        <VariableProximity
          label="Building digital experiences with modern web technologies"
          className="variable-proximity-text"
          fromFontVariationSettings="'wght' 300, 'opsz' 8"
          toFontVariationSettings="'wght' 1000, 'opsz' 48"
          radius={150}
          falloff="exponential"
          containerRef={containerRef}
          sensitivity={1.5}
          transitionSpeed={0.15}
        />
      );
    } catch (error) {
      console.error('VariableProximity component failed to render:', error);
      setProximityError(true);
      return <p className="variable-proximity-fallback">Building digital experiences with modern web technologies</p>;
    }
  };

  return (
    <section id="profile" className="profile-section">
      {!auroraError && renderAurora()}
      <div className="profile-content">
        <div className="profile-card" ref={containerRef}>
          <div className="profile-image">
            <img
              src={profileImage}
              alt="Nguyễn Xuân Hải - Fullstack Developer"
              loading="eager"
              width="150"
              height="150"
            />
          </div>
          <div className="profile-info">
            <h1>Nguyễn Xuân Hải</h1>
            <div className="title-container">
              <span className="role-prefix">I'm a</span>
              <div className="rotating-text-wrapper">
                {!rotatingTextError && renderRotatingText()}
              </div>
            </div>

            <div className="description-container" ref={textRef}>
              {!proximityError && renderVariableProximity()}
            </div>
            <div className="social-links">
              <ul>
                <li>
                  <a href="https://www.facebook.com/nguyenhai0913" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-facebook"></i>
                  </a>
                </li>
                <li>
                  <a href="https://github.com/xuanhai0913" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-github"></i>
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com/@xuanhai0913" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-youtube"></i>
                  </a>
                </li>
                <li>
                  <a href="mailto:xuanhai0913750452@gmail.com">
                    <i className="fab fa-google"></i>
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/nguyenhai091375" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-instagram"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;