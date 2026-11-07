import { useState } from 'react';
import { Table, TableRow, StatusChip } from '../src/index.js';
import { t } from './strings.js';

export default { title: 'Primitives/TableRow', component: TableRow, parameters: { docs: { description: { component: 'S1: fixed 48px header row; expanding opens a second row below, the header never moves. L3: identifiers never truncate.' } } } };

const LOADS = [
  { id: 'Y7-1042', vehicle: '2019 Toyota Camry', route: 'Newark, NJ → Gdańsk', tone: 'progress' },
  { id: 'Y7-1043', vehicle: '2021 Ford F-150 SuperCrew Lariat', route: 'Baltimore, MD → Klaipėda', tone: 'needs-you' },
  { id: 'Y7-1044', vehicle: '2017 BMW X5', route: 'Savannah, GA → Poti', tone: 'done' },
];

function Demo({ s }) {
  const [open, setOpen] = useState('Y7-1043');
  const statusWords = { progress: s.progress, 'needs-you': s.needsYou, done: s.done };
  return (
    <Table caption={s.columns.id} columns={[{ id: 'id', label: s.columns.id }, { id: 'vehicle', label: s.columns.vehicle }, { id: 'route', label: s.columns.route }, { id: 'status', label: s.columns.status }]}>
      {LOADS.map((l) => (
        <TableRow
          key={l.id}
          cells={[<strong key="id">{l.id}</strong>, l.vehicle, l.route, <StatusChip key="st" tone={l.tone} action={l.tone === 'needs-you' ? s.needsYouAction : undefined}>{statusWords[l.tone]}</StatusChip>]}
          isExpanded={open === l.id}
          onToggle={() => setOpen(open === l.id ? null : l.id)}
          toggleLabel={s.showDetails(l.id)}
          expanded={<p className="y7-sb-note">{s.dialogBody}</p>}
        />
      ))}
    </Table>
  );
}
export const Default = { render: (_, ctx) => <Demo s={t(ctx)} /> };
export const NoExpansion = { render: (_, ctx) => { const s = t(ctx); return <Table caption={s.columns.id} columns={[{ id: 'id', label: s.columns.id }, { id: 'vehicle', label: s.columns.vehicle }]}>{LOADS.map((l) => <TableRow key={l.id} cells={[l.id, l.vehicle]} />)}</Table>; } };
