import { useEffect } from 'react';
import { I18nProvider, useLocale } from 'react-aria-components';
import { toBcp47 } from '../DateRange/dateRangeFormat.js';

/**
 * The locale and theme the primitives read — with NO element of its own (Claude's ruling, 2026-11-07: adopting the
 * library must never change an app's layout).
 * - locale: 'en' | 'pl' | 'uk' | 'ru' (or 'ua') or a BCP 47 tag, for React Aria's dates, numbers and calendar.
 * - theme: 'site' | 'admin', put on <html data-y7-theme> after mount so the scoped token CSS applies. To avoid any
 *   first-paint flash, an app may instead write the attribute in its index.html (or import the unscoped theme CSS,
 *   which sets :root) and pass applyTheme={false}.
 * Every primitive root carries the .y7-ui class itself (src/styles/base.css: focus law, one UI font, tabular numbers,
 * reduced motion). A dark region inside the site theme adds the .y7-on-inverse class to its own element.
 * Server rendering / prerender: nothing touches the DOM until the effect runs.
 */
export function Y7Provider({ theme = 'site', locale = 'en', applyTheme = true, children }) {
  useEffect(() => {
    if (!applyTheme || typeof document === 'undefined') return;
    document.documentElement.dataset.y7Theme = theme;
  }, [theme, applyTheme]);
  return <I18nProvider locale={toBcp47(locale)}>{children}</I18nProvider>;
}

/** The active BCP 47 locale (from the nearest I18nProvider, or the browser's). */
export function useY7Locale() {
  return useLocale().locale;
}
