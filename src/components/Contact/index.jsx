import React from 'react';
import './styles/Contact.css';

const Contact = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">

        <h2 className="vertical-header">CONTACT</h2>

        <div className="contact-content">
          <p className="contact-intro">
            Have an idea or project? Let's collaborate and build something <span className="neon">extraordinary</span>.
          </p>

          <form className="minimal-form">
            <div className="form-group">
              <input type="text" placeholder="NAME" required />
            </div>
            <div className="form-group">
              <input type="email" placeholder="EMAIL" required />
            </div>
            <div className="form-group">
              <textarea placeholder="MESSAGE" rows="4" required></textarea>
            </div>

            <button type="submit" className="btn-submit">
              SEND MESSAGE →
            </button>
          </form>

          <div className="social-links">
            <a href="https://github.com/xuanhai0913" target="_blank" rel="noreferrer" className="social-icon">GITHUB</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon">LINKEDIN</a>
            <a href="mailto:contact@hailamdev.space" className="social-icon">EMAIL</a>
          </div>
        </div>

      </div>

      <footer className="simple-footer">
        <p>© 2024 NGUYEN XUAN HAI. ALL RIGHTS RESERVED.</p>
      </footer>
    </section>
  );
};

export default Contact;