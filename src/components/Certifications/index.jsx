import React, { useEffect, useRef, useState } from 'react';
import './styles/Certifications.css';

// Import certificate thumbnail images
import certGoogleAI from '../../images/certs/cert-google-ai-k12.png';
import certTalkbot from '../../images/certs/cert-talkbot.png';
import certGemini from '../../images/certs/cert-gemini.png';

// Certificate data
const certificates = [
  {
    id: 1,
    title: "Gemini Certified University Student",
    issuer: "Google",
    thumbnail: certGemini,
    verifyUrl: "https://edu.google.accredible.com/1dd22150-1e7d-4dc6-9ad1-4fd25443e7b3#acc.Zli4Y2P5",
    description: "Certified in Google Gemini AI technologies",
    color: "#4285f4"
  },
  {
    id: 2,
    title: "Google AI for K12 Educators",
    issuer: "Google for Education",
    thumbnail: certGoogleAI,
    verifyUrl: "https://edu.exceedlms.com/student/award/k4zuntPUoY1eRJoBF3zcecCR",
    description: "AI education methodologies for K-12",
    color: "#34a853"
  },
  {
    id: 3,
    title: "Code a Joke-Telling Talkbot",
    issuer: "Google for Education",
    thumbnail: certTalkbot,
    verifyUrl: "https://edu.exceedlms.com/student/award/T84bwoKX7qy2ghnd33FEjn77",
    description: "Conversational AI development",
    color: "#ea4335"
  }
];

const Certifications = () => {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeCard, setActiveCard] = useState(0);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;

      const scrolled = -rect.top;
      const totalScrollable = sectionHeight - viewportHeight;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

      setScrollProgress(progress);

      // Determine active card based on progress
      if (progress < 0.33) setActiveCard(0);
      else if (progress < 0.66) setActiveCard(1);
      else setActiveCard(2);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate card positions based on scroll
  const getCardStyle = (index) => {
    const cardPhases = [
      { start: 0, peak: 0.15, end: 0.4 },
      { start: 0.25, peak: 0.5, end: 0.75 },
      { start: 0.55, peak: 0.8, end: 1 }
    ];

    const phase = cardPhases[index];
    const isActive = index === activeCard;

    let opacity = 0.3;
    let translateY = 100;
    let translateX = 0;
    let scale = 0.85;
    let zIndex = index;

    if (scrollProgress >= phase.start) {
      // Card entering
      const enterProgress = Math.min(1, (scrollProgress - phase.start) / (phase.peak - phase.start));
      opacity = 0.3 + enterProgress * 0.7;
      translateY = 100 - enterProgress * 100;
      scale = 0.85 + enterProgress * 0.15;
    }

    if (scrollProgress >= phase.peak) {
      // Card at peak or exiting
      opacity = 1;
      translateY = 0;
      scale = 1;

      if (scrollProgress > phase.peak && index < 2) {
        // Push to left when next card comes
        const exitProgress = Math.min(1, (scrollProgress - phase.peak) / (phase.end - phase.peak));
        translateX = -exitProgress * (200 + index * 50);
        scale = 1 - exitProgress * 0.1;
        opacity = 1 - exitProgress * 0.4;
        zIndex = 10 - index;
      }
    }

    if (isActive) {
      zIndex = 20;
    }

    return {
      opacity,
      transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
      zIndex,
      transition: 'all 0.1s ease-out'
    };
  };

  // Header animation
  const headerStyle = {
    opacity: Math.min(1, scrollProgress * 5 + 0.5),
    transform: `translateY(${Math.max(0, 30 - scrollProgress * 100)}px)`
  };

  // Counter display
  const counterStyle = {
    opacity: scrollProgress > 0.05 ? 1 : 0
  };

  const handleViewCertificate = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="certifications" className="cert-section" ref={sectionRef}>
      <div className="cert-sticky">
        {/* Background gradient */}
        <div className="cert-bg">
          <div className="cert-bg-gradient" />
          <div className="cert-bg-grid" />
        </div>

        {/* Content */}
        <div className="cert-container">
          {/* Header */}
          <header className="cert-header" style={headerStyle}>
            <span className="cert-label">Professional Certifications</span>
            <h2 className="cert-title">
              Verified <span className="highlight">Credentials</span>
            </h2>
          </header>

          {/* Card Stack */}
          <div className="cert-stack">
            {certificates.map((cert, index) => (
              <article
                key={cert.id}
                className={`cert-card ${index === activeCard ? 'active' : ''}`}
                style={getCardStyle(index)}
                onClick={() => handleViewCertificate(cert.verifyUrl)}
              >
                <div className="cert-card-inner">
                  <div className="cert-card-image">
                    <img src={cert.thumbnail} alt={cert.title} />
                    <div className="cert-card-overlay" style={{ background: `linear-gradient(135deg, ${cert.color}20, transparent)` }} />
                  </div>
                  <div className="cert-card-content">
                    <span className="cert-issuer" style={{ color: cert.color }}>{cert.issuer}</span>
                    <h3 className="cert-name">{cert.title}</h3>
                    <p className="cert-desc">{cert.description}</p>
                    <button className="cert-verify-btn">
                      Verify Certificate
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Progress Counter */}
          <div className="cert-counter" style={counterStyle}>
            <span className="cert-counter-current">{String(activeCard + 1).padStart(2, '0')}</span>
            <span className="cert-counter-divider">/</span>
            <span className="cert-counter-total">{String(certificates.length).padStart(2, '0')}</span>
          </div>

          {/* Scroll indicator */}
          <div className="cert-scroll-hint" style={{ opacity: scrollProgress < 0.1 ? 1 : 0 }}>
            <span>Scroll to explore</span>
            <div className="cert-scroll-arrow">↓</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
