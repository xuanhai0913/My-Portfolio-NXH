/**
 * Application Constants
 * Following technical standards: No magic numbers/strings
 */

// Social Platform Colors (Brand Guidelines)
export const SOCIAL_COLORS = {
  FACEBOOK: '#1877F2',
  TWITTER: '#1DA1F2',
  LINKEDIN: '#0A66C2',
  WHATSAPP: '#25D366',
  TELEGRAM: '#0088CC',
  PINTEREST: '#E60023',
  REDDIT: '#FF4500',
};

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: '#4a90e2',
  PRIMARY_DARK: '#357abd',
  BACKGROUND_OVERLAY: 'rgba(255, 255, 255, 0.08)',
  HOVER_FILL: 'rgba(74, 144, 226, 0.2)',
  TEXT_WHITE: '#FFFFFF',
  ERROR_RED: '#FF0000',
};

// Animation Durations (in ms)
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
};

// Breakpoints
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1440,
};

// API Endpoints
export const API = {
  VIEWS: '/api/views',
  EMAILJS_SERVICE: 'service_9y7spx3',
  EMAILJS_TEMPLATE: 'template_skc0rl8',
  EMAILJS_AUTOREPLY_TEMPLATE: 'template_gvdfitf',
  EMAILJS_PUBLIC_KEY: 'fwFRXPgW6BPI5iCRD',
};

// External URLs
export const EXTERNAL_URLS = {
  PORTFOLIO: 'https://www.hailamdev.space',
  GITHUB: 'https://github.com/xuanhai0913',
  LINKEDIN: 'https://www.linkedin.com/in/xuanhai0913/',
  FACEBOOK: 'https://www.facebook.com/nguyenhai0913',
  INSTAGRAM: 'https://www.instagram.com/nguyenhai091375',
  KOFI: 'https://ko-fi.com/xuanhai0913',
};

// Component Defaults
export const DEFAULTS = {
  SQUARE_SIZE_MOBILE: 25,
  SQUARE_SIZE_DESKTOP: 35,
  VIEW_COUNT_FALLBACK: 12693,
};

// Work Experience Data
// Work Experience Data
export const WORK_EXPERIENCE = [
  {
    company: 'ECH (English Community House) - Learning Management System',
    role: 'FULLSTACK DEVELOPER',
    period: 'October 2024 - Present',
    description: 'Built a comprehensive Learning Management System (LMS) with ASP.NET Core 8.0 and SQL Server. Implemented a Certificate Generation System using QuestPDF and integrated Cloudinary for media management. Developed secure authentication flows with Identity and JWT.',
    technologies: ['ASP.NET Core 8', 'Entity Framework', 'SQL Server', 'QuestPDF', 'Cloudinary', 'MailKit', 'Bootstrap 5'],
    logo: 'https://res.cloudinary.com/dqdcqtu8m/image/upload/v1755441982/8a7636ad-a18c-4c4d-9da4-cd2cad07f8c3.png',
    link: 'https://ech.edu.vn/'
  },
  {
    company: 'VN Media Hub (CMS & Media Platform)',
    role: 'FULLSTACK DEVELOPER',
    period: 'October 2024 - January 2026',
    description: 'Developed a high-performance Content Management System (CMS) and media platform using React 18 and ASP.NET Core 8 Web API. Implemented dual authentication (JWT + Google OAuth2), advanced content management, and automated reporting with QuestPDF.',
    technologies: ['React 18', 'Vite', 'ASP.NET Core 8', 'JWT', 'Google OAuth2', 'Redis', 'Serilog'],
    logo: 'https://res.cloudinary.com/dqdcqtu8m/image/upload/v1755441948/1b725dc6-8cdb-4da9-a6b9-b0bc2a34fb3b.png',
    link: 'https://vnmediahub.com/'
  },
  {
    company: 'Great Link Mai House – Digital Publishing Platform',
    role: 'FULLSTACK DEVELOPER',
    period: 'July 2025 - Present',
    description: 'Rebuilt the digital publishing platform with a modern architecture. Developed a robust API using ASP.NET Core 8.0 and a responsive React 18 frontend. Implemented real-time features, secure authentication, and integrated multiple third-party services.',
    technologies: ['ASP.NET Core 8', 'React 18', 'SignalR', 'OpenAI API', 'SendGrid', 'Cloudinary', 'JWT', 'Google OAuth', 'SQL Server'],
    logo: 'https://res.cloudinary.com/dqdcqtu8m/image/upload/v1755441933/f7ce90e7-0068-4433-ab8f-32cab1067dc2.png',
    link: 'https://greatlinkmaihouse.com/'
  },
  {
    company: 'B2B GoSell',
    role: 'FULLSTACK DEVELOPER',
    period: 'Coming Soon',
    description: 'Contributed to the development of the B2B e-commerce platform. (Please update with specific details about your role and achievements at B2B GoSell).',
    technologies: ['React', 'Redux', 'REST API', 'Agile/Scrum', 'Ant Design'],
    logo: 'https://res.cloudinary.com/dqdcqtu8m/image/upload/v1755442033/f29959fd-0bcb-4383-84e3-28696d85caf2.png',
    link: 'https://b2bgosell.com/'
  }
];
