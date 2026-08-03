import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import enCertifications from '../../i18n/locales/en/certifications.json';
import viCertifications from '../../i18n/locales/vi/certifications.json';
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
import certAwsCloudEssentialsBadge from '../../images/certs/cert-aws-cloud-essentials-badge.png';
import certAwsDmsOverview from '../../images/certs/cert-aws-database-migration-service-overview.png';
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
import certAwsEventsWorkflowsBadge from '../../images/certs/cert-aws-events-workflows-badge.png';
import certAwsServerlessKnowledgeBadge from '../../images/certs/cert-aws-serverless-knowledge-badge.png';
import certAwsEpisode2Backend from '../../images/certs/cert-aws-episode-2-powering-backend.png';
import certAwsAmplify from '../../images/certs/cert-aws-amplify-getting-started.png';
import certAwsAipDomain1 from '../../images/certs/cert-aws-aip-c01-domain-1-review.png';
import certAwsAifDomain2 from '../../images/certs/cert-aws-aif-c01-domain-2-review.png';
import certAwsAifPracticeSet from '../../images/certs/cert-aws-aif-c01-official-practice-question-set.png';
import certAwsAifDomain3 from '../../images/certs/cert-aws-aif-c01-domain-3-review.png';
import certAwsGenAiExecutives from '../../images/certs/cert-aws-generative-ai-for-executives.png';
import certAwsPlanningMl from '../../images/certs/cert-aws-planning-machine-learning-project.png';
import certAwsVectorGraph from '../../images/certs/cert-aws-vectordb-vs-graphdb-agents.png';
import certGoogleCloudInfrastructure from '../../images/certs/cert-google-cloud-infrastructure-foundation.png';
import certGoogleGenAiChatbot from '../../images/certs/cert-google-gen-ai-chatbot.png';
import certGoogleGenAiFoundations from '../../images/certs/cert-google-gen-ai-foundations.png';
import certGoogleGenAiLandscape from '../../images/certs/cert-google-gen-ai-landscape.png';
import certGoogleGenAiApps from '../../images/certs/cert-google-gen-ai-apps.png';
import certGoogleGenAiAgents from '../../images/certs/cert-google-gen-ai-agents.png';

i18n.addResourceBundle('en', 'certifications', enCertifications, true, true);
i18n.addResourceBundle('vi', 'certifications', viCertifications, true, true);

// Certificate data
const certificates = [
  {
    id: 'aws-knowledge-cloud-essentials',
    title: "AWS Knowledge: Cloud Essentials",
    issuer: "AWS Training & Certification",
    thumbnail: certAwsCloudEssentialsBadge,
    verifyUrl: "https://www.credly.com/badges/1146b467-7e68-4c92-9f36-83ad6858df10/public_url",
    description: "Verified knowledge of core AWS Cloud concepts, services, security and architecture",
    actionLabel: "Verify training badge ↗",
    accent: "#ff9900",
    date: "Jul 2026",
    tags: ['featured', 'aws', 'cloud-data']
  },
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
    id: 'aws-database-migration-service-overview',
    title: "AWS Database Migration Service Overview",
    issuer: "AWS Training & Certification",
    thumbnail: certAwsDmsOverview,
    pdfUrl: "/Cert/AWS-Database-Migration-Service-Overview.pdf",
    verifyUrl: "https://skillsprofile.skillbuilder.aws/user/xuanhai0913",
    description: "AWS DMS fundamentals for planning, configuring and monitoring heterogeneous database migrations",
    actionLabel: "Verify credential ↗",
    accent: "#ff9900",
    date: "Jul 2026",
    tags: ['featured', 'aws', 'cloud-data', 'engineering']
  },
  {
    id: 'aws-knowledge-events-workflows',
    title: "AWS Knowledge: Events and Workflows",
    issuer: "AWS Training & Certification",
    thumbnail: certAwsEventsWorkflowsBadge,
    pdfUrl: "/Cert/AWS-Events-and-Workflows-Knowledge-Badge-Assessment.pdf",
    verifyUrl: "https://www.credly.com/badges/7ec9cba5-c356-4f45-8692-95809e2f3e2a/public_url",
    description: "Verified knowledge of Step Functions, EventBridge, SQS, SNS and event-driven serverless architectures",
    actionLabel: "Verify training badge ↗",
    accent: "#ff9900",
    date: "Jul 2026",
    tags: ['featured', 'aws', 'cloud-data', 'engineering']
  },
  {
    id: 'aws-knowledge-serverless',
    title: "AWS Knowledge: Serverless",
    issuer: "AWS Training & Certification",
    thumbnail: certAwsServerlessKnowledgeBadge,
    pdfUrl: "/Cert/AWS-Serverless-Knowledge-Badge-Assessment.pdf",
    verifyUrl: "https://www.credly.com/badges/6b334133-b6df-424e-a3ac-a46894d520ee/public_url",
    description: "Verified technical knowledge of AWS Lambda, Amazon API Gateway and serverless application patterns",
    actionLabel: "Verify training badge ↗",
    accent: "#ff9900",
    date: "Jul 2026",
    tags: ['featured', 'aws', 'cloud-data', 'engineering']
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
    id: 'aws-episode-2-powering-backend',
    title: "Episode 2: Powering the Backend",
    issuer: "AWS Training & Certification",
    thumbnail: certAwsEpisode2Backend,
    pdfUrl: "/Cert/AWS-Episode-2-Powering-the-Backend.pdf",
    description: "Completion certificate covering backend services in an AWS serverless application",
    actionLabel: "View completion certificate ↗",
    accent: "#ff9900",
    date: "Jul 2026",
    tags: ['aws', 'cloud-data', 'engineering']
  },
  {
    id: 'aws-amplify-getting-started',
    title: "AWS Amplify Getting Started",
    issuer: "AWS Training & Certification",
    thumbnail: certAwsAmplify,
    pdfUrl: "/Cert/AWS-Amplify-Getting-Started.pdf",
    description: "Completion certificate covering application delivery and hosting with AWS Amplify",
    actionLabel: "View completion certificate ↗",
    accent: "#ff9900",
    date: "Jul 2026",
    tags: ['aws', 'cloud-data', 'engineering']
  },
  {
    id: 'aws-aip-c01-domain-1-review',
    title: "AIP-C01 Domain 1 Review",
    issuer: "AWS Training & Certification",
    thumbnail: certAwsAipDomain1,
    pdfUrl: "/Cert/AWS-AIP-C01-Domain-1-Review.pdf",
    description: "Course completion for Domain 1 of the AWS Certified Generative AI Developer - Professional exam guide",
    actionLabel: "View course certificate ↗",
    accent: "#ff9900",
    date: "Jul 2026",
    tags: ['aws', 'ai-ml']
  },
  {
    id: 'aws-aif-c01-domain-2-review',
    title: "AIF-C01 Domain 2 Review",
    issuer: "AWS Training & Certification",
    thumbnail: certAwsAifDomain2,
    pdfUrl: "/Cert/AWS-AIF-C01-Domain-2-Review.pdf",
    description: "Course completion for Domain 2 of the AWS Certified AI Practitioner exam guide",
    actionLabel: "View course certificate ↗",
    accent: "#ff9900",
    date: "Jul 2026",
    tags: ['aws', 'ai-ml']
  },
  {
    id: 'aws-aif-c01-official-practice-question-set',
    title: "AIF-C01 Official Practice Question Set",
    issuer: "AWS Training & Certification",
    thumbnail: certAwsAifPracticeSet,
    pdfUrl: "/Cert/AWS-AIF-C01-Official-Practice-Question-Set.pdf",
    description: "Official practice-question preparation for the AWS Certified AI Practitioner exam",
    actionLabel: "View course certificate ↗",
    accent: "#ff9900",
    date: "Jul 2026",
    tags: ['featured', 'aws', 'ai-ml']
  },
  {
    id: 'aws-aif-c01-domain-3-review',
    title: "AIF-C01 Domain 3 Review",
    issuer: "AWS Training & Certification",
    thumbnail: certAwsAifDomain3,
    pdfUrl: "/Cert/AWS-AIF-C01-Domain-3-Review.pdf",
    description: "Course completion for Domain 3 of the AWS Certified AI Practitioner exam guide",
    actionLabel: "View course certificate ↗",
    accent: "#ff9900",
    date: "Jul 2026",
    tags: ['aws', 'ai-ml']
  },
  {
    id: 'aws-generative-ai-for-executives',
    title: "Generative AI for Executives",
    issuer: "AWS Training & Certification",
    thumbnail: certAwsGenAiExecutives,
    pdfUrl: "/Cert/AWS-Generative-AI-for-Executives.pdf",
    description: "Business-focused foundations for identifying and governing generative AI opportunities",
    actionLabel: "View completion certificate ↗",
    accent: "#ff9900",
    date: "Jul 2026",
    tags: ['aws', 'ai-ml']
  },
  {
    id: 'aws-planning-machine-learning-project',
    title: "Planning a Machine Learning Project",
    issuer: "AWS Training & Certification",
    thumbnail: certAwsPlanningMl,
    pdfUrl: "/Cert/AWS-Planning-a-Machine-Learning-Project.pdf",
    description: "Practical foundations for defining ML problems, data requirements, metrics and delivery plans",
    actionLabel: "View completion certificate ↗",
    accent: "#ff9900",
    date: "Jul 2026",
    tags: ['featured', 'aws', 'ai-ml', 'engineering']
  },
  {
    id: 'aws-vectordb-vs-graphdb-agents',
    title: "VectorDB vs GraphDB for Gen AI Agents",
    issuer: "AWS Training & Certification",
    thumbnail: certAwsVectorGraph,
    pdfUrl: "/Cert/AWS-VectorDB-vs-GraphDB-for-Gen-AI-Agents.pdf",
    description: "Completion certificate comparing vector and graph data stores for agentic AI use cases",
    actionLabel: "View completion certificate ↗",
    accent: "#ff9900",
    date: "Jul 2026",
    tags: ['aws', 'ai-ml', 'cloud-data', 'engineering']
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
  'featured',
  'aws',
  'google-cloud',
  'cloud-data',
  'ai-ml',
  'engineering',
  'education',
  'all'
];

const CertFilterIcon = ({ type }) => {
  const paths = {
    featured: <path d="m12 3 2.6 5.3 5.9.9-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.9L12 3Z" />,
    aws: <path d="M4 7h16M6 7v10h12V7M9 11h6M9 14h4" />,
    'google-cloud': (
      <>
        <path d="M7.5 18H18a3 3 0 0 0 .6-5.9A6 6 0 0 0 7.2 10 4 4 0 0 0 7.5 18Z" />
        <path d="M8 18h8" />
      </>
    ),
    'cloud-data': (
      <>
        <ellipse cx="12" cy="6" rx="7" ry="3" />
        <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
      </>
    ),
    'ai-ml': (
      <>
        <rect x="5" y="5" width="14" height="14" rx="3" />
        <path d="M9 10h.01M15 10h.01M9 15c1.8 1.3 4.2 1.3 6 0M12 2v3M2 12h3M19 12h3" />
      </>
    ),
    engineering: (
      <>
        <path d="m14 5 5 5-9 9H5v-5l9-9Z" />
        <path d="m12 7 5 5M4 20h16" />
      </>
    ),
    education: (
      <>
        <path d="m3 9 9-5 9 5-9 5-9-5Z" />
        <path d="M7 12v5c3 2 7 2 10 0v-5M21 9v6" />
      </>
    ),
    all: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    )
  };

  return (
    <svg className="cert-filter-icon" viewBox="0 0 24 24" aria-hidden="true">
      {paths[type] || paths.all}
    </svg>
  );
};

const monthIndexes = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11
};

const formatCertificateDate = (date, locale) => {
  const match = date.match(/^(?:([A-Z][a-z]{2}) )?(\d{4})$/);
  if (!match) return date;

  const [, month, year] = match;
  const value = new Date(Date.UTC(Number(year), month ? monthIndexes[month] : 0, 1));

  return new Intl.DateTimeFormat(locale, month
    ? { month: 'short', year: 'numeric', timeZone: 'UTC' }
    : { year: 'numeric', timeZone: 'UTC' }
  ).format(value);
};

const getActionKey = (cert) => {
  if (!cert.actionLabel) return 'actions.verifyCredential';
  if (cert.id === 'aws-database-migration-service-overview') return 'actions.verifyCredential';
  if (cert.id.startsWith('aws-aip-c01-') || cert.id.startsWith('aws-aif-c01-')) {
    return 'actions.viewCourseCertificate';
  }
  if (cert.id.startsWith('aws-knowledge-')) return 'actions.verifyTrainingBadge';
  if (cert.id.startsWith('aws-educate-')) return 'actions.verifyDigitalBadge';
  if (cert.id === 'google-cloud-infrastructure-foundation') return 'actions.verifyCompletionBadge';
  if (cert.pdfUrl) return 'actions.viewCompletionCertificate';
  return 'actions.verifyCredential';
};

const Certifications = () => {
  const { t, i18n: translationInstance } = useTranslation('certifications');
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [activeFilter, setActiveFilter] = useState('featured');
  const [isExpanded, setIsExpanded] = useState(false);
  const [collapsedLimit, setCollapsedLimit] = useState(6);

  const filteredCertificates = activeFilter === 'all'
    ? certificates
    : certificates.filter((cert) => cert.tags.includes(activeFilter));
  const visibleCertificates = isExpanded
    ? filteredCertificates
    : filteredCertificates.slice(0, collapsedLimit);

  const awsCount = certificates.filter((cert) => cert.tags.includes('aws')).length;
  const digitalBadgeCount = certificates.filter((cert) =>
    cert.verifyUrl?.includes('credly.com') || cert.verifyUrl?.includes('skills.google')
  ).length;
  const locale = translationInstance.resolvedLanguage === 'vi' ? 'vi-VN' : 'en-US';

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

  useEffect(() => {
    const updateLimit = () => {
      if (window.matchMedia('(min-width: 1024px)').matches) {
        setCollapsedLimit(6);
      } else if (window.matchMedia('(min-width: 768px)').matches) {
        setCollapsedLimit(4);
      } else {
        setCollapsedLimit(2);
      }
    };

    updateLimit();
    window.addEventListener('resize', updateLimit);
    return () => window.removeEventListener('resize', updateLimit);
  }, []);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setIsExpanded(false);
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
            <span className="deco-text">{t('eyebrow')}</span>
          </div>
          <div className="certs-title-row">
            <h2 className="section-title">{t('title')}</h2>
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
                href="https://skillsprofile.skillbuilder.aws/user/xuanhai0913"
                target="_blank"
                rel="noopener noreferrer"
              >
                AWS Skill Builder ↗
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
              {t('intro')}
            </p>
            <dl className="certs-stats" aria-label={t('aria.summary')}>
              <div><dt>{certificates.length}</dt><dd>{t('stats.credentials')}</dd></div>
              <div><dt>{awsCount}</dt><dd>{t('stats.aws')}</dd></div>
              <div><dt>{digitalBadgeCount}</dt><dd>{t('stats.digitalBadges')}</dd></div>
            </dl>
          </div>
        </header>

        <div className="certs-filter-bar" role="group" aria-label={t('aria.filters')}>
          {filters.map((filter) => {
            const count = filter === 'all'
              ? certificates.length
              : certificates.filter((cert) => cert.tags.includes(filter)).length;

            return (
              <button
                key={filter}
                type="button"
                className={`cert-filter ${activeFilter === filter ? 'is-active' : ''}`}
                aria-pressed={activeFilter === filter}
                onClick={() => handleFilterChange(filter)}
              >
                <CertFilterIcon type={filter} />
                <span>{t(`filters.${filter}`)}</span>
                <span className="cert-filter-count">{count}</span>
              </button>
            );
          })}
        </div>

        <p className="certs-result-count" aria-live="polite">
          {t('resultCount', {
            visible: visibleCertificates.length,
            total: filteredCertificates.length
          })}
        </p>

        {/* Responsive Grid/Stack */}
        <div className="certs-grid">
          {visibleCertificates.map((cert, index) => (
            <article
              key={cert.id}
              className={`cert-item ${inView ? 'in-view' : ''}`}
              style={{ transitionDelay: `${Math.min(index, 6) * 0.06}s` }}
            >
              <div className="cert-inner">
                <a
                  className="cert-thumb"
                  href={cert.pdfUrl || cert.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t(cert.pdfUrl ? 'aria.viewCertificate' : 'aria.verifyCertificate', {
                    title: cert.title
                  })}
                >
                  <img
                    src={cert.thumbnail}
                    alt={cert.title}
                    loading="lazy"
                    decoding="async"
                    width="1200"
                    height="675"
                  />
                  <div className="view-overlay">
                    <span>{t(cert.pdfUrl ? 'actions.viewPdf' : 'actions.verify')}</span>
                  </div>
                </a>

                <div className="cert-meta">
                  <span className="cert-issuer" style={{ color: cert.accent }}>
                    {cert.issuer}
                  </span>
                  <span className="cert-date">{formatCertificateDate(cert.date, locale)}</span>
                </div>

                <h3 className="cert-title">{cert.title}</h3>

                <p className="cert-description">
                  {t(`certificates.${cert.id}.description`, {
                    defaultValue: t('fallbackDescription', { issuer: cert.issuer })
                  })}
                </p>

                <div className="cert-tags" aria-label={t('aria.topics', { title: cert.title })}>
                  {cert.tags
                    .filter((tag) => tag !== 'featured')
                    .map((tag) => <span key={tag}>{t(`filters.${tag}`)}</span>)}
                </div>

                <div className="cert-actions">
                  {cert.credentialId && (
                    <span className="credential-id">
                      {t('credentialId', { id: cert.credentialId })}
                    </span>
                  )}
                  <a
                    className="cert-verify"
                    href={cert.verifyUrl || cert.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t(getActionKey(cert))}
                  </a>
                </div>
              </div>

              {/* Corner Accents */}
              <div className="corner top-left"></div>
              <div className="corner bottom-right"></div>
            </article>
          ))}
        </div>

        {filteredCertificates.length > collapsedLimit && (
          <div className="certs-disclosure">
            <button
              type="button"
              className="certs-disclosure-button"
              aria-expanded={isExpanded}
              onClick={() => setIsExpanded((current) => !current)}
            >
              <span>{t(isExpanded ? 'actions.showLess' : 'actions.showMore')}</span>
              <span aria-hidden="true">{isExpanded ? '↑' : '↓'}</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default Certifications;
