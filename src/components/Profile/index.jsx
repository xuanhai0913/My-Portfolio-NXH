import React, { useEffect, useState } from 'react';
import ExperiencePopup from './ExperiencePopup';
import CVPreview from './CVPreview';
import './styles/Profile.css';

const profileImage = '/images/og-image.jpg';

const Profile = () => {
  const [loaded, setLoaded] = useState(false);
  const [showExperience, setShowExperience] = useState(false);
  const [showCV, setShowCV] = useState(false);

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
              I'm <span className="neon-highlight">Nguyễn Xuân Hải</span> — I build
              production web apps with React, .NET Core & AI.
              <br />From B2B platforms to AI-powered tools,
              shipped for real clients in Vietnam.
            </p>
          </div>

          <div className={`hero-cta ${loaded ? 'in-view' : ''}`}>
            <button
              onClick={() => setShowCV(true)}
              className="btn-brutalist btn-view-cv"
              aria-label="View CV / Resume"
            >
              VIEW CV
              <span className="btn-icon" aria-hidden="true">↗</span>
            </button>

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
                aria-hidden="true"
              />
              <img
                src={profileImage}
                alt="Glitch Layer 2"
                className="profile-img glitch-layer layer-2"
                aria-hidden="true"
              />
            </div>

            <div
              className="floating-badge"
              onClick={() => setShowExperience(true)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowExperience(true); } }}
              role="button"
              tabIndex={0}
              aria-label="View work experience details"
            >
              <span className="status-dot" aria-hidden="true"></span>
              2+ YEARS EXPERIENCE
            </div>

            {/* Decorative Grid Lines */}
            <div className="grid-deco top-left"></div>
            <div className="grid-deco bottom-right"></div>
          </div>
        </div>

      </div>

      {/* Experience Popup */}
      {showExperience && (
        <ExperiencePopup onClose={() => setShowExperience(false)} />
      )}

      {/* CV Preview Modal */}
      {showCV && (
        <CVPreview onClose={() => setShowCV(false)} />
      )}

      {/* Background Ambience */}
      <div className="bg-noise"></div>
    </section>
  );
};

export default Profile;