import { Button as RACButton } from 'react-aria-components';
import { Spinner } from '../shared/Spinner.jsx';
import { cx } from '../shared/cx.js';
import { warnOnce } from '../shared/warnOnce.js';
import styles from './Button.module.css';

/**
 * Button (C1). Variants primary / secondary / ghost / danger; sizes sm / md (toolbar, 36px) / lg (44px).
 * `isBusy` keeps the width (the label turns invisible, a spinner takes its place) and announces progress (A1).
 * `busyLabel` is the spinner's accessible name, from props. Fallback aria string: "Working" (documented in README).
 */
export function Button({ variant = 'primary', size = 'md', isBusy = false, busyLabel, children, className, ...rest }) {
  if (isBusy && !busyLabel) warnOnce('Button: pass busyLabel (the words for the busy state) when isBusy is true.');
  return (
    <RACButton
      {...rest}
      isPending={isBusy}
      data-variant={variant}
      className={cx('y7-ui', styles.button, styles[variant], styles[size], className)}
    >
      {({ isPending }) => (
        <>
          <span className={styles.label} data-hidden={isPending || undefined}>{children}</span>
          {isPending ? <span className={styles.busy}><Spinner size="sm" label={busyLabel ?? 'Working'} /></span> : null}
        </>
      )}
    </RACButton>
  );
}
