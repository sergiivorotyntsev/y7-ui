import { useState } from 'react';
import {
  DialogTrigger, Button, Popover, Dialog, RangeCalendar, Heading, CalendarGrid, CalendarGridHeader, CalendarHeaderCell,
  CalendarGridBody, CalendarCell, Label, Text, useLocale,
} from 'react-aria-components';
import { Icon } from '../shared/Icon.jsx';
import { cx } from '../shared/cx.js';
import { warnOnce } from '../shared/warnOnce.js';
import { formatDateRange } from './dateRangeFormat.js';
import field from '../shared/field.module.css';
import styles from './DateRange.module.css';

let idCounter = 0;

/**
 * DateRange (C1, C4): ONE control. Empty shows `emptyText` ("Any date") in the muted token, never a mm/dd/yyyy mask;
 * set shows a localized range such as "Nov 6 – 7" (Intl.formatRange, the locale from I18nProvider or `locale`).
 * A clear × appears when set; the calendar popover is React Aria's RangeCalendar, localized for en/pl/uk/ru.
 * value/onChange use { start, end } CalendarDate objects from @internationalized/date (null to clear).
 */
export function DateRange({ label, labelPosition = 'above', value = null, onChange, emptyText, clearLabel, locale, description, errorMessage, isDisabled = false, minValue, maxValue, className, ...rest }) {
  if (!emptyText) warnOnce('DateRange: pass emptyText (the muted words for "no date", e.g. "Any date").');
  if (!clearLabel) warnOnce('DateRange: pass clearLabel (the accessible name of the × button).');
  const { locale: ctxLocale } = useLocale();
  const tag = locale ?? ctxLocale;
  const [isOpen, setOpen] = useState(false);
  const [id] = useState(() => `y7-daterange-${++idCounter}`);
  const text = formatDateRange(value, tag);
  const isInvalid = !!errorMessage;

  return (
    <div {...rest} data-label-position={labelPosition} data-invalid={isInvalid || undefined} data-disabled={isDisabled || undefined} className={cx('y7-ui', field.field, className)}>
      <Label id={`${id}-label`} className={field.label}>{label}</Label>
      <div className={cx(field.control, styles.group)} data-disabled={isDisabled || undefined}>
        <DialogTrigger isOpen={isOpen} onOpenChange={setOpen}>
          <Button className={styles.trigger} aria-labelledby={`${id}-label ${id}-value`} isDisabled={isDisabled}>
            <span className={field.icon}><Icon name="calendar" /></span>
            <span id={`${id}-value`} className={cx(field.value, !text && field.placeholder)} data-placeholder={!text || undefined}>{text ?? emptyText}</span>
          </Button>
          <Popover className={cx('y7-ui', field.popover, styles.popover)} placement="bottom start">
            <Dialog className={styles.dialog}>
              <RangeCalendar
                value={value}
                minValue={minValue}
                maxValue={maxValue}
                onChange={(range) => { onChange?.(range); setOpen(false); }}
                className={styles.calendar}
              >
                <header className={styles.header}>
                  <Button slot="previous" className={styles.nav}><Icon name="chevronLeft" /></Button>
                  <Heading className={styles.heading} />
                  <Button slot="next" className={styles.nav}><Icon name="chevronRight" /></Button>
                </header>
                <CalendarGrid className={styles.grid}>
                  <CalendarGridHeader>{(day) => <CalendarHeaderCell className={styles.headerCell}>{day}</CalendarHeaderCell>}</CalendarGridHeader>
                  <CalendarGridBody>{(date) => <CalendarCell date={date} className={styles.cell} />}</CalendarGridBody>
                </CalendarGrid>
              </RangeCalendar>
            </Dialog>
          </Popover>
        </DialogTrigger>
        {text ? (
          <Button aria-label={clearLabel ?? 'Clear'} onPress={() => onChange?.(null)} isDisabled={isDisabled} className={styles.clear}><Icon name="close" /></Button>
        ) : null}
      </div>
      {description ? <Text slot="description" className={field.description}>{description}</Text> : null}
      {errorMessage ? <div role="alert" className={field.error}><span className={field.icon}><Icon name="error" /></span><span>{errorMessage}</span></div> : null}
    </div>
  );
}
