import React, { useRef, useEffect, useState } from 'react';
import profileImage from '../../images/profile.png';
import './styles/Profile.css';

// Use direct imports instead of lazy loading for core components
import Aurora from '../Aurora';
import RotatingText from '../RotatingText';
import VariableProximity from '../VariableProximity';

const Profile = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [componentErrors, setComponentErrors] = useState({
    aurora: false,
    rotatingText: false,
    proximity: false
  });
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component is mounted before rendering complex components
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const container = containerRef.current;
    const textElement = textRef.current;
    
    if (!container || !textElement) return;
    
    const updateProximityEffect = (e) => {
      if (!textElement) return;
      try {
        const rect = textElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        textElement.style.setProperty('--mouse-x', `${x}px`);
        textElement.style.setProperty('--mouse-y', `${y}px`);
      } catch (error) {
        console.error('Proximity effect error:', error);
        // Fail silently but log the error
      }
    };

    container.addEventListener('mousemove', updateProximityEffect);
    
    return () => {
      container.removeEventListener('mousemove', updateProximityEffect);
    };
  }, [isMounted]);

  // Error-handling render functions
  const renderAurora = () => {
    if (!isMounted) return <div className="aurora-fallback"></div>;
    
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
      console.error('Aurora render error:', error);
      setComponentErrors(prev => ({ ...prev, aurora: true }));
      // eslint-disable-next-line no-unreachable
      return <div className="aurora-fallback"></div>;
    }
  };

  const renderRotatingText = () => {
    if (!isMounted) return <span className="rotating-title">Full-Stack Developer</span>;
    
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
      console.error('RotatingText render error:', error);
      setComponentErrors(prev => ({ ...prev, rotatingText: true }));
      // eslint-disable-next-line no-unreachable
      return <span className="rotating-title">Full-Stack Developer</span>;
    }
  };

  const renderVariableProximity = () => {
    if (!isMounted) return <p className="variable-proximity-fallback">Building digital experiences with modern web technologies</p>;
    
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
      console.error('VariableProximity render error:', error);
      setComponentErrors(prev => ({ ...prev, proximity: true }));
      return <p className="variable-proximity-fallback">Building digital experiences with modern web technologies</p>;
    }
  };

  return (
    <section id="profile" className="profile-section">
      {!componentErrors.aurora && renderAurora()}
      
      <div className="profile-content">
        <div className="profile-card" ref={containerRef}>
          <div className="profile-image"> 
            <img 
              src={profileImage} 
              alt="Nguyễn Xuân Hải - Frontend Developer" 
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
                {!componentErrors.rotatingText ? renderRotatingText() : (
                  <span className="rotating-title">Full-Stack Developer</span>
                )}
              </div>
            </div>
            
            <div className="description-container" ref={textRef}>
              {!componentErrors.proximity ? renderVariableProximity() : (
                <p className="variable-proximity-fallback">Building digital experiences with modern web technologies</p>
              )}
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