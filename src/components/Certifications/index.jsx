import React, { useEffect, useRef } from 'react';
import './styles/Certifications.css';

// Import certificate thumbnail images
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
    color: "#8E44AD",
    verifyUrl: "https://edu.google.accredible.com/1dd22150-1e7d-4dc6-9ad1-4fd25443e7b3#acc.Zli4Y2P5",
    description: "Certified in Google Gemini AI technologies and applications"
  },
  {
    id: 2,
    title: "Google AI for K12 Educators",
    issuer: "Google for Education",
    thumbnail: certGoogleAI,
    color: "#4285F4",
    verifyUrl: "https://edu.exceedlms.com/student/award/k4zuntPUoY1eRJoBF3zcecCR",
    description: "AI education methodologies for K-12 teaching environments"
  },
  {
    id: 3,
    title: "Code a Joke-Telling Talkbot",
    issuer: "Google for Education",
    thumbnail: certTalkbot,
    color: "#34A853",
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
      {/* Animated gradient mesh background */}
      <div className="gradient-mesh">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

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
              style={{
                '--delay': `${index * 0.15}s`,
                '--accent-color': cert.color
              }}
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
