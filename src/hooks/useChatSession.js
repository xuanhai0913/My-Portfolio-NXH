import { useCallback, useEffect, useMemo, useState } from 'react';

const CHAT_SESSION_KEY = 'nxh_portfolio_chat_session_v1';
const TTL_DAYS = 7;
const TTL_MS = TTL_DAYS * 24 * 60 * 60 * 1000;

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
      messages: normalizeMessages(parsed.messages),
      expiresAt,
      lastUpdatedAt: Number(parsed.lastUpdatedAt || now()),
    };
  } catch (error) {
    console.error('Failed to read chat session:', error);
    return null;
  }
}

function writeSession(messages) {
  try {
    const payload = {
      messages: normalizeMessages(messages),
      lastUpdatedAt: now(),
      expiresAt: now() + TTL_MS,
    };
    localStorage.setItem(CHAT_SESSION_KEY, JSON.stringify(payload));
    return payload;
  } catch (error) {
    console.error('Failed to save chat session:', error);
    return null;
  }
}

export default function useChatSession(initialMessages) {
  const [sessionState, setSessionState] = useState(() => {
    const restored = readSession();
    if (restored) return restored;

    const seeded = {
      messages: normalizeMessages(initialMessages),
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
        messages: normalizeMessages(nextMessages),
        lastUpdatedAt: now(),
        expiresAt: now() + TTL_MS,
      };
    });
  }, []);

  const clearSession = useCallback((seedMessages = []) => {
    const next = {
      messages: normalizeMessages(seedMessages),
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
