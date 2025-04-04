import React from 'react';
import Aurora from '../Aurora';
import RotatingText from '../RotatingText';
import profileImage from '../../images/profile.png';
import './styles/Profile.css';

const Profile = () => {
  return (
    <section id="profile" className="profile-section">
      <Aurora
        colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
        blend={0.2}
        amplitude={0.8}
        speed={1.5}
      />
      <div className="profile-content">
        <div className="profile-card">
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
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ 
                    type: "spring",
                    damping: 25,
                    stiffness: 300,
                    mass: 0.5
                  }}
                  staggerDuration={0.02}
                  rotationInterval={3500}
                  splitLevelClassName="title-split"
                />
              </div>
            </div>
            <p className="description">Building digital experiences with modern web technologies</p>
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