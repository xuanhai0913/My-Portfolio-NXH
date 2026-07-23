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
import certAwsCloudPractitioner from '../../images/certs/cert-aws-cloud-practitioner-essentials.png';
import certAwsDatabases from '../../images/certs/cert-aws-educate-getting-started-with-databases.png';
import certAwsGenerativeAi from '../../images/certs/cert-aws-educate-generative-ai.png';
import certAwsMachineLearning from '../../images/certs/cert-aws-educate-machine-learning-foundations.png';
import certAwsGettingStartedServerless from '../../images/certs/cert-aws-educate-getting-started-with-serverless.png';
import certAwsServerless from '../../images/certs/cert-aws-serverless-mindset.png';
import certAwsBuildingFrontDoor from '../../images/certs/cert-aws-building-front-door.png';
import certAwsEventDriven from '../../images/certs/cert-aws-designing-event-driven-architectures.png';
import certAwsLambdaIntro from '../../images/certs/cert-aws-introduction-to-aws-lambda.png';
import certAwsLambdaFoundations from '../../images/certs/cert-aws-lambda-foundations.png';
import certAwsServerlessScaling from '../../images/certs/cert-aws-scaling-serverless-architectures.png';
import certAwsServerlessSecurity from '../../images/certs/cert-aws-security-and-observability-for-serverless-applications.png';
import certAwsServerlessDeploy from '../../images/certs/cert-aws-deploying-serverless-applications.png';
import certAwsApiGateway from '../../images/certs/cert-aws-amazon-api-gateway-for-serverless-applications.png';
import certGoogleCloudInfrastructure from '../../images/certs/cert-google-cloud-infrastructure-foundation.png';
import certGoogleGenAiChatbot from '../../images/certs/cert-google-gen-ai-chatbot.png';
import certGoogleGenAiFoundations from '../../images/certs/cert-google-gen-ai-foundations.png';
import certGoogleGenAiLandscape from '../../images/certs/cert-google-gen-ai-landscape.png';
import certGoogleGenAiApps from '../../images/certs/cert-google-gen-ai-apps.png';
import certGoogleGenAiAgents from '../../images/certs/cert-google-gen-ai-agents.png';

// Certificate data
const certificates = [
  {
    id: 'aws-cloud-practitioner-essentials',
    title: "AWS Cloud Practitioner Essentials",
    issuer: "AWS Training & Certification",
    thumbnail: certAwsCloudPractitioner,
    pdfUrl: "/Cert/AWS-Cloud-Practitioner-Essentials.pdf",
    description: "Completion certificate covering foundational AWS Cloud concepts and services",
    actionLabel: "View completion certificate ↗",
    accent: "#ff9900",
    date: "Jul 2026",
    tags: ['featured', 'aws', 'cloud-data']
  },
  {
    id: 'aws-educate-getting-started-with-databases',
    title: "AWS Educate Getting Started with Databases",
    issuer: "AWS Training & Certification",
    thumbnail: certAwsDatabases,
    verifyUrl: "https://www.credly.com/badges/9c8c5b6c-71f2-46e2-92b4-264c4cf9aa3b/public_url",
    description: "Training badge covering database concepts and foundational AWS database services",
    actionLabel: "Verify digital badge ↗",
    accent: "#ff9900",
    date: "Jul 2026",
    tags: ['featured', 'aws', 'cloud-data']
  },
  {
    id: 'aws-educate-generative-ai',
    title: "AWS Educate Introduction to Generative AI",
    issuer: "AWS Training & Certification",
    thumbnail: certAwsGenerativeAi,
    verifyUrl: "https://www.credly.com/badges/b4359efe-7437-4a0a-8753-d39143683c06/public_url",
    description: "Training badge covering foundational generative AI concepts and AWS use cases",
    actionLabel: "Verify digital badge ↗",
    accent: "#ff9900",
    date: "Jul 2026",
    tags: ['featured', 'aws', 'ai-ml']
  },
  {
    id: 'aws-educate-machine-learning-foundations',
    title: "AWS Educate Machine Learning Foundations",
    issuer: "AWS Training & Certification",
    thumbnail: certAwsMachineLearning,
    verifyUrl: "https://www.credly.com/badges/70759e75-f89f-4360-aee4-208b396b2f1d/public_url",
    description: "Training badge covering foundational machine learning concepts and workflows",
    actionLabel: "Verify digital badge ↗",
    accent: "#ff9900",
    date: "Jul 2026",
    tags: ['featured', 'aws', 'ai-ml']
  },
  {
    id: 'aws-educate-getting-started-with-serverless',
    title: "AWS Educate Getting Started with Serverless",
    issuer: "AWS Training & Certification",
    thumbnail: certAwsGettingStartedServerless,
    verifyUrl: "https://www.credly.com/badges/8e055149-b708-45ba-ac1a-3b85d3a89c6e/public_url",
    description: "Training badge covering foundational serverless concepts and AWS services",
    actionLabel: "Verify digital badge ↗",
    accent: "#ff9900",
    date: "Jul 2026",
    tags: ['featured', 'aws', 'cloud-data']
  },
  {
    id: 'aws-serverless-mindset',
    title: "Getting into the Serverless Mindset",
    issuer: "AWS Training & Certification",
    thumbnail: certAwsServerless,
    pdfUrl: "/Cert/AWS-Getting-into-the-Serverless-Mindset.pdf",
    description: "Completion certificate covering serverless principles and cloud-native thinking",
    actionLabel: "View completion certificate ↗",
    accent: "#ff9900",
    date: "Jul 2026",
    tags: ['aws', 'cloud-data']
  },
  {
    id: 'aws-building-front-door',
    title: "Episode 1: Building the Front Door",
    issuer: "AWS Training & Certification",
    thumbnail: certAwsBuildingFrontDoor,
    pdfUrl: "/Cert/AWS-Episode-1-Building-the-Front-Door.pdf",
    description: "AWS serverless learning path completion certificate",
    actionLabel: "View completion certificate ↗",
    accent: "#ff9900",
    date: "Jul 2026",
    tags: ['aws', 'cloud-data']
  },
  {
    id: 'aws-designing-event-driven-architectures',
    title: "Designing Event-Driven Architectures",
    issuer: "AWS Training & Certification",
    thumbnail: certAwsEventDriven,
    pdfUrl: "/Cert/AWS-Designing-Event-Driven-Architectures.pdf",
    description: "Event-driven architecture patterns, service decoupling and asynchronous workflows",
    actionLabel: "View completion certificate ↗",
    accent: "#ff9900",
    date: "Jul 2026",
    tags: ['aws', 'cloud-data', 'engineering']
  },
  {
    id: 'aws-introduction-to-lambda',
    title: "Introduction to AWS Lambda",
    issuer: "AWS Training & Certification",
    thumbnail: certAwsLambdaIntro,
    pdfUrl: "/Cert/AWS-Introduction-to-AWS-Lambda.pdf",
    description: "Introduction to event-driven compute and serverless function development",
    actionLabel: "View completion certificate ↗",
    accent: "#ff9900",
    date: "Jul 2026",
    tags: ['aws', 'cloud-data']
  },
  {
    id: 'aws-lambda-foundations',
    title: "AWS Lambda Foundations",
    issuer: "AWS Training & Certification",
    thumbnail: certAwsLambdaFoundations,
    pdfUrl: "/Cert/AWS-Lambda-Foundations.pdf",
    description: "Lambda configuration, invocation, permissions and operational foundations",
    actionLabel: "View completion certificate ↗",
    accent: "#ff9900",
    date: "Jul 2026",
    tags: ['aws', 'cloud-data', 'engineering']
  },
  {
    id: 'aws-scaling-serverless-architectures',
    title: "Scaling Serverless Architectures",
    issuer: "AWS Training & Certification",
    thumbnail: certAwsServerlessScaling,
    pdfUrl: "/Cert/AWS-Scaling-Serverless-Architectures.pdf",
    description: "Scaling patterns, concurrency and resilient serverless application design",
    actionLabel: "View completion certificate ↗",
    accent: "#ff9900",
    date: "Jul 2026",
    tags: ['aws', 'cloud-data', 'engineering']
  },
  {
    id: 'aws-serverless-security-observability',
    title: "Security and Observability for Serverless Applications",
    issuer: "AWS Training & Certification",
    thumbnail: certAwsServerlessSecurity,
    pdfUrl: "/Cert/AWS-Security-and-Observability-for-Serverless-Applications.pdf",
    description: "Security controls, monitoring and observability for serverless workloads",
    actionLabel: "View completion certificate ↗",
    accent: "#ff9900",
    date: "Jul 2026",
    tags: ['aws', 'cloud-data', 'engineering']
  },
  {
    id: 'aws-deploying-serverless-applications',
    title: "Deploying Serverless Applications",
    issuer: "AWS Training & Certification",
    thumbnail: certAwsServerlessDeploy,
    pdfUrl: "/Cert/AWS-Deploying-Serverless-Applications.pdf",
    description: "Deployment workflows and lifecycle practices for serverless applications",
    actionLabel: "View completion certificate ↗",
    accent: "#ff9900",
    date: "Jul 2026",
    tags: ['aws', 'cloud-data', 'engineering']
  },
  {
    id: 'aws-api-gateway-serverless',
    title: "Amazon API Gateway for Serverless Applications",
    issuer: "AWS Training & Certification",
    thumbnail: certAwsApiGateway,
    pdfUrl: "/Cert/AWS-Amazon-API-Gateway-for-Serverless-Applications.pdf",
    description: "API Gateway configuration and API integration for serverless backends",
    actionLabel: "View completion certificate ↗",
    accent: "#ff9900",
    date: "Jul 2026",
    tags: ['featured', 'aws', 'cloud-data', 'engineering']
  },
  {
    id: 'google-cloud-infrastructure-foundation',
    title: "Essential Google Cloud Infrastructure: Foundation",
    issuer: "Google Cloud Skills Boost",
    thumbnail: certGoogleCloudInfrastructure,
    verifyUrl: "https://www.skills.google/public_profiles/03bc8f46-a5c3-423f-8d12-f235d5da8486/badges/25783325",
    description: "Completion badge covering Compute Engine, Cloud Shell, VPC networking and infrastructure design",
    actionLabel: "Verify completion badge ↗",
    accent: "#4285f4",
    date: "Jul 2026",
    tags: ['featured', 'google-cloud', 'cloud-data']
  },
  {
    id: 'google-gen-ai-beyond-chatbot',
    title: "Gen AI: Beyond the Chatbot",
    issuer: "Google Cloud Skills",
    thumbnail: certGoogleGenAiChatbot,
    verifyUrl: "https://www.skills.google/public_profiles/03bc8f46-a5c3-423f-8d12-f235d5da8486/badges/25822351",
    description: "Foundation models, prompt engineering and organizational Gen AI strategy",
    accent: "#4285f4",
    date: "Jul 2026",
    tags: ['google-cloud', 'ai-ml']
  },
  {
    id: 'google-gen-ai-foundational-concepts',
    title: "Gen AI: Unlock Foundational Concepts",
    issuer: "Google Cloud Skills",
    thumbnail: certGoogleGenAiFoundations,
    verifyUrl: "https://www.skills.google/public_profiles/03bc8f46-a5c3-423f-8d12-f235d5da8486/badges/25822525",
    description: "Generative AI foundations, data types, responsible AI and model limitations",
    accent: "#4285f4",
    date: "Jul 2026",
    tags: ['google-cloud', 'ai-ml']
  },
  {
    id: 'google-gen-ai-landscape',
    title: "Gen AI: Navigate the Landscape",
    issuer: "Google Cloud Skills",
    thumbnail: certGoogleGenAiLandscape,
    verifyUrl: "https://www.skills.google/public_profiles/03bc8f46-a5c3-423f-8d12-f235d5da8486/badges/25823747",
    description: "Gen AI solution layers, Google Cloud offerings and solution selection",
    accent: "#4285f4",
    date: "Jul 2026",
    tags: ['google-cloud', 'ai-ml']
  },
  {
    id: 'google-gen-ai-apps',
    title: "Gen AI Apps: Transform Your Work",
    issuer: "Google Cloud Skills",
    thumbnail: certGoogleGenAiApps,
    verifyUrl: "https://www.skills.google/public_profiles/03bc8f46-a5c3-423f-8d12-f235d5da8486/badges/25823921",
    description: "Grounding, RAG, effective prompting and automated workflows with Google AI tools",
    accent: "#4285f4",
    date: "Jul 2026",
    tags: ['google-cloud', 'ai-ml']
  },
  {
    id: 'google-gen-ai-agents',
    title: "Gen AI Agents: Transform Your Organization",
    issuer: "Google Cloud Skills",
    thumbnail: certGoogleGenAiAgents,
    verifyUrl: "https://www.skills.google/public_profiles/03bc8f46-a5c3-423f-8d12-f235d5da8486/badges/25824035",
    description: "Hands-on agent foundations covering models, reasoning loops and tools",
    accent: "#4285f4",
    date: "Jul 2026",
    tags: ['featured', 'google-cloud', 'ai-ml', 'engineering']
  },
  {
    id: 'aip104',
    title: "Software Development Lifecycle (SDLC)",
    issuer: "AIAcademy by AIPOWER",
    thumbnail: certAip104,
    pdfUrl: "/Cert/AIPOWER-AIP104-SDLC.pdf",
    verifyUrl: "https://aiacademy.aipower.vn/certificates/e53aeb6b738a4a6eafb0c6edf9b2e912",
    credentialId: "E53AEB6B738A",
    accent: "#1fa85b",
    date: "Jul 2026",
    tags: ['featured', 'engineering']
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
    date: "Jul 2026",
    tags: ['featured', 'engineering']
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
    date: "Jul 2026",
    tags: ['engineering']
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
    date: "2025",
    tags: ['ai-ml', 'education']
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
    date: "Dec 2025",
    tags: ['featured', 'ai-ml', 'education']
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
    date: "Dec 2025",
    tags: ['ai-ml', 'education']
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
    date: "Dec 2025",
    tags: ['ai-ml', 'education']
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
    date: "Jul 2026",
    tags: ['engineering']
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
    date: "Jul 2026",
    tags: ['engineering']
  },
  {
    id: 'ech',
    title: "Volunteer Participation Certificate",
    issuer: "ECH - English Community House",
    thumbnail: certECH,
    verifyUrl: "https://ech.edu.vn/",
    description: "Certificate of volunteer participation at ECH",
    accent: "#e67e22",
    date: "2025",
    tags: ['education']
  }
];

const filters = [
  { id: 'featured', label: 'Highlights' },
  { id: 'aws', label: 'AWS' },
  { id: 'google-cloud', label: 'Google Cloud' },
  { id: 'cloud-data', label: 'Cloud & Data' },
  { id: 'ai-ml', label: 'AI & ML' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'education', label: 'Education' },
  { id: 'all', label: 'All' }
];

const tagLabels = {
  aws: 'AWS',
  'google-cloud': 'Google Cloud',
  'cloud-data': 'Cloud & Data',
  'ai-ml': 'AI & ML',
  engineering: 'Engineering',
  education: 'Education'
};

const Certifications = () => {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [activeFilter, setActiveFilter] = useState('featured');

  const visibleCertificates = activeFilter === 'all'
    ? certificates
    : certificates.filter((cert) => cert.tags.includes(activeFilter));

  const awsCount = certificates.filter((cert) => cert.tags.includes('aws')).length;
  const digitalBadgeCount = certificates.filter((cert) =>
    cert.verifyUrl?.includes('credly.com') || cert.verifyUrl?.includes('skills.google')
  ).length;

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
          <div className="certs-title-row">
            <h2 className="section-title">CERTIFICATIONS</h2>
            <div className="credential-profile-links">
              <a
                className="credly-profile-link"
                href="https://www.credly.com/users/xuanhai0913"
                target="_blank"
                rel="noopener noreferrer"
              >
                Credly ↗
              </a>
              <a
                className="credly-profile-link"
                href="https://www.skills.google/public_profiles/03bc8f46-a5c3-423f-8d12-f235d5da8486"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Skills ↗
              </a>
              <a
                className="credly-profile-link"
                href="https://g.dev/xuanhai0913"
                target="_blank"
                rel="noopener noreferrer"
              >
                g.dev ↗
              </a>
            </div>
          </div>
          <div className="certs-overview">
            <p className="certs-intro">
              Verified learning across cloud, backend engineering, data and applied AI.
              Filter the collection by the capability most relevant to your team.
            </p>
            <dl className="certs-stats" aria-label="Certification summary">
              <div><dt>{certificates.length}</dt><dd>Credentials</dd></div>
              <div><dt>{awsCount}</dt><dd>AWS</dd></div>
              <div><dt>{digitalBadgeCount}</dt><dd>Digital badges</dd></div>
            </dl>
          </div>
        </header>

        <div className="certs-filter-bar" aria-label="Filter certifications">
          {filters.map((filter) => {
            const count = filter.id === 'all'
              ? certificates.length
              : certificates.filter((cert) => cert.tags.includes(filter.id)).length;

            return (
              <button
                key={filter.id}
                type="button"
                className={`cert-filter ${activeFilter === filter.id ? 'is-active' : ''}`}
                aria-pressed={activeFilter === filter.id}
                onClick={() => setActiveFilter(filter.id)}
              >
                <span>{filter.label}</span>
                <span className="cert-filter-count">{count}</span>
              </button>
            );
          })}
        </div>

        <p className="certs-result-count" aria-live="polite">
          Showing {visibleCertificates.length} of {certificates.length} credentials
        </p>

        {/* Responsive Grid/Stack */}
        <div className="certs-grid">
          {visibleCertificates.map((cert, index) => (
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

                <div className="cert-tags" aria-label={`${cert.title} topics`}>
                  {cert.tags
                    .filter((tag) => tagLabels[tag])
                    .map((tag) => <span key={tag}>{tagLabels[tag]}</span>)}
                </div>

                <div className="cert-actions">
                  {cert.credentialId && (
                    <span className="credential-id">ID {cert.credentialId}</span>
                  )}
                  <a
                    className="cert-verify"
                    href={cert.verifyUrl || cert.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {cert.actionLabel || 'Verify credential ↗'}
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
