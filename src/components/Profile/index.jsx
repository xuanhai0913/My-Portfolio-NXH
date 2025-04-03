import React from 'react';
import Waves from '../Waves';
import profileImage from '../../images/profile.png'; // Import the image
import './styles/Profile.css';

const Profile = () => {
  return (
    <section id="profile" className="profile-section">
      <Waves
        lineColor="#4a90e2"
        backgroundColor="rgba(75, 65, 65, 0.31)"
        waveSpeedX={0.015}
        waveSpeedY={0.01}
        waveAmpX={30}
        waveAmpY={15}
        friction={0.9}
        tension={0.01}
        maxCursorMove={100}
        xGap={15}
        yGap={40}
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