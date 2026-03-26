const SUPPORTED_ACTION_IDS = new Set(['open_cv', 'open_linkedin', 'send_email', 'ask_fit']);

function sanitizeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function buildDefaultNextActions(language = 'en', options = {}) {
  const isVi = language === 'vi';
  const hasJobDescription = Boolean(options.hasJobDescription);

  const fitQuestion = hasJobDescription
    ? (isVi
      ? 'Đánh giá mức độ phù hợp với JD hiện tại.'
      : 'Evaluate fit against the current job description.')
    : (isVi
      ? 'Hãy hướng dẫn tôi upload JD để đánh giá độ phù hợp.'
      : 'Guide me to upload a JD for fit evaluation.');

  return [
    {
      label: isVi ? 'Mở CV' : 'Open CV',
      actionId: 'open_cv',
    },
    {
      label: isVi ? 'Mở LinkedIn' : 'Open LinkedIn',
      actionId: 'open_linkedin',
    },
    {
      label: isVi ? 'Soạn email nhanh' : 'Draft email',
      actionId: 'send_email',
    },
    {
      label: isVi ? 'Đánh giá fit ngay' : 'Ask fit now',
      actionId: 'ask_fit',
      question: fitQuestion,
    },
  ];
}

export function normalizeNextActions(actions) {
  if (!Array.isArray(actions)) return [];

  return actions
    .filter((item) => item && typeof item === 'object')
    .map((item) => ({
      label: sanitizeString(item.label),
      actionId: sanitizeString(item.actionId).toLowerCase(),
      question: sanitizeString(item.question),
      url: sanitizeString(item.url),
    }))
    .filter((item) => {
      const hasSupportedAction = item.actionId && SUPPORTED_ACTION_IDS.has(item.actionId);
      const hasFallbackAction = Boolean(item.question || /^https?:\/\//i.test(item.url));
      return item.label && (hasSupportedAction || hasFallbackAction);
    })
    .slice(0, 6);
}

export function ensureStructuredActionDefaults(action, options = {}) {
  if (!action || action.type !== 'rich') return action;

  const normalized = normalizeNextActions(action.nextActions);
  return {
    ...action,
    nextActions: normalized.length > 0
      ? normalized
      : buildDefaultNextActions(options.language || 'en', {
        hasJobDescription: Boolean(options.hasJobDescription),
      }),
  };
}

export function resolveStructuredAction(item, options = {}) {
  const language = options.language === 'vi' ? 'vi' : 'en';
  const hasJobDescription = Boolean(options.hasJobDescription);
  const actionId = sanitizeString(item?.actionId).toLowerCase();
  const question = sanitizeString(item?.question);
  const url = sanitizeString(item?.url);

  if (actionId === 'open_cv') {
    return { type: 'open_cv' };
  }

  if (actionId === 'open_linkedin') {
    return { type: 'open_linkedin' };
  }

  if (actionId === 'send_email') {
    return { type: 'send_email' };
  }

  if (actionId === 'ask_fit') {
    if (hasJobDescription) {
      return {
        type: 'question',
        question: question || (language === 'vi'
          ? 'Đánh giá mức độ phù hợp với JD hiện tại.'
          : 'Evaluate fit against the current job description.'),
      };
    }

    return {
      type: 'question',
      question: language === 'vi'
        ? 'Mình chưa có JD. Bạn có thể upload file JD (.txt/.md) hoặc dán JD để mình đánh giá độ phù hợp.'
        : 'I do not have a JD yet. Please upload a JD file (.txt/.md) or paste it so I can evaluate fit.',
    };
  }

  if (question) {
    return { type: 'question', question };
  }

  if (/^https?:\/\//i.test(url)) {
    return { type: 'url', url };
  }

  return {
    type: 'none',
    message: language === 'vi'
      ? 'Không có hành động khả dụng cho mục này.'
      : 'No available action for this item.',
  };
}
