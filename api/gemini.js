const {
  buildPortfolioSystemPrompt,
  buildPortfolioUserMessage,
  normalizeLocale,
  normalizeResponseStyle,
} = require('./portfolio-context');

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

const DEFAULT_FALLBACK_MODELS = [
  'gemini-2.5-flash',
  'gemini-flash-latest',
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash',
  'gemini-2.5-pro',
];
const MAX_FALLBACK_MODELS = DEFAULT_FALLBACK_MODELS.length;

// A missing model is safe to retry with the next configured fallback. Other
// client errors (for example a malformed request) should stop immediately.
const FALLBACK_STATUSES = new Set([404, 429, 500, 502, 503, 504]);
function parsePositiveInteger(value, fallback, maximum = Number.MAX_SAFE_INTEGER) {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? Math.min(parsed, maximum) : fallback;
}

const MAX_MESSAGE_LENGTH = 2000;
const MAX_JOB_DESCRIPTION_LENGTH = 6000;
const MAX_HISTORY_MESSAGES = 16;
const MAX_HISTORY_MESSAGE_LENGTH = 1000;
const REQUEST_TIMEOUT_MS = parsePositiveInteger(process.env.GEMINI_REQUEST_TIMEOUT_MS, 25000, 60000);
const TOTAL_REQUEST_TIMEOUT_MS = parsePositiveInteger(process.env.GEMINI_TOTAL_REQUEST_TIMEOUT_MS, 50000, 55000);
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = parsePositiveInteger(process.env.GEMINI_RATE_LIMIT_MAX, 12, 120);
const MAX_RATE_LIMIT_CLIENTS = 2000;
const clientRequestTimes = new Map();
const STRUCTURED_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    answer: {
      type: 'STRING',
      description: 'Primary response in GitHub-flavored Markdown when formatting improves readability.',
    },
    highlights: { type: 'ARRAY', items: { type: 'STRING' } },
    links: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          label: { type: 'STRING' },
          url: { type: 'STRING' },
        },
      },
    },
    quickFacts: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          label: { type: 'STRING' },
          value: { type: 'STRING' },
        },
      },
    },
    insights: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING' },
          detail: { type: 'STRING' },
          priority: { type: 'STRING', enum: ['high', 'medium', 'low'] },
        },
      },
    },
    timeline: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          phase: { type: 'STRING' },
          detail: { type: 'STRING' },
        },
      },
    },
    skillsMatrix: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          skill: { type: 'STRING' },
          level: { type: 'STRING', enum: ['strong', 'medium', 'basic'] },
          evidence: { type: 'STRING' },
        },
      },
    },
    hrSummary: {
      type: 'OBJECT',
      properties: {
        fit: { type: 'STRING' },
        seniority: { type: 'STRING' },
        noticePeriod: { type: 'STRING' },
        salaryRange: { type: 'STRING' },
        workMode: { type: 'STRING' },
      },
    },
    riskFlags: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING' },
          detail: { type: 'STRING' },
          severity: { type: 'STRING', enum: ['high', 'medium', 'low'] },
        },
      },
    },
    interviewQuestions: { type: 'ARRAY', items: { type: 'STRING' } },
    nextActions: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          label: { type: 'STRING' },
          actionId: {
            type: 'STRING',
            enum: ['open_cv', 'open_linkedin', 'send_email', 'ask_fit'],
          },
          url: { type: 'STRING' },
          question: { type: 'STRING' },
        },
      },
    },
    fitSummary: {
      type: 'OBJECT',
      properties: {
        matchLevel: { type: 'STRING', enum: ['strong', 'medium', 'low', 'unknown'] },
        strongMatches: { type: 'ARRAY', items: { type: 'STRING' } },
        gaps: { type: 'ARRAY', items: { type: 'STRING' } },
        recommendation: { type: 'STRING' },
      },
    },
    suggestions: { type: 'ARRAY', items: { type: 'STRING' } },
  },
  required: ['answer'],
};

function resolveFallbackModels() {
  const raw = process.env.GEMINI_FALLBACK_MODELS;
  if (!raw || typeof raw !== 'string') return DEFAULT_FALLBACK_MODELS;

  const parsed = raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  return parsed.length ? parsed.slice(0, MAX_FALLBACK_MODELS) : DEFAULT_FALLBACK_MODELS;
}

function getHeaderValue(req, name) {
  const value = req?.headers?.[name];
  return Array.isArray(value) ? value[0] : value;
}

function normalizeOrigin(value) {
  if (typeof value !== 'string' || !value.trim()) return '';

  try {
    return new URL(value).origin;
  } catch (error) {
    return '';
  }
}

function getConfiguredOrigins() {
  const raw = process.env.GEMINI_ALLOWED_ORIGINS || process.env.GEMINI_ALLOWED_ORIGIN || '';
  return new Set(
    raw
      .split(',')
      .map((item) => normalizeOrigin(item))
      .filter(Boolean)
  );
}

function isLoopbackHost(host) {
  try {
    const hostname = new URL(`http://${host}`).hostname.toLowerCase();
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
  } catch (error) {
    return false;
  }
}

function getRequestOrigin(req) {
  const host = getHeaderValue(req, 'host');
  if (!host) return '';

  const forwardedProtocol = String(getHeaderValue(req, 'x-forwarded-proto') || '')
    .split(',')[0]
    .trim()
    .toLowerCase();
  const protocol = ['http', 'https'].includes(forwardedProtocol)
    ? forwardedProtocol
    : (isLoopbackHost(host) ? 'http' : 'https');
  return normalizeOrigin(`${protocol}://${host}`);
}

function appendVaryOrigin(res) {
  const current = typeof res.getHeader === 'function' ? res.getHeader('Vary') : '';
  const values = (Array.isArray(current) ? current.join(',') : String(current || ''))
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  if (!values.some((value) => value.toLowerCase() === 'origin')) values.push('Origin');
  res.setHeader('Vary', values.join(', '));
}

function allowCorsForRequest(req, res) {
  const origin = normalizeOrigin(getHeaderValue(req, 'origin'));
  if (!origin) return true;

  const isSameOrigin = origin === getRequestOrigin(req);
  const isExplicitlyAllowed = getConfiguredOrigins().has(origin);
  if (!isSameOrigin && !isExplicitlyAllowed) return false;

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  appendVaryOrigin(res);
  return true;
}

function getClientId(req) {
  const forwardedFor = String(getHeaderValue(req, 'x-forwarded-for') || '')
    .split(',')[0]
    .trim();
  const remoteAddress = req?.socket?.remoteAddress || 'anonymous';
  return (forwardedFor || remoteAddress || 'anonymous').slice(0, 128);
}

function takeRateLimitSlot(req) {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;

  for (const [clientId, timestamps] of clientRequestTimes) {
    const activeTimestamps = timestamps.filter((timestamp) => timestamp > cutoff);
    if (activeTimestamps.length) {
      clientRequestTimes.set(clientId, activeTimestamps);
    } else {
      clientRequestTimes.delete(clientId);
    }
  }

  const clientId = getClientId(req);
  const timestamps = clientRequestTimes.get(clientId) || [];
  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: Math.ceil((timestamps[0] + RATE_LIMIT_WINDOW_MS) / 1000),
      retryAfterSeconds: Math.max(1, Math.ceil((timestamps[0] + RATE_LIMIT_WINDOW_MS - now) / 1000)),
    };
  }

  timestamps.push(now);
  if (!clientRequestTimes.has(clientId) && clientRequestTimes.size >= MAX_RATE_LIMIT_CLIENTS) {
    const oldestClientId = clientRequestTimes.keys().next().value;
    if (oldestClientId) clientRequestTimes.delete(oldestClientId);
  }
  if (clientRequestTimes.has(clientId)) clientRequestTimes.delete(clientId);
  clientRequestTimes.set(clientId, timestamps);
  return {
    allowed: true,
    remaining: Math.max(0, RATE_LIMIT_MAX_REQUESTS - timestamps.length),
    resetAt: Math.ceil((timestamps[0] + RATE_LIMIT_WINDOW_MS) / 1000),
  };
}

function setRateLimitHeaders(res, rateLimit) {
  res.setHeader('X-RateLimit-Limit', String(RATE_LIMIT_MAX_REQUESTS));
  res.setHeader('X-RateLimit-Remaining', String(rateLimit.remaining));
  res.setHeader('X-RateLimit-Reset', String(rateLimit.resetAt));
}

function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter((item) => (
      item
      && typeof item.content === 'string'
      && (item.role === 'assistant' || item.role === 'user')
      && item.content.trim()
    ))
    .slice(-MAX_HISTORY_MESSAGES)
    .map((item) => ({
      role: item.role,
      content: item.content.trim().slice(0, MAX_HISTORY_MESSAGE_LENGTH),
    }));
}

async function callGeminiModel(model, apiKey, payload, timeoutMs = REQUEST_TIMEOUT_MS) {
  const url = `${GEMINI_API_BASE}/${model}:generateContent`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Math.max(1, timeoutMs));

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const data = await response.json().catch(() => ({}));

    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } finally {
    clearTimeout(timeout);
  }
}

function extractText(data) {
  const candidate = data?.candidates?.[0];
  const parts = candidate?.content?.parts;
  if (!Array.isArray(parts)) return '';
  return parts
    .map((part) => part?.text || '')
    .join('\n')
    .trim();
}

function stripMarkdownNoise(text) {
  if (!text) return '';
  return text
    .replace(/```json|```/gi, '')
    .replace(/\*\*/g, '')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/^#{1,6}\s*/gm, '')
    .trim();
}

function tryParseJson(text) {
  if (!text || typeof text !== 'string') return null;

  const cleaned = text.trim();
  try {
    return JSON.parse(cleaned);
  } catch (error) {
    // Continue with fallback extraction.
  }

  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    return JSON.parse(match[0]);
  } catch (error) {
    return null;
  }
}

function getFieldCaseInsensitive(obj, fieldName) {
  if (!obj || typeof obj !== 'object') return undefined;
  const target = String(fieldName || '').toLowerCase();
  const key = Object.keys(obj).find((item) => item.toLowerCase() === target);
  return key ? obj[key] : undefined;
}

function extractJsonStringField(text, fieldName) {
  const fieldPattern = new RegExp(`"(?:${fieldName})"\\s*:\\s*"`, 'i');
  const match = fieldPattern.exec(text);
  if (!match) return '';

  const start = match.index + match[0].length;
  let escaped = false;

  for (let index = start; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"' && !escaped) {
      const rawValue = text.slice(start, index);
      try {
        return JSON.parse(`"${rawValue}"`).trim();
      } catch (error) {
        return rawValue
          .replace(/\\"/g, '"')
          .replace(/\\n/g, '\n')
          .replace(/\\\\/g, '\\')
          .trim();
      }
    }
    escaped = char === '\\' && !escaped;
    if (char !== '\\') escaped = false;
  }

  return '';
}

function extractStructuredFromJsonLikeText(text) {
  if (!text || typeof text !== 'string') return null;

  const rawHighlights = [];
  const highlightRegex = /"(?:highlights|HIGHLIGHTS|Highlights)"\s*:\s*\[([\s\S]*?)\]/m;
  const highlightsMatch = text.match(highlightRegex);

  if (highlightsMatch?.[1]) {
    const itemRegex = /"([^"]+)"/g;
    let m;
    while ((m = itemRegex.exec(highlightsMatch[1])) !== null) {
      rawHighlights.push(m[1]);
    }
  }

  const answer = extractJsonStringField(text, 'answer');
  if (!answer && rawHighlights.length === 0) return null;

  return {
    answer,
    highlights: rawHighlights,
    links: [],
    quickFacts: [],
    insights: [],
    timeline: [],
    skillsMatrix: [],
    hrSummary: null,
    riskFlags: [],
    interviewQuestions: [],
    nextActions: [],
    fitSummary: null,
    suggestions: [],
  };
}

function buildReadableStructuredText(structuredResponse, isVietnamese) {
  if (!structuredResponse) return '';
  if (structuredResponse.answer) return structuredResponse.answer;

  if (structuredResponse.highlights?.length) {
    return structuredResponse.highlights.map((item) => `• ${item}`).join('\n');
  }

  if (structuredResponse.quickFacts?.length) {
    return structuredResponse.quickFacts
      .map((item) => `• ${item.label}: ${item.value}`)
      .join('\n');
  }

  if (structuredResponse.insights?.length) {
    return structuredResponse.insights
      .map((item) => `• ${item.title}${item.detail ? `: ${item.detail}` : ''}`)
      .join('\n');
  }

  return isVietnamese
    ? 'Mình chưa tạo được câu trả lời hoàn chỉnh. Bạn hãy thử hỏi lại ngắn gọn hơn.'
    : 'I could not build a complete answer. Please try a shorter version of the question.';
}

function normalizeStructuredResponse(parsed) {
  if (!parsed || typeof parsed !== 'object') return null;

  const answerRaw = getFieldCaseInsensitive(parsed, 'answer');
  const highlightsRaw = getFieldCaseInsensitive(parsed, 'highlights');
  const linksRaw = getFieldCaseInsensitive(parsed, 'links');
  const quickFactsRaw = getFieldCaseInsensitive(parsed, 'quickFacts');
  const insightsRaw = getFieldCaseInsensitive(parsed, 'insights');
  const timelineRaw = getFieldCaseInsensitive(parsed, 'timeline');
  const skillsMatrixRaw = getFieldCaseInsensitive(parsed, 'skillsMatrix');
  const hrSummaryRaw = getFieldCaseInsensitive(parsed, 'hrSummary');
  const riskFlagsRaw = getFieldCaseInsensitive(parsed, 'riskFlags');
  const interviewQuestionsRaw = getFieldCaseInsensitive(parsed, 'interviewQuestions');
  const nextActionsRaw = getFieldCaseInsensitive(parsed, 'nextActions');
  const fitSummaryRaw = getFieldCaseInsensitive(parsed, 'fitSummary');
  const suggestionsRaw = getFieldCaseInsensitive(parsed, 'suggestions');

  const answer = typeof answerRaw === 'string' ? answerRaw.trim() : '';
  const highlights = Array.isArray(highlightsRaw)
    ? highlightsRaw.filter((item) => typeof item === 'string' && item.trim())
    : [];

  const links = Array.isArray(linksRaw)
    ? linksRaw
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({
        label: typeof getFieldCaseInsensitive(item, 'label') === 'string'
          ? getFieldCaseInsensitive(item, 'label').trim()
          : 'Link',
        url: typeof getFieldCaseInsensitive(item, 'url') === 'string'
          ? getFieldCaseInsensitive(item, 'url').trim()
          : '',
      }))
      .filter((item) => /^https?:\/\//i.test(item.url))
    : [];

  const quickFacts = Array.isArray(quickFactsRaw)
    ? quickFactsRaw
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({
        label: typeof getFieldCaseInsensitive(item, 'label') === 'string'
          ? getFieldCaseInsensitive(item, 'label').trim()
          : '',
        value: typeof getFieldCaseInsensitive(item, 'value') === 'string'
          ? getFieldCaseInsensitive(item, 'value').trim()
          : '',
      }))
      .filter((item) => item.label && item.value)
      .slice(0, 8)
    : [];

  const insights = Array.isArray(insightsRaw)
    ? insightsRaw
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({
        title: typeof getFieldCaseInsensitive(item, 'title') === 'string'
          ? getFieldCaseInsensitive(item, 'title').trim()
          : '',
        detail: typeof getFieldCaseInsensitive(item, 'detail') === 'string'
          ? getFieldCaseInsensitive(item, 'detail').trim()
          : '',
        priority: typeof getFieldCaseInsensitive(item, 'priority') === 'string'
          ? getFieldCaseInsensitive(item, 'priority').trim().toLowerCase()
          : 'medium',
      }))
      .filter((item) => item.title || item.detail)
      .slice(0, 6)
    : [];

  const timeline = Array.isArray(timelineRaw)
    ? timelineRaw
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({
        phase: typeof getFieldCaseInsensitive(item, 'phase') === 'string'
          ? getFieldCaseInsensitive(item, 'phase').trim()
          : '',
        detail: typeof getFieldCaseInsensitive(item, 'detail') === 'string'
          ? getFieldCaseInsensitive(item, 'detail').trim()
          : '',
      }))
      .filter((item) => item.phase || item.detail)
      .slice(0, 6)
    : [];

  const skillsMatrix = Array.isArray(skillsMatrixRaw)
    ? skillsMatrixRaw
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({
        skill: typeof getFieldCaseInsensitive(item, 'skill') === 'string'
          ? getFieldCaseInsensitive(item, 'skill').trim()
          : '',
        level: typeof getFieldCaseInsensitive(item, 'level') === 'string'
          ? getFieldCaseInsensitive(item, 'level').trim().toLowerCase()
          : 'medium',
        evidence: typeof getFieldCaseInsensitive(item, 'evidence') === 'string'
          ? getFieldCaseInsensitive(item, 'evidence').trim()
          : '',
      }))
      .filter((item) => item.skill)
      .slice(0, 8)
    : [];

  const hrSummary = hrSummaryRaw && typeof hrSummaryRaw === 'object'
    ? {
      fit: typeof getFieldCaseInsensitive(hrSummaryRaw, 'fit') === 'string'
        ? getFieldCaseInsensitive(hrSummaryRaw, 'fit').trim()
        : '',
      seniority: typeof getFieldCaseInsensitive(hrSummaryRaw, 'seniority') === 'string'
        ? getFieldCaseInsensitive(hrSummaryRaw, 'seniority').trim()
        : '',
      noticePeriod: typeof getFieldCaseInsensitive(hrSummaryRaw, 'noticePeriod') === 'string'
        ? getFieldCaseInsensitive(hrSummaryRaw, 'noticePeriod').trim()
        : '',
      salaryRange: typeof getFieldCaseInsensitive(hrSummaryRaw, 'salaryRange') === 'string'
        ? getFieldCaseInsensitive(hrSummaryRaw, 'salaryRange').trim()
        : '',
      workMode: typeof getFieldCaseInsensitive(hrSummaryRaw, 'workMode') === 'string'
        ? getFieldCaseInsensitive(hrSummaryRaw, 'workMode').trim()
        : '',
    }
    : null;

  const riskFlags = Array.isArray(riskFlagsRaw)
    ? riskFlagsRaw
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({
        title: typeof getFieldCaseInsensitive(item, 'title') === 'string'
          ? getFieldCaseInsensitive(item, 'title').trim()
          : '',
        detail: typeof getFieldCaseInsensitive(item, 'detail') === 'string'
          ? getFieldCaseInsensitive(item, 'detail').trim()
          : '',
        severity: typeof getFieldCaseInsensitive(item, 'severity') === 'string'
          ? getFieldCaseInsensitive(item, 'severity').trim().toLowerCase()
          : 'medium',
      }))
      .filter((item) => item.title || item.detail)
      .slice(0, 6)
    : [];

  const interviewQuestions = Array.isArray(interviewQuestionsRaw)
    ? interviewQuestionsRaw
      .filter((item) => typeof item === 'string' && item.trim())
      .map((item) => item.trim())
      .slice(0, 6)
    : [];

  const nextActions = Array.isArray(nextActionsRaw)
    ? nextActionsRaw
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({
        label: typeof getFieldCaseInsensitive(item, 'label') === 'string'
          ? getFieldCaseInsensitive(item, 'label').trim()
          : '',
        actionId: typeof getFieldCaseInsensitive(item, 'actionId') === 'string'
          ? getFieldCaseInsensitive(item, 'actionId').trim().toLowerCase()
          : '',
        url: typeof getFieldCaseInsensitive(item, 'url') === 'string'
          ? getFieldCaseInsensitive(item, 'url').trim()
          : '',
        question: typeof getFieldCaseInsensitive(item, 'question') === 'string'
          ? getFieldCaseInsensitive(item, 'question').trim()
          : '',
      }))
      .filter((item) => item.label && (item.actionId || item.url || item.question))
      .slice(0, 5)
    : [];

  const fitSummary = fitSummaryRaw && typeof fitSummaryRaw === 'object'
    ? {
      matchLevel: typeof getFieldCaseInsensitive(fitSummaryRaw, 'matchLevel') === 'string'
        ? getFieldCaseInsensitive(fitSummaryRaw, 'matchLevel')
        : 'unknown',
      strongMatches: Array.isArray(getFieldCaseInsensitive(fitSummaryRaw, 'strongMatches'))
        ? getFieldCaseInsensitive(fitSummaryRaw, 'strongMatches').filter((item) => typeof item === 'string' && item.trim())
        : [],
      gaps: Array.isArray(getFieldCaseInsensitive(fitSummaryRaw, 'gaps'))
        ? getFieldCaseInsensitive(fitSummaryRaw, 'gaps').filter((item) => typeof item === 'string' && item.trim())
        : [],
      recommendation: typeof getFieldCaseInsensitive(fitSummaryRaw, 'recommendation') === 'string'
        ? getFieldCaseInsensitive(fitSummaryRaw, 'recommendation').trim()
        : '',
    }
    : null;

  const suggestions = Array.isArray(suggestionsRaw)
    ? suggestionsRaw
      .filter((item) => typeof item === 'string' && item.trim())
      .map((item) => item.trim())
      .slice(0, 4)
    : [];

  if (
    !answer
    && highlights.length === 0
    && links.length === 0
    && quickFacts.length === 0
    && insights.length === 0
    && timeline.length === 0
    && skillsMatrix.length === 0
    && !hrSummary
    && riskFlags.length === 0
    && interviewQuestions.length === 0
    && nextActions.length === 0
    && !fitSummary
    && suggestions.length === 0
  ) {
    return null;
  }

  return {
    answer,
    highlights,
    links,
    quickFacts,
    insights,
    timeline,
    skillsMatrix,
    hrSummary,
    riskFlags,
    interviewQuestions,
    nextActions,
    fitSummary,
    suggestions,
  };
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (!allowCorsForRequest(req, res)) {
    return res.status(403).json({
      success: false,
      errorType: 'origin_not_allowed',
      message: 'This origin is not allowed to use the portfolio assistant.',
    });
  }

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({
      success: false,
      errorType: 'method_not_allowed',
      message: 'Method not allowed',
    });
  }

  const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : null;
  if (!body) {
    return res.status(400).json({
      success: false,
      errorType: 'invalid_payload',
      message: 'Request body must be a JSON object.',
    });
  }

  const { message, history, jobDescription, locale, responseStyle } = body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({
      success: false,
      errorType: 'invalid_payload',
      message: 'message is required',
    });
  }

  const normalizedMessage = message.trim();
  if (normalizedMessage.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({
      success: false,
      errorType: 'message_too_long',
      message: `message must be ${MAX_MESSAGE_LENGTH} characters or fewer`,
    });
  }

  if (jobDescription !== undefined && typeof jobDescription !== 'string') {
    return res.status(400).json({
      success: false,
      errorType: 'invalid_payload',
      message: 'jobDescription must be a string when provided',
    });
  }

  const normalizedJobDescription = typeof jobDescription === 'string' ? jobDescription.trim() : '';
  if (normalizedJobDescription.length > MAX_JOB_DESCRIPTION_LENGTH) {
    return res.status(400).json({
      success: false,
      errorType: 'job_description_too_long',
      message: `jobDescription must be ${MAX_JOB_DESCRIPTION_LENGTH} characters or fewer`,
    });
  }

  const rateLimit = takeRateLimitSlot(req);
  setRateLimitHeaders(res, rateLimit);
  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds));
    return res.status(429).json({
      success: false,
      errorType: 'rate_limited',
      message: 'Too many requests. Please try again shortly.',
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      success: false,
      errorType: 'service_unavailable',
      message: 'The portfolio assistant is temporarily unavailable.',
    });
  }

  const sanitizedHistory = sanitizeHistory(history);
  const fallbackModels = resolveFallbackModels();
  const normalizedLocale = normalizeLocale(locale);
  const normalizedResponseStyle = normalizeResponseStyle(responseStyle);
  const hasJobDescription = Boolean(normalizedJobDescription);

  const payload = {
    systemInstruction: {
      parts: [{
        text: buildPortfolioSystemPrompt(
          normalizedLocale,
          hasJobDescription,
          normalizedResponseStyle
        ),
      }],
    },
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: buildPortfolioUserMessage(
              normalizedMessage,
              normalizedJobDescription,
              sanitizedHistory
            ),
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.35,
      maxOutputTokens: 3072,
      topP: 0.85,
      responseMimeType: 'application/json',
      responseSchema: STRUCTURED_RESPONSE_SCHEMA,
    },
  };

  const triedModels = [];
  const deadlineAt = Date.now() + TOTAL_REQUEST_TIMEOUT_MS;
  let requestTimedOut = false;
  const isVietnamese = normalizedLocale === 'vi';
  const unavailableMessage = isVietnamese
    ? 'Trợ lý hiện tạm thời không khả dụng. Vui lòng thử lại sau.'
    : 'The assistant is temporarily unavailable. Please try again later.';

  for (const model of fallbackModels) {
    const remainingMs = deadlineAt - Date.now();
    if (remainingMs <= 0) {
      requestTimedOut = true;
      break;
    }

    triedModels.push(model);
    try {
      const result = await callGeminiModel(
        model,
        apiKey,
        payload,
        Math.min(REQUEST_TIMEOUT_MS, remainingMs)
      );
      const responseText = extractText(result.data);
      const parsed = tryParseJson(responseText);
      const structuredResponse = normalizeStructuredResponse(parsed) || extractStructuredFromJsonLikeText(responseText);
      const fallbackText = stripMarkdownNoise(responseText);
      const looksLikeRawJson = /^\s*\{[\s\S]*$/m.test(fallbackText);
      const safeText = structuredResponse
        ? buildReadableStructuredText(structuredResponse, isVietnamese)
        : (looksLikeRawJson ? '' : fallbackText);

      if (result.ok && safeText) {
        return res.status(200).json({
          success: true,
          modelUsed: model,
          fallbackTried: triedModels.length - 1,
          responseText: safeText,
          structuredResponse,
        });
      }

      if (result.ok && looksLikeRawJson && !structuredResponse) {
        if (model !== fallbackModels[fallbackModels.length - 1]) continue;
        return res.status(502).json({
          success: false,
          errorType: 'invalid_structured_response',
          modelUsed: model,
          fallbackTried: triedModels.length - 1,
          message: unavailableMessage,
        });
      }

      if (result.ok && !responseText) {
        if (model === fallbackModels[fallbackModels.length - 1]) {
          return res.status(502).json({
            success: false,
            errorType: 'empty_model_response',
            modelUsed: model,
            fallbackTried: triedModels.length - 1,
            message: unavailableMessage,
          });
        }
        continue;
      }

      const blocked = !FALLBACK_STATUSES.has(result.status);
      if (blocked) {
        return res.status(502).json({
          success: false,
          errorType: 'upstream_error',
          modelUsed: model,
          fallbackTried: triedModels.length - 1,
          message: unavailableMessage,
        });
      }

      if (model === fallbackModels[fallbackModels.length - 1]) {
        return res.status(503).json({
          success: false,
          errorType: 'all_models_rejected',
          modelUsed: model,
          fallbackTried: triedModels.length - 1,
          message: unavailableMessage,
        });
      }
    } catch (error) {
      if (error?.name === 'AbortError') requestTimedOut = true;
      // Continue trying next model for transient failures without exposing provider details.
      if (model === fallbackModels[fallbackModels.length - 1]) {
        return res.status(requestTimedOut ? 504 : 502).json({
          success: false,
          errorType: requestTimedOut ? 'upstream_timeout' : 'upstream_error',
          modelUsed: model,
          fallbackTried: triedModels.length - 1,
          message: unavailableMessage,
        });
      }
    }
  }

  return res.status(requestTimedOut ? 504 : 503).json({
    success: false,
    errorType: requestTimedOut ? 'upstream_timeout' : 'all_models_unavailable',
    fallbackTried: triedModels.length,
    message: unavailableMessage,
  });
};
