import React from 'react';
import Squares from '../Squares';
import './styles/Contact.css';

const Contact = () => {
  
  return (
    <section id="contact" className="contact-section">
      <h2>Get In Touch</h2>
      <div className="contact-container">
        <div className="contact-info">
          <div className="contact-item">
            <i className="fas fa-envelope"></i>
            <p>xuanhai0913750452@gmail.com</p>
          </div>
          <div className="contact-item">
            <i className="fas fa-phone"></i>
            <p>+84 929 501 116</p>
          </div>
          <div className="contact-item">
            <i className="fas fa-map-marker-alt"></i>
            <p>Ho Chi Minh City, Vietnam</p>
          </div>
        </div>
      </div>
    </section>
    
  );
};

export default Contact;