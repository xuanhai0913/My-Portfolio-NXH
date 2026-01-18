import React, { useRef, useState } from 'react';
import Aurora from '../Aurora';
import TrueFocus from '../TrueFocus';
import ScrambledText from '../ScrambleText';
import profileImage from '../../images/profile.png';
import './styles/Profile.css';

const Profile = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [auroraError, setAuroraError] = useState(false);
  const [trueFocusError, setTrueFocusError] = useState(false);
  const [scrambleError, setScrambleError] = useState(false);

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
      // eslint-disable-next-line no-unreachable
    } catch (error) {
      console.error('Aurora component failed to render:', error);
      setAuroraError(true);
      return <div className="aurora-fallback"></div>;
    }
  };

  // Render TrueFocus with error handling
  const renderTrueFocus = () => {
    try {
      return (
        <TrueFocus
          text="Full-Stack Developer"
          sentence="Full-Stack Developer"

          manualMode={false}
          blurAmount={3}
          borderColor="red"
          animationDuration={1}
          pauseBetweenAnimations={1}
        />
      );
      // eslint-disable-next-line no-unreachable
    } catch (error) {
      console.error('TrueFocus component failed to render:', error);
      setTrueFocusError(true);
      return <span className="rotating-title-fallback">Full-Stack Developer</span>;
    }
  };


  // Render ScrambleText with error handling
  const renderScrambleText = () => {
    try {
      return (
        <ScrambledText
          className="scrambled-text-demo"
          radius={100}
          duration={1.2}
          speed={0.5}
          scrambleChars=".:"
        >
          Building digital experiences with modern web technologies
        </ScrambledText>
      );
      // eslint-disable-next-line no-unreachable
    } catch (error) {
      console.error('ScrambleText component failed to render:', error);
      setScrambleError(true);
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
              alt="Nguyễn Xuân Hải - Full-Stack Developer"
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
                {!trueFocusError && renderTrueFocus()}
              </div>
            </div>

            <div className="description-container" ref={textRef}>
              {!scrambleError && renderScrambleText()}
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
            <a
              href="/CV_NguyenXuanHai.pdf"
              download="CV_NguyenXuanHai.pdf"
              className="download-cv-btn"
            >
              <i className="fas fa-download"></i>
              Download CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;