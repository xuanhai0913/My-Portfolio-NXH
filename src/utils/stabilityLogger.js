const DEBUG_KEY = 'ui_stability_debug';

const isDebugEnabled = () => {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(DEBUG_KEY) === '1';
  } catch {
    return false;
  }
};

export const logStabilityEvent = (scope, event, payload = {}) => {
  if (!isDebugEnabled()) return;

  const timestamp = new Date().toISOString();
  // Temporary release-cycle logging for stability verification.
  console.info('[ui-stability]', { timestamp, scope, event, ...payload });
};

export const STABILITY_DEBUG_KEY = DEBUG_KEY;
