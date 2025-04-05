import React, { useRef, useEffect } from 'react';
import Aurora from '../Aurora';
import RotatingText from '../RotatingText';
import VariableProximity from '../VariableProximity';
import profileImage from '../../images/profile.png';
import './styles/Profile.css';

const Profile = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && textRef.current) {
      const updateProximityEffect = (e) => {
        if (!textRef.current) return;
        const rect = textRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        textRef.current.style.setProperty('--mouse-x', `${x}px`);
        textRef.current.style.setProperty('--mouse-y', `${y}px`);
      };

      containerRef.current.addEventListener('mousemove', updateProximityEffect);
      return () => {
        if (containerRef.current) {
          containerRef.current.removeEventListener('mousemove', updateProximityEffect);
        }
      };
    }
  }, []);

  return (
    <section id="profile" className="profile-section">
      <Aurora
        colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
        blend={0.2}
        amplitude={0.8}
        speed={1.5}
      />
      <div className="profile-content">
        <div className="profile-card" ref={containerRef}>
          <div className="profile-image"> 
            <img src={profileImage} alt="Profile" />
          </div>
          <div className="profile-info">
            <h2>Nguyễn Xuân Hải</h2>
            <div className="title-container">
              <span className="role-prefix">I'm a</span>
              <div className="rotating-text-wrapper">
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
              </div>
            </div>
            
            <div className="description-container" ref={textRef}>
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