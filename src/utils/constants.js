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
    role: 'FULL-STACK DEVELOPER',
    period: 'Feb 2026 – Present',
    description: 'Work in a 5-developer product team with Betodemy leadership in Japan. Build and maintain student portals, instructor-led online classes, admin tools, gamified practice, and multilingual learning content. Join weekly product meetings, document defects as issues, review code, and support releases after deployment.',
    achievement: 'Delivered 70+ merged MRs and closed 70+ authored issues across document-editor, online-class, and student/admin workflows.',
    technologies: ['React 19', 'Vite', 'React Router', 'Tailwind CSS', 'HeroUI', 'NestJS', 'TypeORM', 'PostgreSQL', 'Redis', 'BullMQ', 'Socket.IO', 'PlateJS', 'SlateJS', 'Nx', 'pnpm', 'GitLab CI/CD', 'Claude', 'Codex', 'AI Agents'],
    logo: null,
    link: 'https://betodemy.com/'
  },
  {
    company: 'AI Power – Automotive Dealership ERP',
    role: 'ODOO ERP DEVELOPER INTERN',
    period: 'May 2026 – Jul 2026',
    description: 'Supported an Odoo 18 ERP for automotive dealerships in Vietnam, covering sales, an 18-state after-sales service workflow, spare parts, warranty, and TT200 accounting. Turned requirements gathered by the BA team into fixes and enhancements across business logic, QWeb/XML views, PDF reports, localization, Docker workflows, and GitLab CI.',
    achievement: 'Supported debugging and fixes across all 18 custom modules and 99+ Python files while preserving the 18-state after-sales service workflow.',
    technologies: ['Python 3.12', 'Odoo 18', 'PostgreSQL', 'QWeb/XML', 'wkhtmltopdf', 'Docker', 'GitLab CI', 'gettext i18n'],
    logo: 'https://aipower.vn/images/logos/logo-vn.svg?ver=0.0.2',
    link: 'https://aipower.vn/vi'
  },
  {
    company: 'OakMind Group – Three Production Web Products',
    role: 'FULL-STACK DEVELOPER · BUSINESS ANALYSIS',
    period: 'Oct 2024 – Jan 2026',
    description: 'Handled full-stack development and business analysis across three live OakMind Group products. VN Media Hub covered CMS authentication, moderation, caching, logging, SEO, and reporting. Great Link Mai House moved legacy WordPress/ASP.NET MVC workflows to React and ASP.NET Core. The OakMind Group website added CMS administration, bilingual content, analytics, video, and Cloudflare R2 media.',
    achievement: 'Took all three products from requirement clarification through release; delivered the live OakMind Group website in 28 authored commits.',
    technologies: ['C#', 'ASP.NET Core 8', 'ASP.NET MVC', 'Entity Framework Core', 'React 18/19', 'SQL Server', 'Redis', 'Serilog', 'JWT', 'SignalR', 'Cloudflare R2'],
    logo: 'https://res.cloudinary.com/dqdcqtu8m/image/upload/v1755441948/1b725dc6-8cdb-4da9-a6b9-b0bc2a34fb3b.png',
    link: 'https://oakmindgroup.com/'
  }
];
