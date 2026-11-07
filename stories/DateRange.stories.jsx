import { useState } from 'react';
import { DateRange, CalendarDate } from '../src/index.js';
import { t } from './strings.js';

export default { title: 'Primitives/DateRange', component: DateRange, parameters: { docs: { description: { component: 'C4: ONE control. Empty = muted words ("Any date"), never mm/dd/yyyy. Set = localized range ("Nov 6 – 7") with a clear ×. Calendar popover localized by React Aria.' } } } };

function Demo({ s, initial = null, ...rest }) {
  const [v, setV] = useState(initial);
  return <div className="y7-sb-narrow"><DateRange label={s.date} emptyText={s.anyDate} clearLabel={s.clearDate} value={v} onChange={setV} {...rest} /></div>;
}
export const Empty = { render: (_, ctx) => <Demo s={t(ctx)} /> };
export const SetSameMonth = { name: 'Set: same month', render: (_, ctx) => <Demo s={t(ctx)} initial={{ start: new CalendarDate(2026, 11, 6), end: new CalendarDate(2026, 11, 7) }} /> };
export const SetAcrossMonths = { name: 'Set: across months', render: (_, ctx) => <Demo s={t(ctx)} initial={{ start: new CalendarDate(2026, 10, 28), end: new CalendarDate(2026, 11, 3) }} /> };
export const SetOtherYear = { name: 'Set: other year (shows the year)', render: (_, ctx) => <Demo s={t(ctx)} initial={{ start: new CalendarDate(2025, 12, 30), end: new CalendarDate(2026, 1, 2) }} /> };
export const InlineLabel = { render: (_, ctx) => <DateRange label={t(ctx).date} labelPosition="inline" emptyText={t(ctx).anyDate} clearLabel={t(ctx).clearDate} /> };
export const Disabled = { render: (_, ctx) => <Demo s={t(ctx)} isDisabled /> };
export const Error = { render: (_, ctx) => <Demo s={t(ctx)} errorMessage={t(ctx).bannerError} /> };
