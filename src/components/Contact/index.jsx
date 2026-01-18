import React from 'react';
import './styles/Contact.css';

const Contact = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        {/* Left - Title & Social */}
        <div className="contact-title-area">
          <h2 className="contact-title">
            GET IN <br />
            <span className="title-highlight">TOUCH</span>
          </h2>
          <div className="social-links">
            <a href="https://github.com/xuanhai0913" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://linkedin.com/in/xuanhai0913" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="https://www.youtube.com/@xuanhai0913" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        {/* Right - Contact Cards */}
        <div className="contact-cards">
          <div className="contact-card">
            <span className="card-label">EMAIL</span>
            <a href="mailto:xuanhai0913750452@gmail.com" className="card-value">
              xuanhai0913750452@gmail.com
            </a>
          </div>
          <div className="contact-card">
            <span className="card-label">PHONE</span>
            <a href="tel:+84929501116" className="card-value">
              +84 929 501 116
            </a>
          </div>
          <div className="contact-card accent full-width">
            <span className="card-label">LOCATION</span>
            <span className="card-value large">HO CHI MINH CITY, VIETNAM</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;