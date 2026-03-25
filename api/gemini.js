const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

const DEFAULT_FALLBACK_MODELS = [
  'gemini-2.5-flash',
  'gemini-flash-latest',
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash',
  'gemini-2.5-pro',
];

const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);

function resolveFallbackModels() {
  const raw = process.env.GEMINI_FALLBACK_MODELS;
  if (!raw || typeof raw !== 'string') return DEFAULT_FALLBACK_MODELS;

  const parsed = raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  return parsed.length ? parsed : DEFAULT_FALLBACK_MODELS;
}

function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter((item) => item && typeof item.content === 'string' && typeof item.role === 'string')
    .slice(-20)
    .map((item) => ({
      role: item.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: item.content.slice(0, 1500) }],
    }));
}

function buildUserMessage(systemPrompt, profileContext, userMessage, jobDescription) {
  const contextBlock = JSON.stringify(profileContext || {});
  const jdBlock = typeof jobDescription === 'string' && jobDescription.trim()
    ? `Job Description: ${jobDescription.trim().slice(0, 6000)}`
    : 'Job Description: (not provided)';

  return [
    systemPrompt || '',
    `Context: ${contextBlock}`,
    jdBlock,
    `User question: ${userMessage}`,
  ].join('\n\n');
}

async function callGeminiModel(model, apiKey, payload) {
  const url = `${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
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

function extractStructuredFromJsonLikeText(text) {
  if (!text || typeof text !== 'string') return null;

  const answerMatch = text.match(/"(?:answer|ANSWER|Answer)"\s*:\s*"([\s\S]*?)"\s*,/);
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

  const answer = answerMatch?.[1]?.trim() || '';
  if (!answer && rawHighlights.length === 0) return null;

  return {
    answer,
    highlights: rawHighlights,
    links: [],
    fitSummary: null,
    suggestions: [],
  };
}

function normalizeStructuredResponse(parsed) {
  if (!parsed || typeof parsed !== 'object') return null;

  const answerRaw = getFieldCaseInsensitive(parsed, 'answer');
  const highlightsRaw = getFieldCaseInsensitive(parsed, 'highlights');
  const linksRaw = getFieldCaseInsensitive(parsed, 'links');
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

  if (!answer && highlights.length === 0 && links.length === 0 && !fitSummary && suggestions.length === 0) {
    return null;
  }

  return {
    answer,
    highlights,
    links,
    fitSummary,
    suggestions,
  };
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.GEMINI_ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      errorType: 'method_not_allowed',
      message: 'Method not allowed',
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      success: false,
      errorType: 'missing_api_key',
      message: 'Gemini API key is not configured.',
    });
  }

  const { message, history, profileContext, systemPrompt, jobDescription } = req.body || {};

  if (!message || typeof message !== 'string') {
    return res.status(400).json({
      success: false,
      errorType: 'invalid_payload',
      message: 'message is required',
    });
  }

  const sanitizedHistory = sanitizeHistory(history);
  const fallbackModels = resolveFallbackModels();

  const payload = {
    contents: [
      ...sanitizedHistory,
      {
        role: 'user',
        parts: [
          {
            text: buildUserMessage(systemPrompt, profileContext, message.slice(0, 2000), jobDescription),
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.65,
      maxOutputTokens: 1024,
      topP: 0.9,
      responseMimeType: 'application/json',
    },
  };

  const triedModels = [];

  for (const model of fallbackModels) {
    triedModels.push(model);
    try {
      const result = await callGeminiModel(model, apiKey, payload);
      const responseText = extractText(result.data);
      const parsed = tryParseJson(responseText);
      const structuredResponse = normalizeStructuredResponse(parsed) || extractStructuredFromJsonLikeText(responseText);
      const fallbackText = stripMarkdownNoise(responseText);
      const looksLikeRawJson = /^\s*\{[\s\S]*$/m.test(fallbackText);
      const safeText = structuredResponse?.answer
        || (looksLikeRawJson ? 'The response format was incomplete. Please try regenerate.' : fallbackText);

      if (result.ok && safeText) {
        return res.status(200).json({
          success: true,
          modelUsed: model,
          fallbackTried: triedModels.length - 1,
          responseText: safeText,
          structuredResponse,
        });
      }

      if (result.ok && !responseText) {
        if (model === fallbackModels[fallbackModels.length - 1]) {
          return res.status(502).json({
            success: false,
            errorType: 'empty_model_response',
            modelUsed: model,
            fallbackTried: triedModels.length - 1,
            message: 'Model returned an empty response.',
          });
        }
        continue;
      }

      const blocked = !RETRYABLE_STATUSES.has(result.status);
      if (blocked) {
        return res.status(result.status || 400).json({
          success: false,
          errorType: 'gemini_error',
          modelUsed: model,
          fallbackTried: triedModels.length - 1,
          message: result.data?.error?.message || 'Gemini request failed',
        });
      }

      if (model === fallbackModels[fallbackModels.length - 1]) {
        return res.status(result.status || 503).json({
          success: false,
          errorType: 'all_models_rejected',
          modelUsed: model,
          fallbackTried: triedModels.length - 1,
          message: result.data?.error?.message || 'All fallback models failed.',
        });
      }
    } catch (error) {
      // Continue trying next model for transient failures.
      if (model === fallbackModels[fallbackModels.length - 1]) {
        return res.status(500).json({
          success: false,
          errorType: 'gemini_exception',
          modelUsed: model,
          fallbackTried: triedModels.length - 1,
          message: error.message || 'Unexpected Gemini error',
        });
      }
    }
  }

  return res.status(503).json({
    success: false,
    errorType: 'all_models_unavailable',
    fallbackTried: triedModels.length,
    message: 'All configured Gemini models are currently unavailable. Please try again later.',
  });
};
