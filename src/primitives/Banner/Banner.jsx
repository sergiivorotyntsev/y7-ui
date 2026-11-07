import { Icon } from '../shared/Icon.jsx';
import { Button } from '../Button/Button.jsx';
import { IconButton } from '../IconButton/IconButton.jsx';
import { cx } from '../shared/cx.js';
import { warnOnce } from '../shared/warnOnce.js';
import styles from './Banner.module.css';

const ICON = { info: 'info', success: 'success', 'needs-you': 'warning', error: 'error' };

/**
 * Banner (A2, L1): tone info | success | needs-you | error. Every tone has an icon and words; error is role="alert".
 * `needs-you` requires `action` (what to do). `action` = { label, onPress, isBusy?, busyLabel? }.
 */
export function Banner({ tone = 'info', title, action, onDismiss, dismissLabel, className, children, ...rest }) {
  if (!ICON[tone]) warnOnce(`Banner: unknown tone "${tone}"`);
  if (tone === 'needs-you' && !action) warnOnce('Banner: a needs-you banner needs an action with the words of what to do (L1).');
  if (tone === 'error' && !children && !title) warnOnce('Banner: an error must say what went wrong and what to do (A2).');
  if (onDismiss && !dismissLabel) warnOnce('Banner: pass dismissLabel with onDismiss.');
  return (
    <div {...rest} role={tone === 'error' ? 'alert' : 'status'} data-tone={tone} className={cx('y7-ui', styles.banner, className)}>
      <span className={styles.icon}><Icon name={ICON[tone] ?? 'info'} /></span>
      <div className={styles.body}>
        {title ? <p className={styles.title}>{title}</p> : null}
        {children ? <div className={styles.text}>{children}</div> : null}
      </div>
      {action ? (
        <Button variant="secondary" size="sm" onPress={action.onPress} isBusy={action.isBusy} busyLabel={action.busyLabel} className={styles.action}>
          {action.label}
        </Button>
      ) : null}
      {onDismiss ? <IconButton icon="close" size="sm" aria-label={dismissLabel ?? 'Dismiss'} onPress={onDismiss} className={styles.dismiss} /> : null}
    </div>
  );
}
