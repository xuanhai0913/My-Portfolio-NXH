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
