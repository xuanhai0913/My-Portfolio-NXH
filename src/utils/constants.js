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
  GEMINI: '/api/gemini',
  EMAILJS_SERVICE: 'service_9y7spx3',
  EMAILJS_TEMPLATE: 'template_skc0rl8',
  EMAILJS_AUTOREPLY_TEMPLATE: 'template_gvdfitf',
  EMAILJS_PUBLIC_KEY: 'fwFRXPgW6BPI5iCRD',
};

// External URLs
export const EXTERNAL_URLS = {
  PORTFOLIO: 'https://my-portfolio-nxh.vercel.app',
  GITHUB: 'https://github.com/xuanhai0913',
  LINKEDIN: 'https://www.linkedin.com/in/xuanhai0913/',
  FACEBOOK: 'https://www.facebook.com/nguyenhai0913',
  ZALO: 'https://zalo.me/84929501116',
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
export const WORK_EXPERIENCE = [
  {
    company: 'Betodemy – Japanese Learning Platform',
    role: 'FULLSTACK DEVELOPER',
    period: 'Start: February 2026 | End: Present',
    description: 'Assigned to build and maintain product modules for Betodemy, a Japanese learning platform with student portals, teacher-led online classes, admin tools, and gamified practice. Developed interactive learning blocks, realtime classroom features, and multilingual content workflows across React/Vite frontend and NestJS/PostgreSQL backend in an Nx monorepo.',
    technologies: ['React 19', 'Vite', 'React Router', 'Tailwind CSS', 'HeroUI', 'NestJS', 'TypeORM', 'PostgreSQL', 'Redis', 'BullMQ', 'Socket.IO', 'PlateJS', 'SlateJS', 'Nx', 'pnpm', 'GitLab CI/CD'],
    logo: null,
    link: null
  },
  {
    company: 'AI Power – Automotive Dealership ERP',
    role: 'FULL-STACK DEVELOPER INTERN',
    period: 'Start: May 2026 | End: July 2026',
    description: 'Assigned to support an Odoo 18 ERP for automotive dealerships in Vietnam, covering sales, an 18-state after-sales service workflow, spare parts, warranty, and TT200 accounting. Implemented and adjusted business logic, QWeb/XML views, PDF reports, localization, Docker workflows, and GitLab CI tasks across 18 custom modules and 99+ Python files.',
    technologies: ['Python 3.12', 'Odoo 18', 'PostgreSQL', 'QWeb/XML', 'wkhtmltopdf', 'Docker', 'GitLab CI', 'gettext i18n'],
    logo: 'https://aipower.vn/images/logos/logo-vn.svg?ver=0.0.2',
    link: 'https://aipower.vn/vi'
  },
  {
    company: 'Great Link Mai House – Digital Publishing Platform',
    role: 'FULLSTACK DEVELOPER',
    period: 'Start: July 2025 | End: May 2026',
    description: 'Worked on a business publishing platform with a modern API/frontend architecture for media and B2B use cases. Built production-facing features around secure authentication, realtime updates, media handling, and third-party service integrations.',
    technologies: ['ASP.NET Core 8', 'React 18', 'SignalR', 'OpenAI API', 'SendGrid', 'Cloudinary', 'JWT', 'Google OAuth', 'SQL Server'],
    logo: 'https://res.cloudinary.com/dqdcqtu8m/image/upload/v1755441933/f7ce90e7-0068-4433-ab8f-32cab1067dc2.png',
    link: 'https://greatlinkmaihouse.com/'
  },
  {
    company: 'VN Media Hub (CMS & Media Platform)',
    role: 'FULLSTACK DEVELOPER',
    period: 'Start: October 2024 | End: January 2026',
    description: 'Assigned to build a CMS/media platform covering content management, authentication, moderation, SEO-friendly publishing, and automated PDF/report exports. Implemented React and ASP.NET Core features including auth flows, content workflows, cache layers, structured logging, and report generation.',
    technologies: ['React 18', 'Vite', 'ASP.NET Core 8', 'Entity Framework Core', 'SQL Server', 'JWT', 'Google OAuth2', 'Redis', 'Serilog', 'Docker', 'QuestPDF'],
    logo: 'https://res.cloudinary.com/dqdcqtu8m/image/upload/v1755441948/1b725dc6-8cdb-4da9-a6b9-b0bc2a34fb3b.png',
    link: 'https://vnmediahub.com/'
  }
];
