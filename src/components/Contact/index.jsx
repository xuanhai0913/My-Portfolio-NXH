import React from 'react';
import Squares from '../Squares';
import FuzzyText from '../FuzzyText';
import './styles/Contact.css';

const Contact = () => {
  const API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Thay thế bằng API key của bạn
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=Ho+Chi+Minh+City,Vietnam`;

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
        <div className="contact-title">
          <FuzzyText
            fontSize="clamp(2.5rem, 5vw, 4rem)"
            fontWeight={700}
            color="#4a90e2"
            baseIntensity={0.15}
            hoverIntensity={0.4}
          >
            Contact
          </FuzzyText>
        </div>
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