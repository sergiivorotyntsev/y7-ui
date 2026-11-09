// The L1 status vocabulary (docs/ui-standards.md): one word per status, colour never the only signal,
// amber ("needs-you") always paired with the words of what to do.

// v0.1.2: the pipeline tones (one hue each, tokens/test/statusHues.test.mjs); progress and neutral kept for older callers
export const STATUS_TONES = ['received', 'listed', 'assigned', 'transit', 'checking', 'done', 'needs-you', 'blocked', 'cancelled', 'progress', 'neutral'];

export const isStatusTone = (t) => STATUS_TONES.includes(t);
export const needsActionWords = (t) => t === 'needs-you';

const hasWords = (v) => typeof v === 'string' ? v.trim().length > 0 : v != null && v !== false;

/** Returns a list of problems with a status element's props; empty when it satisfies L1. */
export function assertStatusProps({ tone, children, action }) {
  const problems = [];
  if (!isStatusTone(tone)) problems.push(`unknown status tone "${tone}"; use one of ${STATUS_TONES.join(', ')}`);
  if (!hasWords(children)) problems.push('a status needs words; colour is never the only signal (L1)');
  if (needsActionWords(tone) && !hasWords(action)) problems.push('amber "needs-you" needs the words of what to do (action prop) (L1)');
  return problems;
}
