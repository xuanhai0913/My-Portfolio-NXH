import React from 'react';
import './styles/Contact.css';

const Contact = () => {
  return (
    <section id="contact" className="contact-section">
      <h2>Get In Touch</h2>
      <div className="contact-container">
        <div className="contact-info">
          <div className="contact-item">
            <i className="fas fa-envelope"></i>
            <p>email@example.com</p>
          </div>
          <div className="contact-item">
            <i className="fas fa-phone"></i>
            <p>+84 xxx xxx xxx</p>
          </div>
          <div className="contact-item">
            <i className="fas fa-map-marker-alt"></i>
            <p>Hanoi, Vietnam</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;