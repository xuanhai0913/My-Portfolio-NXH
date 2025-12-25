import React, { useEffect, useRef } from 'react';
import './styles/Certifications.css';

// Import certificate thumbnail images (converted from real PDFs)
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
    featured: true
  },
  {
    id: 2,
    title: "Google AI for K12 Educators",
    issuer: "Google for Education",
    thumbnail: certGoogleAI,
    verifyUrl: "https://edu.exceedlms.com/student/award/k4zuntPUoY1eRJoBF3zcecCR",
    description: "AI education methodologies for K-12"
  },
  {
    id: 3,
    title: "Code a Joke-Telling Talkbot",
    issuer: "Google for Education",
    thumbnail: certTalkbot,
    verifyUrl: "https://edu.exceedlms.com/student/award/T84bwoKX7qy2ghnd33FEjn77",
    description: "Conversational AI development"
  }
];

const Certifications = () => {
  const sectionRef = useRef(null);
  const certRefs = useRef([]);
  const canvasRef = useRef(null);

  // Matrix/Code rain animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(18, 18, 18, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#4a90e2';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.globalAlpha = Math.random() * 0.5 + 0.1;
        ctx.fillText(char, x, y);
        ctx.globalAlpha = 1;

        if (y > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
          }
        });
      },
      { threshold: 0.1 }
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
      {/* Animated matrix background */}
      <canvas ref={canvasRef} className="matrix-bg" />
      <div className="overlay-gradient" />

      <div className="certifications-content">
        <div className="certifications-header">
          <span className="terminal-tag">&lt;certifications&gt;</span>
          <h2 className="certifications-title">
            <span className="highlight">Verified</span> Credentials
          </h2>
          <p className="certifications-subtitle">
            <span className="typing-cursor">_</span> Professional certifications from Google
          </p>
        </div>

        {/* Creative asymmetric layout */}
        <div className="cert-showcase">
          {certificates.map((cert, index) => (
            <div
              key={cert.id}
              className={`cert-card ${cert.featured ? 'featured' : ''} hidden`}
              ref={el => certRefs.current[index] = el}
              style={{ '--i': index }}
              onClick={() => handleViewCertificate(cert.verifyUrl)}
            >
              <div className="card-glow" />
              <div className="cert-image-wrapper">
                <img src={cert.thumbnail} alt={cert.title} loading="lazy" />
                <div className="scan-line" />
              </div>

              <div className="cert-info">
                <span className="cert-issuer">{cert.issuer}</span>
                <h3 className="cert-title">{cert.title}</h3>
                <p className="cert-desc">{cert.description}</p>

                <button className="verify-btn">
                  <span className="btn-text">Verify</span>
                  <span className="btn-icon">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <span className="terminal-tag closing">&lt;/certifications&gt;</span>
      </div>
    </section>
  );
};

export default Certifications;
