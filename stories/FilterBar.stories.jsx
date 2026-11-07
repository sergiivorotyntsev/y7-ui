import { useState } from 'react';
import { FilterBar, Select, SearchField, DateRange, CalendarDate, formatDateRange } from '../src/index.js';
import { STRINGS, LOCALES, t } from './strings.js';

export default { title: 'Primitives/FilterBar', component: FilterBar, parameters: { docs: { description: { component: 'C2/C3: one row of equal-height, same-labelled controls; applied chips with × and Clear all; narrow = "Filters (N)" button + sheet with Apply/Clear.' } } } };

function Demo({ s, locale, labelPosition = 'above', narrow }) {
  const [status, setStatus] = useState('closed');
  const [range, setRange] = useState({ start: new CalendarDate(2026, 11, 6), end: new CalendarDate(2026, 11, 7) });
  const [q, setQ] = useState('');
  const statusItems = [{ id: 'active', label: s.active }, { id: 'transit', label: s.inTransit }, { id: 'closed', label: s.closed }];
  const chips = [
    status ? { id: 'status', label: `${s.status}: ${statusItems.find((i) => i.id === status)?.label}` } : null,
    range ? { id: 'date', label: `${s.date}: ${formatDateRange(range, locale)}` } : null,
    q ? { id: 'q', label: `${s.search}: ${q}` } : null,
  ].filter(Boolean);
  const remove = (id) => { if (id === 'status') setStatus(null); if (id === 'date') setRange(null); if (id === 'q') setQ(''); };
  const clearAll = () => { setStatus(null); setRange(null); setQ(''); };
  const labels = { filters: s.filters, clearAll: s.clearAll, apply: s.apply, clear: s.clear, close: s.close, sheetTitle: s.sheetTitle, remove: s.remove, group: s.group, applied: s.applied };
  return (
    <FilterBar chips={chips} onRemoveChip={remove} onClearAll={clearAll} labels={labels} labelPosition={labelPosition} narrow={narrow}>
      <Select label={s.status} placeholder={s.anyStatus} items={statusItems} selectedKey={status} onSelectionChange={setStatus} emptyText={s.emptyList} />
      <DateRange label={s.date} emptyText={s.anyDate} clearLabel={s.clearDate} value={range} onChange={setRange} />
      <SearchField label={s.search} placeholder={s.searchPlaceholder} clearLabel={s.clearSearch} value={q} onChange={setQ} />
    </FilterBar>
  );
}

export const Row = { render: (_, ctx) => <Demo s={t(ctx)} locale={ctx.globals.locale} /> };
export const InlineLabels = { render: (_, ctx) => <Demo s={t(ctx)} locale={ctx.globals.locale} labelPosition="inline" /> };
export const Narrow = { name: 'Narrow (Filters (N) button + sheet)', render: (_, ctx) => <div className="y7-sb-narrow"><Demo s={t(ctx)} locale={ctx.globals.locale} narrow /></div>, parameters: { viewport: { defaultViewport: 'mobile1' } } };
export const LongestLabelsAllLocales = {
  name: 'Longest labels, all locales (same row height)',
  render: () => <div className="y7-sb-stack">{LOCALES.map((l) => <div key={l} lang={l} className="y7-sb-measure"><Demo s={STRINGS[l]} locale={l} /></div>)}</div>,
};
