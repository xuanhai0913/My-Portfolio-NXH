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
    role: 'CORE FULLSTACK DEVELOPER',
    period: 'Start: February 2026 | End: Present',
    description: 'Worked as a core developer in a 5-person engineering team with Betodemy leadership from Japan. Built and fixed product modules for student portals, teacher-led online classes, admin tools, gamified practice, and multilingual learning content. Joined weekly product meetings and supported production operations through tracked issues, review notes, and CI/CD handoffs.',
    achievement: 'Shipped and stabilized production features across student, teacher, and admin workflows while making post-release defects traceable and easier to hand off.',
    technologies: ['React 19', 'Vite', 'React Router', 'Tailwind CSS', 'HeroUI', 'NestJS', 'TypeORM', 'PostgreSQL', 'Redis', 'BullMQ', 'Socket.IO', 'PlateJS', 'SlateJS', 'Nx', 'pnpm', 'GitLab CI/CD', 'Claude', 'Codex', 'AI Agents'],
    logo: null,
    link: null
  },
  {
    company: 'AI Power – Automotive Dealership ERP',
    role: 'ODOO ERP SUPPORT DEVELOPER INTERN',
    period: 'Start: May 2026 | End: July 2026',
    description: 'Supported an Odoo 18 ERP for automotive dealerships in Vietnam, covering sales, an 18-state after-sales service workflow, spare parts, warranty, and TT200 accounting. Handled fixes and enhancements after BA/customer discussions across business logic, QWeb/XML views, PDF reports, localization, Docker workflows, and GitLab CI.',
    achievement: 'Resolved BA/customer-reported defects across 18 custom modules and 99+ Python files, helping keep complex service workflows and localized reports aligned with dealership operations.',
    technologies: ['Python 3.12', 'Odoo 18', 'PostgreSQL', 'QWeb/XML', 'wkhtmltopdf', 'Docker', 'GitLab CI', 'gettext i18n'],
    logo: 'https://aipower.vn/images/logos/logo-vn.svg?ver=0.0.2',
    link: 'https://aipower.vn/vi'
  },
  {
    company: 'Great Link Mai House – Digital Publishing Platform',
    role: 'MAIN FULLSTACK DEVELOPER / BA-FACING OWNER',
    period: 'Start: July 2025 | End: January 2026',
    description: 'Owned the main delivery flow for a WordPress-to-React/ASP.NET Core conversion, covering requirement clarification, solution direction, implementation, and release handoff. Built the platform end-to-end across React, ASP.NET Core APIs, SQL Server, authentication, realtime updates, media handling, and integrations.',
    achievement: 'Rebuilt legacy publishing workflows as one maintainable full-stack platform and translated BA/business decisions directly into production-ready frontend, API, and database changes.',
    technologies: ['ASP.NET Core 8', 'React 18', 'SignalR', 'OpenAI API', 'SendGrid', 'Cloudinary', 'JWT', 'Google OAuth', 'SQL Server'],
    logo: 'https://res.cloudinary.com/dqdcqtu8m/image/upload/v1755441933/f7ce90e7-0068-4433-ab8f-32cab1067dc2.png',
    link: 'https://greatlinkmaihouse.com/'
  },
  {
    company: 'VN Media Hub (CMS & Media Platform)',
    role: 'MAIN FULLSTACK DEVELOPER / BA-FACING OWNER',
    period: 'Start: October 2024 | End: January 2026',
    description: 'Led the main build and WordPress-to-React/ASP.NET Core conversion for a CMS/media platform, from requirement clarification to production-ready delivery. Implemented content management, authentication, moderation, SEO publishing, caching, structured logging, and automated PDF/report exports.',
    achievement: 'Delivered a production CMS that centralized publishing and reporting workflows while adding the caching, observability, and SEO foundations needed for reliable day-to-day operations.',
    technologies: ['React 18', 'Vite', 'ASP.NET Core 8', 'Entity Framework Core', 'SQL Server', 'JWT', 'Google OAuth2', 'Redis', 'Serilog', 'Docker', 'QuestPDF'],
    logo: 'https://res.cloudinary.com/dqdcqtu8m/image/upload/v1755441948/1b725dc6-8cdb-4da9-a6b9-b0bc2a34fb3b.png',
    link: 'https://vnmediahub.com/'
  }
];
