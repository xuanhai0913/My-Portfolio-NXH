import React, { useEffect, useRef } from 'react';
import Squares from '../Squares';
import './styles/Certifications.css';

// Certificate data - links to PDF files
const certificates = [
  {
    id: 1,
    title: "Google AI for K12 Educators",
    issuer: "Google for Education",
    icon: "fas fa-robot",
    color: "#4285F4",
    pdfUrl: "/Cert/Google AI for K12 Educators _ Google for Education.pdf",
    description: "Certification in AI education methodologies for K-12 teaching environments"
  },
  {
    id: 2,
    title: "Google for Education",
    issuer: "Google",
    icon: "fas fa-graduation-cap",
    color: "#34A853",
    pdfUrl: "/Cert/Google for Education.pdf",
    description: "Certification in Google's educational tools and platforms"
  }
];

const Certifications = () => {
  const certRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px"
      }
    );

    certRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const handleViewCertificate = (pdfUrl) => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <section id="certifications" className="certifications-section">
      <Squares
        speed={0.4}
        squareSize={window.innerWidth < 768 ? 25 : 35}
        direction='diagonal'
        borderColor='rgba(255, 255, 255, 0.08)'
        hoverFillColor='rgba(74, 144, 226, 0.2)'
      />
      <div className="certifications-content">
        <h2 className="certifications-title">
          <i className="fas fa-certificate"></i>
          Certifications
        </h2>
        <p className="certifications-subtitle">
          Professional certifications and achievements
        </p>
        
        <div className="certifications-grid">
          {certificates.map((cert, index) => (
            <div
              key={cert.id}
              className="cert-card hidden"
              ref={el => certRefs.current[index] = el}
              style={{
                '--delay': `${index * 0.15}s`,
                '--accent-color': cert.color
              }}
            >
              <div className="cert-icon" style={{ background: `linear-gradient(135deg, ${cert.color}, ${cert.color}dd)` }}>
                <i className={cert.icon}></i>
              </div>
              <div className="cert-content">
                <h3>{cert.title}</h3>
                <span className="cert-issuer">
                  <i className="fas fa-building"></i>
                  {cert.issuer}
                </span>
                <p className="cert-description">{cert.description}</p>
              </div>
              <button 
                className="cert-view-btn"
                onClick={() => handleViewCertificate(cert.pdfUrl)}
              >
                <i className="fas fa-external-link-alt"></i>
                View Certificate
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
