import { Children, cloneElement, isValidElement, useState } from 'react';
import { Button } from '../Button/Button.jsx';
import { FilterChip } from '../Chip/Chip.jsx';
import { Dialog } from '../Dialog/Dialog.jsx';
import { Icon } from '../shared/Icon.jsx';
import { useMediaQuery } from '../shared/useMediaQuery.js';
import { cx } from '../shared/cx.js';
import { warnOnce } from '../shared/warnOnce.js';
import { countApplied } from './filterBarLogic.js';
import styles from './FilterBar.module.css';

const NARROW = '(max-width: 767px)';

/**
 * FilterBar (C2, C3, L4): one row of equal-height labelled controls (children: Select, SearchField, DateRange),
 * then the applied-filter chips with × and "Clear all". On narrow widths a "Filters (N)" button opens a sheet
 * with the same controls and Apply / Clear. `labelPosition` is forced onto every child so a row is labelled one way.
 * labels: { filters(n), clearAll, apply, clear, close, sheetTitle, remove(chip), group }  (all words from props).
 * chips: [{ id, label }]. `narrow` overrides the media query (tests, Storybook).
 */
export function FilterBar({ children, chips = [], onRemoveChip, onClearAll, labels, labelPosition = 'above', narrow, className, ...rest }) {
  if (!labels) warnOnce('FilterBar: pass labels ({ filters, clearAll, apply, clear, close, sheetTitle, remove }).');
  const L = labels ?? {};
  const isNarrowMq = useMediaQuery(NARROW);
  const isNarrow = narrow ?? isNarrowMq;
  const [sheetOpen, setSheetOpen] = useState(false);
  const n = countApplied(chips);
  const controls = Children.map(children, (child) => (isValidElement(child) ? cloneElement(child, { labelPosition: isNarrow ? 'above' : labelPosition }) : child));
  const filtersLabel = typeof L.filters === 'function' ? L.filters(n) : L.filters ?? `Filters (${n})`;

  return (
    <div {...rest} role="group" aria-label={L.group} data-narrow={isNarrow || undefined} data-label-position={labelPosition} className={cx('y7-ui', styles.bar, className)}>
      {isNarrow ? (
        <div className={styles.narrowRow}>
          <Button variant="secondary" onPress={() => setSheetOpen(true)} className={styles.filtersButton}>
            <Icon name="filter" />
            <span>{filtersLabel}</span>
          </Button>
          <Dialog
            isOpen={sheetOpen}
            onOpenChange={setSheetOpen}
            title={L.sheetTitle ?? filtersLabel}
            closeLabel={L.close ?? 'Close'}
            variant="sheet"
            actions={
              <>
                <Button variant="ghost" onPress={() => { onClearAll?.(); }}>{L.clear ?? 'Clear'}</Button>
                <Button variant="primary" onPress={() => setSheetOpen(false)}>{L.apply ?? 'Apply'}</Button>
              </>
            }
          >
            <div className={styles.sheetControls}>{controls}</div>
          </Dialog>
        </div>
      ) : (
        <div className={styles.row}>{controls}</div>
      )}
      {n > 0 ? (
        <div className={styles.chips} role="list" aria-label={L.applied}>
          {chips.map((chip) => (
            <div role="listitem" key={chip.id} className={styles.chipItem}>
              <FilterChip removeLabel={typeof L.remove === 'function' ? L.remove(chip) : L.remove} onRemove={() => onRemoveChip?.(chip.id)}>{chip.label}</FilterChip>
            </div>
          ))}
          <Button variant="ghost" size="sm" onPress={() => onClearAll?.()} className={styles.clearAll}>{L.clearAll ?? 'Clear all'}</Button>
        </div>
      ) : null}
    </div>
  );
}
