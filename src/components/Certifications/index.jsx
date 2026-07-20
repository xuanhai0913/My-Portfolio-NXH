import React, { useEffect, useRef, useState } from 'react';
import './styles/Certifications.css';

// Import certificate thumbnail images
import certGoogleAI from '../../images/certs/cert-google-ai-k12.png';
import certTalkbot from '../../images/certs/cert-talkbot.png';
import certGemini from '../../images/certs/cert-gemini.png';
import certGeminiFaculty from '../../images/certs/cert-gemini-faculty.png';
import certECH from '../../images/certs/cert-ech-2025.jpeg';
import certAip101 from '../../images/certs/cert-aipower-aip101.webp';
import certAip102 from '../../images/certs/cert-aipower-aip102.webp';
import certAip103 from '../../images/certs/cert-aipower-aip103.webp';
import certAip104 from '../../images/certs/cert-aipower-aip104.webp';
import certAip106 from '../../images/certs/cert-aipower-aip106.webp';

// Certificate data
const certificates = [
  {
    id: 'aip104',
    title: "Software Development Lifecycle (SDLC)",
    issuer: "AIAcademy by AIPOWER",
    thumbnail: certAip104,
    pdfUrl: "/Cert/AIPOWER-AIP104-SDLC.pdf",
    verifyUrl: "https://aiacademy.aipower.vn/certificates/e53aeb6b738a4a6eafb0c6edf9b2e912",
    credentialId: "E53AEB6B738A",
    accent: "#1fa85b",
    date: "Jul 2026"
  },
  {
    id: 'aip102',
    title: "Information Security Awareness",
    issuer: "AIAcademy by AIPOWER",
    thumbnail: certAip102,
    pdfUrl: "/Cert/AIPOWER-AIP102-Information-Security.pdf",
    verifyUrl: "https://aiacademy.aipower.vn/certificates/a358790e05024ead81b114eb4653361c",
    credentialId: "A358790E0502",
    accent: "#1fa85b",
    date: "Jul 2026"
  },
  {
    id: 'aip103',
    title: "Customer Communication & Professional Workplace Practices",
    issuer: "AIAcademy by AIPOWER",
    thumbnail: certAip103,
    pdfUrl: "/Cert/AIPOWER-AIP103-Customer-Communication.pdf",
    verifyUrl: "https://aiacademy.aipower.vn/certificates/851d6b5833ee4e2fbca70d37201236c8",
    credentialId: "851D6B5833EE",
    accent: "#1fa85b",
    date: "Jul 2026"
  },
  {
    id: 'faculty',
    title: "Gemini Certified Faculty",
    issuer: "Google for Education",
    thumbnail: certGeminiFaculty,
    pdfUrl: "/Cert/Gemini Certified Faculty.pdf",
    verifyUrl: "https://edu.google.accredible.com/b72948bf-9762-446f-b771-5eaadd88ccf9?key=8346ffe5eeaa608d615483a398c1a29a43f53ad92dcd7f8a4a5986d28124ead9",
    description: "Certified Faculty in Google Gemini AI",
    accent: "#8e44ad",
    date: "2025"
  },
  {
    id: 'student',
    title: "Gemini Certified University Student",
    issuer: "Google for Education",
    thumbnail: certGemini,
    pdfUrl: "/Cert/Gemini Certified University Student.pdf",
    verifyUrl: "https://edu.google.accredible.com/1dd22150-1e7d-4dc6-9ad1-4fd25443e7b3",
    description: "Certified in Google Gemini AI technologies",
    accent: "#4285f4",
    date: "Dec 2025"
  },
  {
    id: 'google-ai-k12',
    title: "Google AI for K12 Educators",
    issuer: "Google for Education",
    thumbnail: certGoogleAI,
    pdfUrl: "/Cert/Google AI for K12 Educators _ Google for Education.pdf",
    verifyUrl: "https://edu.exceedlms.com/student/award/k4zuntPUoY1eRJoBF3zcecCR",
    description: "AI education methodologies for K-12",
    accent: "#34a853",
    date: "Dec 2025"
  },
  {
    id: 'talkbot',
    title: "Code a Joke-Telling Talkbot",
    issuer: "Google for Education",
    thumbnail: certTalkbot,
    pdfUrl: "/Cert/Google for Education.pdf",
    verifyUrl: "https://edu.exceedlms.com/student/award/T84bwoKX7qy2ghnd33FEjn77",
    description: "Conversational AI development",
    accent: "#ea4335",
    date: "Dec 2025"
  },
  {
    id: 'aip101',
    title: "Workplace Policies & Operational Procedures",
    issuer: "AIAcademy by AIPOWER",
    thumbnail: certAip101,
    pdfUrl: "/Cert/AIPOWER-AIP101-Workplace-Policies.pdf",
    verifyUrl: "https://aiacademy.aipower.vn/certificates/7756e001cd694e42bf52d5dcb3963d5c",
    credentialId: "7756E001CD69",
    accent: "#1fa85b",
    date: "Jul 2026"
  },
  {
    id: 'aip106',
    title: "Workplace Hygiene & Office Standards",
    issuer: "AIAcademy by AIPOWER",
    thumbnail: certAip106,
    pdfUrl: "/Cert/AIPOWER-AIP106-Workplace-Hygiene.pdf",
    verifyUrl: "https://aiacademy.aipower.vn/certificates/f861ed4468ab48328d5173ed479292ed",
    credentialId: "F861ED4468AB",
    accent: "#1fa85b",
    date: "Jul 2026"
  },
  {
    id: 'ech',
    title: "Volunteer Participation Certificate",
    issuer: "ECH - English Community House",
    thumbnail: certECH,
    verifyUrl: "https://ech.edu.vn/",
    description: "Certificate of volunteer participation at ECH",
    accent: "#e67e22",
    date: "2025"
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
              style={{ transitionDelay: `${index * 0.08}s` }}
            >
              <div className="cert-inner">
                <a
                  className="cert-thumb"
                  href={cert.pdfUrl || cert.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${cert.pdfUrl ? 'View' : 'Verify'} ${cert.title} certificate`}
                >
                  <img src={cert.thumbnail} alt={cert.title} loading="lazy" decoding="async" />
                  <div className="view-overlay">
                    <span>{cert.pdfUrl ? 'VIEW PDF ↗' : 'VERIFY ↗'}</span>
                  </div>
                </a>

                <div className="cert-meta">
                  <span className="cert-issuer" style={{ color: cert.accent }}>
                    {cert.issuer}
                  </span>
                  <span className="cert-date">{cert.date}</span>
                </div>

                <h3 className="cert-title">{cert.title}</h3>

                <div className="cert-actions">
                  {cert.credentialId && (
                    <span className="credential-id">ID {cert.credentialId}</span>
                  )}
                  <a
                    className="cert-verify"
                    href={cert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Verify credential ↗
                  </a>
                </div>
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
