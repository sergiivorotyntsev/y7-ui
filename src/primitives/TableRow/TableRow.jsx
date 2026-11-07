import { useId } from 'react';
import { IconButton } from '../IconButton/IconButton.jsx';
import { cx } from '../shared/cx.js';
import styles from './TableRow.module.css';

/**
 * Table: columns [{ id, label, align? }]; `caption` for screen readers. Rows are TableRow children.
 */
export function Table({ columns = [], caption, children, className, ...rest }) {
  return (
    <table {...rest} className={cx('y7-ui', styles.table, className)}>
      {caption ? <caption className={styles.caption}>{caption}</caption> : null}
      <thead>
        <tr className={styles.head}>
          {columns.map((c) => <th key={c.id} scope="col" data-align={c.align} className={styles.th}>{c.label}</th>)}
          {columns.some((c) => c.id === '__toggle') ? null : <th scope="col" className={cx(styles.th, styles.toggleCol)} aria-hidden="true" />}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

/**
 * TableRow (S1, L2, L3): the header row has a fixed height (size.row) and never moves when `expanded` content opens
 * below it. cells: ReactNode[]; `expanded` renders in a second <tr>; `isExpanded`/`onToggle` control it;
 * `toggleLabel` names the chevron (e.g. "Show details for load 1042"). Identifiers are never truncated (nowrap, width grows).
 */
export function TableRow({ cells = [], expanded, isExpanded = false, onToggle, toggleLabel, isSelected = false, className, ...rest }) {
  const detailId = useId();
  const span = cells.length + 1;
  return (
    <>
      <tr {...rest} data-selected={isSelected || undefined} data-expanded={isExpanded || undefined} className={cx(styles.row, className)}>
        {cells.map((cell, i) => <td key={i} className={styles.td}>{cell}</td>)}
        <td className={cx(styles.td, styles.toggleCol)}>
          {expanded !== undefined ? (
            <IconButton icon="chevronDown" size="sm" aria-label={toggleLabel} aria-expanded={isExpanded} aria-controls={detailId} onPress={onToggle} className={cx(styles.toggle, isExpanded && styles.toggleOpen)} />
          ) : null}
        </td>
      </tr>
      {expanded !== undefined ? (
        <tr id={detailId} hidden={!isExpanded} className={styles.detail}>
          <td colSpan={span} className={styles.detailCell}>{isExpanded ? expanded : null}</td>
        </tr>
      ) : null}
    </>
  );
}
