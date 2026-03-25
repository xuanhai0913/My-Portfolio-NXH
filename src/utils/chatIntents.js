import { PROFILE_CONTEXT } from './chatProfileContext';

const explicitCvIntent = /(cho toi xem cv|xem cv|gui cv|send cv|show( me)? (the )?cv|resume link|download cv)/i;

export function detectIntent(input) {
  const text = (input || '').trim();
  if (!text) return null;

  if (explicitCvIntent.test(text)) return 'show_cv';
  return null;
}

export function suggestionsByIntent(lang = 'en') {
  const vi = lang === 'vi';

  return vi
    ? [
        'Cho tôi xem CV',
        'Kỹ năng nào phù hợp vai trò Fullstack?',
        'Nếu tôi gửi JD thì độ phù hợp thế nào?',
      ]
    : [
        'Show me the CV',
        'Which skills best fit a Fullstack role?',
        'If I share a JD, can you evaluate job fit?',
      ];
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

    default:
      return null;
  }
}
