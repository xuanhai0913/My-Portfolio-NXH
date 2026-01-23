import React, { useEffect, useState } from 'react';
import profileImage from '../../images/profile.png';
import './styles/Profile.css';

const Profile = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section id="profile" className="profile-section">
      <div className="profile-grid">

        {/* Left: Typography */}
        <div className="profile-content">
          <h1 className="hero-title">
            <span className={`hero-line line-1 ${loaded ? 'in-view' : ''}`}>
              FULL-STACK
            </span>
            <span className={`hero-line line-2 ${loaded ? 'in-view' : ''}`}>
              <span className="hollow-text">DEVELOPER</span>
            </span>
          </h1>

          <div className={`hero-sub ${loaded ? 'in-view' : ''}`}>
            <p>
              Building digital experiences with <span className="neon-highlight">modern web technologies</span>.
              <br />Passionate about creating innovative solutions.
            </p>
          </div>

          <div className={`hero-cta ${loaded ? 'in-view' : ''}`}>
            <a href="/CV_NguyenXuanHai.pdf" download className="btn-brutalist">
              DOWNLOAD CV
              <span className="btn-icon">↓</span>
            </a>

            <div className="scroll-hint">
              <span>SCROLL TO EXPLORE</span>
            </div>
          </div>
        </div>

        {/* Right: Glitch Image */}
        <div className={`profile-visual ${loaded ? 'in-view' : ''}`}>
          <div className="glitch-frame">
            <div className="glitch-image-wrapper">
              <img
                src={profileImage}
                alt="Nguyễn Xuân Hải"
                className="profile-img main-img"
              />
              <img
                src={profileImage}
                alt="Glitch Layer 1"
                className="profile-img glitch-layer layer-1"
              />
              <img
                src={profileImage}
                alt="Glitch Layer 2"
                className="profile-img glitch-layer layer-2"
              />
            </div>

            <div className="floating-badge">
              <span className="status-dot"></span>
              Nguyễn Xuân Hải
            </div>

            {/* Decorative Grid Lines */}
            <div className="grid-deco top-left"></div>
            <div className="grid-deco bottom-right"></div>
          </div>
        </div>

      </div>

      {/* Background Ambience */}
      <div className="bg-noise"></div>
    </section>
  );
};

export default Profile;