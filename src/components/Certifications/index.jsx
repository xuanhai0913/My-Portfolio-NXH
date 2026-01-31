import React, { useEffect, useRef, useState } from 'react';
import './styles/Certifications.css';

// Import certificate thumbnail images
import certGoogleAI from '../../images/certs/cert-google-ai-k12.png';
import certTalkbot from '../../images/certs/cert-talkbot.png';
import certGemini from '../../images/certs/cert-gemini.png';
import certGeminiFaculty from '../../images/certs/cert-gemini-faculty.png';

// Certificate data
const certificates = [
  {
    id: 1,
    title: "Gemini Certified Faculty",
    issuer: "Google",
    thumbnail: certGeminiFaculty,
    pdfUrl: "/Cert/Gemini Certified Faculty.pdf",
    verifyUrl: "https://edu.google.accredible.com/b72948bf-9762-446f-b771-5eaadd88ccf9?key=8346ffe5eeaa608d615483a398c1a29a43f53ad92dcd7f8a4a5986d28124ead9",
    description: "Certified Faculty in Google Gemini AI",
    accent: "#8e44ad",
    date: "2025"
  },
  {
    id: 2,
    title: "Gemini Certified University Student",
    issuer: "Google",
    thumbnail: certGemini,
    verifyUrl: "https://edu.google.accredible.com/1dd22150-1e7d-4dc6-9ad1-4fd25443e7b3",
    description: "Certified in Google Gemini AI technologies",
    accent: "#4285f4",
    date: "2024"
  },
  {
    id: 3,
    title: "Google AI for K12 Educators",
    issuer: "Google for Education",
    thumbnail: certGoogleAI,
    verifyUrl: "https://edu.exceedlms.com/student/award/k4zuntPUoY1eRJoBF3zcecCR",
    description: "AI education methodologies for K-12",
    accent: "#34a853",
    date: "2023"
  },
  {
    id: 4,
    title: "Code a Joke-Telling Talkbot",
    issuer: "Google for Education",
    thumbnail: certTalkbot,
    verifyUrl: "https://edu.exceedlms.com/student/award/T84bwoKX7qy2ghnd33FEjn77",
    description: "Conversational AI development",
    accent: "#ea4335",
    date: "2023"
  }
];

const Certifications = () => {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleVerify = (url, e) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="certifications" className="certs-section" ref={sectionRef}>
      {/* Background Grid Animation */}
      <div className="digital-grid-bg">
        <div className="grid-lines horizontal"></div>
        <div className="grid-lines vertical"></div>
      </div>

      <div className="certs-container">

        {/* Header */}
        <header className={`certs-header ${inView ? 'in-view' : ''}`}>
          <div className="header-deco">
            <span className="deco-line"></span>
            <span className="deco-text">VERIFIED_CREDENTIALS</span>
          </div>
          <h2 className="section-title">CERTIFICATIONS</h2>
        </header>

        {/* Responsive Grid/Stack */}
        <div className="certs-grid">
          {certificates.map((cert, index) => (
            <article
              key={cert.id}
              className={`cert-item ${inView ? 'in-view' : ''}`}
              style={{ transitionDelay: `${index * 0.2}s` }}
              onClick={(e) => handleVerify(cert.verifyUrl, e)}
            >
              <div className="cert-inner">
                <div className="cert-thumb">
                  <img src={cert.thumbnail} alt={cert.title} />
                  <div className="view-overlay">
                    <span>VERIFY ↗</span>
                  </div>
                </div>

                <div className="cert-meta">
                  <span className="cert-issuer" style={{ color: cert.accent }}>
                    {cert.issuer}
                  </span>
                  <span className="cert-date">{cert.date}</span>
                </div>

                <h3 className="cert-title">{cert.title}</h3>
              </div>

              {/* Corner Accents */}
              <div className="corner top-left"></div>
              <div className="corner bottom-right"></div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Certifications;
