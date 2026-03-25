import { useCallback, useEffect, useMemo, useState } from 'react';

const CHAT_SESSION_KEY = 'nxh_portfolio_chat_session_v1';
const CHAT_SESSION_SCHEMA_VERSION = 2;
const TTL_DAYS = 7;
const TTL_MS = TTL_DAYS * 24 * 60 * 60 * 1000;
const MAX_STORED_MESSAGES = 120;
const MAX_STORED_CHARACTERS = 120000;
const FALLBACK_STORED_MESSAGES = 40;

const now = () => Date.now();

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((item) => item && typeof item.content === 'string' && item.role)
    .map((item) => ({
      id: item.id || `${item.role}-${Math.random().toString(36).slice(2)}`,
      role: item.role,
      content: item.content,
      timestamp: item.timestamp || now(),
      action: item.action || null,
      modelUsed: item.modelUsed || null,
    }));
}

function boundedMessages(messages, maxMessages = MAX_STORED_MESSAGES, maxChars = MAX_STORED_CHARACTERS) {
  const trimmedByCount = normalizeMessages(messages).slice(-maxMessages);
  const bounded = [];
  let totalChars = 0;

  for (let index = trimmedByCount.length - 1; index >= 0; index -= 1) {
    const item = trimmedByCount[index];
    const nextChars = totalChars + item.content.length;
    if (nextChars > maxChars && bounded.length > 0) {
      break;
    }

    bounded.unshift(item);
    totalChars = nextChars;
  }

  return bounded;
}

function readSession() {
  try {
    const raw = localStorage.getItem(CHAT_SESSION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;

    const expiresAt = Number(parsed.expiresAt || 0);
    if (!expiresAt || expiresAt < now()) {
      localStorage.removeItem(CHAT_SESSION_KEY);
      return null;
    }

    return {
      schemaVersion: Number(parsed.schemaVersion || 1),
      messages: boundedMessages(parsed.messages),
      expiresAt,
      lastUpdatedAt: Number(parsed.lastUpdatedAt || now()),
    };
  } catch (error) {
    console.error('Failed to read chat session:', error);
    localStorage.removeItem(CHAT_SESSION_KEY);
    return null;
  }
}

function writeSession(messages) {
  const persist = (payload) => {
    try {
      localStorage.setItem(CHAT_SESSION_KEY, JSON.stringify(payload));
      return true;
    } catch (error) {
      console.error('Failed to save chat session:', error);
      return false;
    }
  };

  try {
    const normalized = boundedMessages(messages);
    const payload = {
      schemaVersion: CHAT_SESSION_SCHEMA_VERSION,
      messages: normalized,
      lastUpdatedAt: now(),
      expiresAt: now() + TTL_MS,
    };

    if (persist(payload)) {
      return payload;
    }

    const fallbackPayload = {
      ...payload,
      messages: normalized.slice(-FALLBACK_STORED_MESSAGES),
    };

    if (persist(fallbackPayload)) {
      return fallbackPayload;
    }

    localStorage.removeItem(CHAT_SESSION_KEY);
    return null;
  } catch (error) {
    console.error('Unexpected error while saving chat session:', error);
    return null;
  }
}

export default function useChatSession(initialMessages) {
  const [sessionState, setSessionState] = useState(() => {
    const restored = readSession();
    if (restored) return restored;

    const seeded = {
      schemaVersion: CHAT_SESSION_SCHEMA_VERSION,
      messages: boundedMessages(initialMessages),
      lastUpdatedAt: now(),
      expiresAt: now() + TTL_MS,
    };
    writeSession(seeded.messages);
    return seeded;
  });

  useEffect(() => {
    writeSession(sessionState.messages);
  }, [sessionState.messages]);

  const setMessages = useCallback((updater) => {
    setSessionState((prev) => {
      const nextMessages = typeof updater === 'function' ? updater(prev.messages) : updater;
      return {
        schemaVersion: CHAT_SESSION_SCHEMA_VERSION,
        messages: boundedMessages(nextMessages),
        lastUpdatedAt: now(),
        expiresAt: now() + TTL_MS,
      };
    });
  }, []);

  const clearSession = useCallback((seedMessages = []) => {
    const next = {
      schemaVersion: CHAT_SESSION_SCHEMA_VERSION,
      messages: boundedMessages(seedMessages),
      lastUpdatedAt: now(),
      expiresAt: now() + TTL_MS,
    };
    localStorage.removeItem(CHAT_SESSION_KEY);
    writeSession(next.messages);
    setSessionState(next);
  }, []);

  const meta = useMemo(() => ({
    expiresAt: sessionState.expiresAt,
    lastUpdatedAt: sessionState.lastUpdatedAt,
    ttlDays: TTL_DAYS,
  }), [sessionState.expiresAt, sessionState.lastUpdatedAt]);

  return {
    messages: sessionState.messages,
    setMessages,
    clearSession,
    meta,
  };
}
