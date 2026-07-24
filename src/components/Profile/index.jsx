import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ExperiencePopup from './ExperiencePopup';
import CVPreview from './CVPreview';
import './homeTranslations';
import './styles/Profile.css';

const profileImage = '/images/og-image.jpg';

const Profile = () => {
  const { t } = useTranslation('home');
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
              {t('profile.titleLine1')}
            </span>
            <span className={`hero-line line-2 ${loaded ? 'in-view' : ''}`}>
              <span className="hollow-text">{t('profile.titleLine2')}</span>
            </span>
          </h1>

          <div className={`hero-sub ${loaded ? 'in-view' : ''}`}>
            <p>
              {t('profile.introBeforeName')}{' '}
              <span className="neon-highlight">Nguyễn Xuân Hải</span>{' '}
              {t('profile.introAfterName')}
              <br />{t('profile.introLine2')}
            </p>
          </div>

          <div className={`hero-cta ${loaded ? 'in-view' : ''}`}>
            <button
              onClick={() => setShowCV(true)}
              className="btn-brutalist btn-view-cv"
              aria-label={t('profile.viewCvAria')}
            >
              {t('profile.viewCv')}
              <span className="btn-icon" aria-hidden="true">↗</span>
            </button>

            <div className="scroll-hint">
              <span>{t('profile.scrollHint')}</span>
            </div>
          </div>
        </div>

        {/* Right: Glitch Image */}
        <div className={`profile-visual ${loaded ? 'in-view' : ''}`}>
          <div className="glitch-frame">
            <div className="glitch-image-wrapper">
              <img
                src={profileImage}
                alt={t('profile.profileImageAlt')}
                className="profile-img main-img"
              />
              <img
                src={profileImage}
                alt=""
                className="profile-img glitch-layer layer-1"
                aria-hidden="true"
              />
              <img
                src={profileImage}
                alt=""
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
              aria-label={t('profile.experienceBadgeAria')}
            >
              <span className="status-dot" aria-hidden="true"></span>
              {t('profile.experienceBadge')}
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
