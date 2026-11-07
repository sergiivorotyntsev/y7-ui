import { Button as RACButton } from 'react-aria-components';
import { Icon } from '../shared/Icon.jsx';
import { cx } from '../shared/cx.js';
import { warnOnce } from '../shared/warnOnce.js';
import styles from './IconButton.module.css';

/**
 * Square icon-only button (C5): an accessible name is required (`aria-label`), 44px target on touch widths.
 * `icon` is a name from the shared inventory, or pass children for a custom glyph.
 */
export function IconButton({ icon, variant = 'ghost', size = 'md', className, children, ...rest }) {
  if (!rest['aria-label'] && !rest['aria-labelledby']) warnOnce('IconButton: an accessible name (aria-label) is required (C5).');
  return (
    <RACButton {...rest} data-variant={variant} className={cx('y7-ui', styles.button, styles[variant], styles[size], className)}>
      {children ?? <Icon name={icon} />}
    </RACButton>
  );
}
