import React from 'react';
import Squares from '../Squares';
import './styles/Contact.css';

const Contact = () => {
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125412.49414574626!2d106.6169834954909!3d10.8226167776616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529292e8d3dd1%3A0xf15f5aad773c112b!2sHo%20Chi%20Minh%20City%2C%20Vietnam!5e0!3m2!1sen!2s!4v1680841515757!5m2!1sen!2s";

  return (
    <section id="contact" className="contact-section">
      <Squares 
        speed={0.4} 
        squareSize={35}
        direction='diagonal'
        borderColor='rgba(255, 255, 255, 0.08)'
        hoverFillColor='rgba(74, 144, 226, 0.2)'
      />
      <div className="contact-content">
        <h2>Contact</h2>
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
          <div className="map-container">
            <iframe
              src={mapUrl}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;