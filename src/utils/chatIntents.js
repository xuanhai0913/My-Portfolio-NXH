import { PROFILE_CONTEXT } from './chatProfileContext';

const cvKeywords = /(\bcv\b|resume|ho so|hồ sơ|xem cv|download cv)/i;
const projectKeywords = /(project|du an|dự án|portfolio work|san pham|sản phẩm)/i;
const experienceKeywords = /(experience|kinh nghiem|kinh nghiệm|work history|lam viec|làm việc)/i;
const certKeywords = /(cert|certificate|chung chi|chứng chỉ|credential)/i;
const socialKeywords = /(linkedin|facebook|github|zalo|contact link|social)/i;

export function detectIntent(input) {
  const text = (input || '').trim();
  if (!text) return null;

  if (cvKeywords.test(text)) return 'show_cv';
  if (socialKeywords.test(text)) return 'show_socials';
  if (projectKeywords.test(text)) return 'show_projects';
  if (experienceKeywords.test(text)) return 'show_experience';
  if (certKeywords.test(text)) return 'show_certifications';
  return null;
}

export function suggestionsByIntent(intent, lang = 'en') {
  const vi = lang === 'vi';

  const base = vi
    ? [
        'Cho toi xem CV',
        'Kinh nghiem gan day la gi?',
        'Du an AI noi bat nao?',
        'Gui link LinkedIn va Facebook',
      ]
    : [
        'Show me the CV',
        'What recent experience is most relevant?',
        'Which AI project is highlighted?',
        'Share LinkedIn and Facebook links',
      ];

  if (!intent) return base;

  const map = {
    show_cv: vi
      ? ['Tom tat kinh nghiem phu hop HR', 'Ky nang chinh cua anh Hai la gi?', 'Cho toi link LinkedIn']
      : ['Summarize strongest experience for HR', 'What are his core technical skills?', 'Share LinkedIn link'],
    show_socials: vi
      ? ['Cho toi xem CV', 'Du an tieu bieu nao gan day?', 'Co the lien he qua email khong?']
      : ['Can I see the CV?', 'Which project is most representative?', 'What is the best contact channel?'],
    show_projects: vi
      ? ['Du an nao dung AI?', 'Vai tro cua anh Hai trong du an la gi?', 'Cho toi thong tin lien he nhanh']
      : ['Which project uses AI?', 'What was his role in those projects?', 'Share quick contact info'],
    show_experience: vi
      ? ['Tom tat cong nghe da dung', 'Cho toi xem du an tieu bieu', 'Cho toi link CV']
      : ['Summarize technology stack used', 'Show representative projects', 'Send CV link'],
    show_certifications: vi
      ? ['Chung chi nao lien quan AI?', 'Cho toi CV', 'Cho toi link lien he']
      : ['Which certifications are AI-related?', 'Show CV', 'Share contact links'],
  };

  return map[intent] || base;
}

export function buildIntentResponse(intent, preferredLanguage = 'en') {
  const vi = preferredLanguage === 'vi';

  switch (intent) {
    case 'show_cv':
      return {
        text: vi
          ? `Ban co the xem CV tai day: ${PROFILE_CONTEXT.cvUrl}`
          : `You can view the CV here: ${PROFILE_CONTEXT.cvUrl}`,
        action: {
          type: 'cv',
          title: vi ? 'CV Nguyen Xuan Hai' : 'Nguyen Xuan Hai CV',
          url: PROFILE_CONTEXT.cvUrl,
          buttonLabel: vi ? 'Mo CV' : 'Open CV',
        },
      };

    case 'show_socials':
      return {
        text: vi
          ? 'Day la cac kenh lien he nhanh cua Nguyen Xuan Hai.'
          : 'Here are quick contact links for Nguyen Xuan Hai.',
        action: {
          type: 'links',
          links: [
            { label: 'LinkedIn', url: PROFILE_CONTEXT.socials.linkedin },
            { label: 'Facebook', url: PROFILE_CONTEXT.socials.facebook },
            { label: 'GitHub', url: PROFILE_CONTEXT.socials.github },
            { label: 'Zalo', url: PROFILE_CONTEXT.socials.zalo },
          ],
        },
      };

    case 'show_projects':
      return {
        text: vi
          ? 'Mot so du an tieu bieu ma anh Hai da trien khai:'
          : 'Some representative projects delivered by Hai:',
        action: {
          type: 'projects',
          items: PROFILE_CONTEXT.projects.map((item) => ({
            title: item.name,
            url: item.url,
            subtitle: item.stack.join(' - '),
          })),
        },
      };

    case 'show_experience':
      return {
        text: vi
          ? 'Tom tat kinh nghiem gan day cua Nguyen Xuan Hai:'
          : 'Recent experience summary for Nguyen Xuan Hai:',
        action: {
          type: 'experience',
          items: PROFILE_CONTEXT.experienceSummary.slice(0, 4).map((item) => ({
            title: item.company,
            subtitle: `${item.role} | ${item.period}`,
            detail: item.technologies.slice(0, 4).join(', '),
          })),
        },
      };

    case 'show_certifications':
      return {
        text: vi
          ? 'Cac chung chi noi bat lien quan cong nghe va AI:'
          : 'Highlighted certifications related to technology and AI:',
        action: {
          type: 'certifications',
          items: PROFILE_CONTEXT.certifications.map((title) => ({ title })),
        },
      };

    default:
      return null;
  }
}
