// Pure formatting for the DateRange control. No React, no DOM: runs in node --test.
// Dates are plain { year, month (1-12), day } objects (what @internationalized/date's CalendarDate exposes).

export const SUPPORTED_LOCALES = ['en', 'pl', 'uk', 'ru'];

const TAGS = { en: 'en-US', pl: 'pl-PL', uk: 'uk-UA', ua: 'uk-UA', ru: 'ru-RU' };

/** App locale code -> BCP 47 tag for Intl and React Aria. 'ua' (the site's URL prefix) is Ukrainian. */
export function toBcp47(locale) {
  if (!locale) return 'en-US';
  const key = String(locale).toLowerCase();
  if (TAGS[key]) return TAGS[key];
  return locale;
}

const toDate = (d) => new Date(Date.UTC(d.year, d.month - 1, d.day, 12));

/**
 * Formats a set range for display. Returns null when the range is empty, so the control shows the muted words
 * given by props ("Any date"), never a mm/dd/yyyy mask (C4). The year appears only when the range leaves the current year.
 * Uses Intl.DateTimeFormat.formatRange, so month names and the dash come from the locale (an en dash, never an em dash).
 */
export function formatDateRange(range, locale = 'en', today = currentDate()) {
  if (!range || !range.start || !range.end) return null;
  const tag = toBcp47(locale);
  const sameYear = range.start.year === today.year && range.end.year === today.year;
  const opts = { month: 'short', day: 'numeric', timeZone: 'UTC', ...(sameYear ? {} : { year: 'numeric' }) };
  const fmt = new Intl.DateTimeFormat(tag, opts);
  const a = toDate(range.start); const b = toDate(range.end);
  const out = a.getTime() === b.getTime() ? fmt.format(a) : fmt.formatRange(a, b);
  return out.replace(/—/g, '–');
}

export function currentDate(now = new Date()) {
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}
