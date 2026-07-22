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
  cvUrl: `${EXTERNAL_URLS.PORTFOLIO}/CV_NguyenXuanHai_visual.pdf`,
  skills: [
    'React.js',
    'Node.js',
    'ASP.NET Core',
    'Python 3.12',
    'Odoo 18',
    'PostgreSQL',
    'SQL Server',
    'JavaScript',
    'TypeScript',
    'System Design',
    'API Integration',
    'AI agent workflow setup',
    'Claude / Codex / Antigravity',
    'AI-assisted code review and CI/CD',
  ],
  projects: [
    {
      name: 'OakMind Group Corporate Platform',
      url: 'https://oakmindgroup.com/',
      stack: ['React 19', 'ASP.NET Core 8', 'SQL Server', 'Cloudflare R2'],
      achievement: 'Shipped a live corporate CMS/admin with bilingual content, SEO/analytics, video, and R2 media workflows in 28 authored commits.',
    },
    {
      name: 'Great Link Mai House',
      url: 'https://greatlinkmaihouse.com/',
      stack: ['ASP.NET Core', 'React 18', 'SignalR'],
      achievement: 'Rebuilt legacy WordPress publishing workflows as a maintainable React and ASP.NET Core platform with end-to-end delivery ownership.',
    },
    {
      name: 'VN Media Hub',
      url: 'https://vnmediahub.com',
      stack: ['React 18', 'ASP.NET Core 8', 'Redis'],
      achievement: 'Delivered a production CMS that centralized publishing and reporting workflows with caching, structured logging, SEO, and PDF exports.',
    },
    {
      name: 'ChongScam - Trust Platform',
      url: 'https://chongscam.vn/',
      stack: ['React 19', 'NestJS 11', 'PostgreSQL', 'Jest'],
      achievement: 'Delivered a client-operated production platform spanning 22 controllers, 20 SQL migrations, and 12 Jest/e2e test suites.',
    },
    {
      name: 'RouteLab - Shortest Path Lab',
      url: 'https://tsp-delivery-route-optimizer.vercel.app/',
      stack: ['React', 'TypeScript', 'Express', 'Vitest'],
      achievement: 'Implemented four shortest-path solvers, replay visualization, automated tests, and backend algorithm CI.',
    },
    {
      name: 'AgriTrace - Blockchain Traceability',
      url: 'https://github.com/xuanhai0913/agri-traceability-system',
      stack: ['React', 'Express', 'PostgreSQL', 'Solidity', 'IPFS'],
      achievement: 'Built multi-role supply-chain workflows with hybrid on-chain/off-chain evidence and QR verification.',
    },
  ],
  aiWorkflowSummary: [
    'Sets up project-specific AI context, rules and reusable skills for each tech stack.',
    'Uses Claude, Codex and Antigravity-style agents to support planning, code review, automation and CI/CD handoff.',
    'Applies AI pragmatically for issue analysis, documentation, QA support and operations without replacing engineering judgment.',
  ],
  certifications: [
    'AWS Cloud Practitioner Essentials - Completion Certificate (AWS Training & Certification, Jul 2026)',
    'AWS Educate Introduction to Generative AI - Training Badge (AWS Training & Certification, Jul 2026; verified via Credly)',
    'Getting into the Serverless Mindset - Completion Certificate (AWS Training & Certification, Jul 2026)',
    'Software Development Lifecycle (AIAcademy by AIPOWER, Jul 2026)',
    'Information Security Awareness (AIAcademy by AIPOWER, Jul 2026)',
    'Customer Communication & Professional Workplace Practices (AIAcademy by AIPOWER, Jul 2026)',
    'Gemini Certified Faculty (Google, 2025)',
    'Gemini Certified University Student (Google for Education, Dec 2025)',
    'Google AI for K12 Educators (Google for Education, Dec 2025)',
  ],
  languages: [
    'English: B1.4 (intermediate; technical reading and written communication)',
  ],
  experienceSummary: WORK_EXPERIENCE.map((item) => ({
    company: item.company,
    role: item.role,
    period: item.period,
    description: item.description,
    achievement: item.achievement,
    technologies: item.technologies,
  })),
};

export const WELCOME_MESSAGE =
  'Welcome to Nguyen Xuan Hai portfolio. You can ask me about CV, projects, experience, certifications, or contact links.';

export function buildPortfolioSystemPrompt(preferredLanguage = 'en', hasJobDescription = false, responseStyle = 'brief') {
  const languageRule = preferredLanguage === 'vi'
    ? 'Always reply in Vietnamese unless the user explicitly asks to switch language.'
    : 'Always reply in English unless the user explicitly asks to switch language.';

  const jdRule = hasJobDescription
    ? 'A recruiter provided a Job Description. If asked about fit, evaluate candidly with: strong matches, partial matches, gaps, and a short recommendation.'
    : 'If user asks about job fit and no Job Description is provided, ask them to upload or paste JD first.';

  const styleRuleMap = {
    brief: 'Keep answers concise: 3-5 lines maximum unless user asks for more detail.',
    detailed: 'Provide detailed answers with clear sections and practical examples from portfolio context.',
    fit: 'Prioritize job-fit analysis and highlight strengths, gaps, and recommendations.',
  };

  const styleRule = styleRuleMap[responseStyle] || styleRuleMap.brief;

  return [
    'You are a portfolio assistant for Nguyen Xuan Hai, a Fullstack Developer.',
    'Use only provided portfolio context and avoid making up facts.',
    languageRule,
    'Prefer concise, recruiter-friendly answers with bullet points when useful.',
    'Use natural sentence case and professional tone. Avoid all-caps formatting.',
    styleRule,
    jdRule,
    'When user asks for CV, social links, projects, experience, or certifications, provide direct and actionable answers.',
    'Return STRICT JSON only (no markdown, no code fence) with this schema:',
    '{"answer":"string","highlights":["string"],"links":[{"label":"string","url":"https://..."}],"quickFacts":[{"label":"string","value":"string"}],"insights":[{"title":"string","detail":"string","priority":"high|medium|low"}],"timeline":[{"phase":"string","detail":"string"}],"skillsMatrix":[{"skill":"string","level":"strong|medium|basic","evidence":"string"}],"hrSummary":{"fit":"string","seniority":"string","noticePeriod":"string","salaryRange":"string","workMode":"string"},"riskFlags":[{"title":"string","detail":"string","severity":"high|medium|low"}],"interviewQuestions":["string"],"nextActions":[{"label":"string","actionId":"open_cv|open_linkedin|send_email|ask_fit","url":"https://...","question":"string"}],"fitSummary":{"matchLevel":"strong|medium|low|unknown","strongMatches":["string"],"gaps":["string"],"recommendation":"string"},"suggestions":["string"]}',
    'If any field is not applicable, return an empty array or null for that field.',
    'For recruiter-oriented prompts, prioritize quickFacts, hrSummary, skillsMatrix, and riskFlags for readability.',
    'The `suggestions` field must include 2-4 short follow-up questions based on the latest conversation context.',
    `Context JSON: ${JSON.stringify(PROFILE_CONTEXT)}`,
  ].join('\n');
}
