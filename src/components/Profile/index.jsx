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
            FULL-STACK <br />
            <span className="title-highlight">DEVELOPER</span>
          </h1>

          <div className="profile-description">
            <p>
              Building digital experiences with modern web technologies.
              Passionate about creating innovative solutions.
            </p>
          </div>

          <div className="profile-actions">
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
        <div className="profile-image-wrapper">
          <div className="profile-image-container">
            <img
              src={profileImage}
              alt="Nguyễn Xuân Hải - Full-Stack Developer"
              className="profile-image"
              loading="eager"
            />
          </div>
          <div className="profile-badge">
            Nguyễn Xuân Hải
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;