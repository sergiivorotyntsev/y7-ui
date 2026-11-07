import { I18nProvider, useLocale } from 'react-aria-components';
import { toBcp47 } from '../DateRange/dateRangeFormat.js';
import { cx } from '../shared/cx.js';

/**
 * Wraps an app (or a region) in the theme and locale the primitives read.
 * theme: 'site' | 'admin' (sets data-y7-theme for the scoped token CSS); locale: 'en' | 'pl' | 'uk' | 'ru' (or 'ua') or a BCP 47 tag.
 * Sets lang on the wrapper so screen readers switch language with the account (X3).
 */
export function Y7Provider({ theme = 'site', locale = 'en', inverse = false, className, children, ...rest }) {
  const tag = toBcp47(locale);
  return (
    <I18nProvider locale={tag}>
      <div {...rest} className={cx('y7-ui', inverse && 'y7-on-inverse', className)} data-y7-theme={theme} lang={tag.split('-')[0]}>
        {children}
      </div>
    </I18nProvider>
  );
}

/** The active BCP 47 locale (from the nearest I18nProvider, or the browser's). */
export function useY7Locale() {
  return useLocale().locale;
}
