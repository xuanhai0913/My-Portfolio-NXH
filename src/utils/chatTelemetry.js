const BUFFER_KEY = '__NXH_ASSISTANT_EVENTS__';
const MAX_BUFFER_SIZE = 200;

function isBrowser() {
  return typeof window !== 'undefined';
}

export function trackChatEvent(eventName, payload = {}) {
  if (!eventName || !isBrowser()) return;

  try {
    const event = {
      event: eventName,
      timestamp: Date.now(),
      payload,
    };

    const existing = Array.isArray(window[BUFFER_KEY]) ? window[BUFFER_KEY] : [];
    const next = [...existing, event].slice(-MAX_BUFFER_SIZE);
    window[BUFFER_KEY] = next;

    if (typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent('nxh-assistant-event', { detail: event }));
    }
  } catch (error) {
    // Ignore telemetry errors to keep chat flow stable.
  }
}

export function getTrackedChatEvents() {
  if (!isBrowser()) return [];
  return Array.isArray(window[BUFFER_KEY]) ? window[BUFFER_KEY] : [];
}
