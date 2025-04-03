import React from 'react';
import Aurora from '../Aurora';
import profileImage from '../../images/profile.png';
import './styles/Profile.css';

const Profile = () => {
  return (
    <section id="profile" className="profile-section">
      <Aurora
        colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-image"> 
            <img src={profileImage} alt="Profile" />
          </div>
          <div className="profile-info">
            <h2>Nguyễn Xuân Hải</h2>
            <p className="title">Frontend Developer</p>
            <p className="description">Building digital experiences with modern web technologies</p>
            <div className="social-links">
              <a href="https://github.com/xuanhai0913" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github"></i> GitHub
              </a>
              <a href="https://linkedin.com/in/xuanhai0913" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin"></i> LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;