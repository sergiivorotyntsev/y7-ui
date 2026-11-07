import { Button as RACButton } from 'react-aria-components';
import { Icon } from '../shared/Icon.jsx';
import { cx } from '../shared/cx.js';
import { warnOnce } from '../shared/warnOnce.js';
import { assertStatusProps } from './statusVocabulary.js';
import styles from './Chip.module.css';

/**
 * StatusChip (L1): tone done | progress | needs-you | blocked | neutral, drawn from the status tokens.
 * The words are mandatory (colour is never the only signal); `needs-you` also requires `action`, the words of what to do.
 */
export function StatusChip({ tone = 'neutral', action, className, children, ...rest }) {
  const problems = assertStatusProps({ tone, children, action });
  for (const p of problems) warnOnce(`StatusChip: ${p}`);
  return (
    <span {...rest} data-tone={tone} className={cx('y7-ui', styles.chip, styles.status, className)}>
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.words}>{children}</span>
      {action ? <span className={styles.action}>{action}</span> : null}
    </span>
  );
}

/** Removable filter chip: the label plus an × whose accessible name comes from `removeLabel` (e.g. "Remove filter Status: Active"). */
export function FilterChip({ onRemove, removeLabel, className, children, ...rest }) {
  if (!removeLabel) warnOnce('FilterChip: pass removeLabel (the accessible name of the × button).');
  return (
    <span {...rest} className={cx('y7-ui', styles.chip, styles.filter, className)}>
      <span className={styles.words}>{children}</span>
      <RACButton onPress={onRemove} aria-label={removeLabel ?? 'Remove'} className={styles.remove}>
        <Icon name="close" />
      </RACButton>
    </span>
  );
}
