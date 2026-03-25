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

function buildUserMessage(systemPrompt, profileContext, userMessage) {
  const contextBlock = JSON.stringify(profileContext || {});
  return [
    systemPrompt || '',
    `Context: ${contextBlock}`,
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

  const { message, history, profileContext, systemPrompt } = req.body || {};

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
            text: buildUserMessage(systemPrompt, profileContext, message.slice(0, 2000)),
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.65,
      maxOutputTokens: 1024,
      topP: 0.9,
    },
  };

  const triedModels = [];

  for (const model of fallbackModels) {
    triedModels.push(model);
    try {
      const result = await callGeminiModel(model, apiKey, payload);
      const responseText = extractText(result.data);

      if (result.ok && responseText) {
        return res.status(200).json({
          success: true,
          modelUsed: model,
          fallbackTried: triedModels.length - 1,
          responseText,
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
