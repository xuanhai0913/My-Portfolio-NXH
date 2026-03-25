import { EXTERNAL_URLS, WORK_EXPERIENCE } from './constants';

export const PROFILE_CONTEXT = {
  name: 'Nguyen Xuan Hai',
  title: 'Fullstack Developer',
  location: 'Ho Chi Minh City, Vietnam',
  website: EXTERNAL_URLS.PORTFOLIO,
  contacts: {
    email: 'xuanhai0913750452@gmail.com',
    phone: '+84 929 501 116',
    zalo: EXTERNAL_URLS.ZALO,
  },
  socials: {
    github: EXTERNAL_URLS.GITHUB,
    linkedin: EXTERNAL_URLS.LINKEDIN,
    facebook: EXTERNAL_URLS.FACEBOOK,
    zalo: EXTERNAL_URLS.ZALO,
  },
  cvUrl: `${EXTERNAL_URLS.PORTFOLIO}/CV_NguyenXuanHai.pdf`,
  skills: [
    'React.js',
    'Node.js',
    'ASP.NET Core',
    'SQL Server',
    'JavaScript',
    'TypeScript',
    'System Design',
    'API Integration',
  ],
  projects: [
    {
      name: 'Great Link Mai House',
      url: 'https://greatlinkmaihouse.com/',
      stack: ['ASP.NET Core', 'React 18', 'SignalR'],
    },
    {
      name: 'VN Media Hub',
      url: 'https://vnmediahub.com',
      stack: ['React 18', 'ASP.NET Core 8', 'Redis'],
    },
    {
      name: 'Vision Key AI',
      url: 'https://visionpremium.hailamdev.space',
      stack: ['Swift', 'Next.js', 'Gemini'],
    },
    {
      name: 'Portfolio Website',
      url: EXTERNAL_URLS.PORTFOLIO,
      stack: ['React', 'GSAP', 'CSS3'],
    },
  ],
  certifications: [
    'Gemini Certified Faculty (Google, 2025)',
    'Gemini Certified University Student (Google, 2024)',
    'Google AI for K12 Educators (2023)',
  ],
  experienceSummary: WORK_EXPERIENCE.map((item) => ({
    company: item.company,
    role: item.role,
    period: item.period,
    technologies: item.technologies,
  })),
};

export const WELCOME_MESSAGE =
  'Welcome to Nguyen Xuan Hai portfolio. You can ask me about CV, projects, experience, certifications, or contact links.';

export function buildPortfolioSystemPrompt() {
  return [
    'You are a portfolio assistant for Nguyen Xuan Hai, a Fullstack Developer.',
    'Use only provided portfolio context and avoid making up facts.',
    'Reply in Vietnamese when user writes Vietnamese; otherwise reply in English.',
    'Prefer concise, recruiter-friendly answers with bullet points when useful.',
    'When user asks for CV, social links, projects, experience, or certifications, provide direct and actionable answers.',
    `Context JSON: ${JSON.stringify(PROFILE_CONTEXT)}`,
  ].join('\n');
}
