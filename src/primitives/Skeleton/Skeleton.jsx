import { cx } from '../shared/cx.js';
import { warnOnce } from '../shared/warnOnce.js';
import styles from './Skeleton.module.css';

/**
 * Skeleton (S1, S2): reserves the final size so nothing grows when data lands.
 * variant text | row | card; `rows` is the count of the real list (pass the page size, not a default 5).
 * `label` is the accessible loading text from props (role="status", aria-busy).
 */
export function Skeleton({ rows = 3, variant = 'row', label, className, ...rest }) {
  if (!label) warnOnce('Skeleton: pass label (the words a screen reader hears while loading).');
  return (
    <div {...rest} role="status" aria-busy="true" aria-label={label ?? 'Loading'} data-variant={variant} className={cx('y7-ui', styles.skeleton, className)}>
      {Array.from({ length: rows }, (_, i) => <span key={i} className={cx(styles.bar, styles[variant])} aria-hidden="true" />)}
    </div>
  );
}
