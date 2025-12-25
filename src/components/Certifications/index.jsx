import React, { useEffect, useRef } from 'react';
import Squares from '../Squares';
import './styles/Certifications.css';

// Import certificate thumbnail images (converted from real PDFs)
import certGoogleAI from '../../images/certs/cert-google-ai-k12.png';
import certTalkbot from '../../images/certs/cert-talkbot.png';
import certGemini from '../../images/certs/cert-gemini.png';

// Certificate data with updated verification links
const certificates = [
  {
    id: 1,
    title: "Gemini Certified University Student",
    issuer: "Google",
    thumbnail: certGemini,
    verifyUrl: "https://edu.google.accredible.com/1dd22150-1e7d-4dc6-9ad1-4fd25443e7b3#acc.Zli4Y2P5",
    description: "Certified in Google Gemini AI technologies and applications"
  },
  {
    id: 2,
    title: "Google AI for K12 Educators",
    issuer: "Google for Education",
    thumbnail: certGoogleAI,
    verifyUrl: "https://edu.exceedlms.com/student/award/k4zuntPUoY1eRJoBF3zcecCR",
    description: "AI education methodologies for K-12 teaching environments"
  },
  {
    id: 3,
    title: "Code a Joke-Telling Talkbot",
    issuer: "Google for Education",
    thumbnail: certTalkbot,
    verifyUrl: "https://edu.exceedlms.com/student/award/T84bwoKX7qy2ghnd33FEjn77",
    description: "Conversational AI and chatbot development fundamentals"
  }
];

const Certifications = () => {
  const sectionRef = useRef(null);
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

  const handleViewCertificate = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="certifications" className="certifications-section" ref={sectionRef}>
      <Squares
        speed={0.4}
        squareSize={window.innerWidth < 768 ? 25 : 35}
        direction='diagonal'
        borderColor='rgba(255, 255, 255, 0.08)'
        hoverFillColor='rgba(74, 144, 226, 0.2)'
      />

      <div className="certifications-content">
        <div className="certifications-header">
          <span className="section-badge">
            <i className="fas fa-award"></i>
            Achievements
          </span>
          <h2 className="certifications-title">Certifications</h2>
          <p className="certifications-subtitle">
            <i className="fab fa-google"></i>
            Verified by Google for Education
          </p>
        </div>

        <div className="certifications-grid">
          {certificates.map((cert, index) => (
            <div
              key={cert.id}
              className="cert-card hidden"
              ref={el => certRefs.current[index] = el}
              style={{ '--delay': `${index * 0.15}s` }}
            >
              <div
                className="cert-thumbnail"
                onClick={() => handleViewCertificate(cert.verifyUrl)}
                role="button"
                tabIndex={0}
                aria-label={`View ${cert.title} certificate`}
              >
                <img src={cert.thumbnail} alt={cert.title} loading="lazy" />
              </div>

              <div className="cert-body">
                <h3 className="cert-title">{cert.title}</h3>
                <div className="cert-issuer">
                  <i className="fab fa-google"></i>
                  <span>{cert.issuer}</span>
                </div>
                <p className="cert-description">{cert.description}</p>
              </div>

              <button
                className="cert-verify-btn"
                onClick={() => handleViewCertificate(cert.verifyUrl)}
                aria-label={`Verify ${cert.title} certificate`}
              >
                <i className="fas fa-external-link-alt"></i>
                <span>Verify Certificate</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
