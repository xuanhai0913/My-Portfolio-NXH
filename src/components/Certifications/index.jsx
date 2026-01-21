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
    verifyUrl: "https://edu.google.accredible.com/1dd22150-1e7d-4dc6-9ad1-4fd25443e7b3",
    description: "Certified in Google Gemini AI technologies",
    accent: "#4285f4"
  },
  {
    id: 2,
    title: "Google AI for K12 Educators",
    issuer: "Google for Education",
    thumbnail: certGoogleAI,
    verifyUrl: "https://edu.exceedlms.com/student/award/k4zuntPUoY1eRJoBF3zcecCR",
    description: "AI education methodologies for K-12",
    accent: "#34a853"
  },
  {
    id: 3,
    title: "Code a Joke-Telling Talkbot",
    issuer: "Google for Education",
    thumbnail: certTalkbot,
    verifyUrl: "https://edu.exceedlms.com/student/award/T84bwoKX7qy2ghnd33FEjn77",
    description: "Conversational AI development",
    accent: "#ea4335"
  }
];

const Certifications = () => {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

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
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine which card is active based on scroll
  const activeIndex = Math.min(
    certificates.length - 1,
    Math.floor(scrollProgress * certificates.length * 1.2)
  );

  // Calculate card animation state
  const getCardState = (index) => {
    const cardDuration = 1 / certificates.length;
    const cardStart = index * cardDuration * 0.85;
    const cardEnd = cardStart + cardDuration;

    // Local progress within this card's phase
    const localProgress = Math.max(0, Math.min(1,
      (scrollProgress - cardStart) / (cardEnd - cardStart)
    ));

    const isActive = index === activeIndex;
    const isPast = index < activeIndex;
    const isFuture = index > activeIndex;

    return { localProgress, isActive, isPast, isFuture };
  };

  const handleVerify = (url, e) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="certifications" className="certs" ref={sectionRef}>
      <div className="certs__sticky">
        {/* Background */}
        <div className="certs__bg" />

        {/* Header */}
        <header
          className="certs__header"
          style={{
            opacity: Math.min(1, scrollProgress * 8),
            transform: `translateY(${Math.max(0, 40 - scrollProgress * 200)}px)`
          }}
        >
          <span className="certs__eyebrow">Certifications</span>
          <h2 className="certs__title">
            Verified <span>Credentials</span>
          </h2>
        </header>

        {/* Single Card Display */}
        <div className="certs__display">
          {certificates.map((cert, index) => {
            const { isActive, isPast, isFuture, localProgress } = getCardState(index);

            // Only render active and adjacent cards for performance
            if (Math.abs(index - activeIndex) > 1) return null;

            let cardStyle = {};

            if (isActive) {
              // Active card: fully visible, centered
              cardStyle = {
                opacity: 1,
                transform: 'translateY(0) scale(1)',
                zIndex: 10
              };
            } else if (isPast) {
              // Past card: fade out and move up
              cardStyle = {
                opacity: Math.max(0, 1 - localProgress * 2),
                transform: `translateY(${-50 * localProgress}px) scale(${1 - localProgress * 0.1})`,
                zIndex: 5
              };
            } else if (isFuture) {
              // Future card: invisible, waiting below
              const enterProgress = Math.max(0, localProgress);
              cardStyle = {
                opacity: enterProgress,
                transform: `translateY(${80 - enterProgress * 80}px) scale(${0.9 + enterProgress * 0.1})`,
                zIndex: 5
              };
            }

            return (
              <article
                key={cert.id}
                className={`certs__card ${isActive ? 'is-active' : ''}`}
                style={cardStyle}
              >
                <div className="certs__card-img">
                  <img src={cert.thumbnail} alt={cert.title} />
                </div>
                <div className="certs__card-body">
                  <span className="certs__card-issuer" style={{ color: cert.accent }}>
                    {cert.issuer}
                  </span>
                  <h3 className="certs__card-title">{cert.title}</h3>
                  <p className="certs__card-desc">{cert.description}</p>
                  <button
                    className="certs__card-btn"
                    onClick={(e) => handleVerify(cert.verifyUrl, e)}
                    style={{ borderColor: cert.accent }}
                  >
                    Verify Certificate →
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Progress Dots */}
        <nav className="certs__dots">
          {certificates.map((_, index) => (
            <span
              key={index}
              className={`certs__dot ${index === activeIndex ? 'is-active' : ''} ${index < activeIndex ? 'is-past' : ''}`}
            />
          ))}
        </nav>

        {/* Scroll Hint */}
        {scrollProgress < 0.1 && (
          <div className="certs__hint">
            <span>Scroll to explore</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>
    </section>
  );
};

export default Certifications;
