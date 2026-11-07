const seen = new Set();
/** Development-only warning, once per message. Silent in production builds. */
export function warnOnce(message) {
  if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production') return;
  if (seen.has(message)) return;
  seen.add(message);
  if (typeof console !== 'undefined') console.warn(`[y7-ui] ${message}`);
}
