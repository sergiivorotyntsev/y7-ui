import { ProgressBar } from 'react-aria-components';
import styles from './Spinner.module.css';

/** Indeterminate progress, announced through React Aria's ProgressBar. `label` is the accessible name (from props). */
export function Spinner({ label, size = 'md', className = '' }) {
  return (
    <ProgressBar aria-label={label} isIndeterminate className={`${styles.spinner} ${styles[size]} ${className}`}>
      <span className={styles.ring} aria-hidden="true" />
    </ProgressBar>
  );
}
