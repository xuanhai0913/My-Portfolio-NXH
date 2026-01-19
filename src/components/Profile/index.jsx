import React from 'react';
import profileImage from '../../images/profile.png';
import './styles/Profile.css';

const Profile = () => {
  return (
    <section id="profile" className="profile-section">
      <div className="profile-container">
        {/* Left Content */}
        <div className="profile-content">
          <h1 className="profile-title">
            <div className="title-row">
              {"FULL-STACK".split("").map((char, index) => (
                <span
                  key={`fs-${index}`}
                  className="char-reveal"
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                >
                  {char}
                </span>
              ))}
            </div>
            <div className="title-row">
              <span className="title-highlight">
                {"DEVELOPER".split("").map((char, index) => (
                  <span
                    key={`dev-${index}`}
                    className="char-reveal"
                    style={{ animationDelay: `${0.6 + index * 0.05}s` }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            </div>
          </h1>

          <div className="profile-description animate-up" style={{ animationDelay: '1.2s' }}>
            <p>
              Building digital experiences with modern web technologies.
              Passionate about creating innovative solutions.
            </p>
          </div>

          <div className="profile-actions animate-up" style={{ animationDelay: '1.4s' }}>
            <a
              href="/CV_NguyenXuanHai.pdf"
              download="CV_NguyenXuanHai.pdf"
              className="btn-download"
            >
              DOWNLOAD CV <i className="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </div>

        {/* Right - Profile Image */}
        <div className="profile-image-wrapper animate-reveal" style={{ animationDelay: '0.5s' }}>
          <div className="profile-image-container">
            <img
              src={profileImage}
              alt="Nguyễn Xuân Hải - Full-Stack Developer"
              className="profile-image"
              loading="eager"
            />
          </div>
          <div className="profile-badge float-animation">
            Nguyễn Xuân Hải
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;