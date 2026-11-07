import { Skeleton } from '../src/index.js';
import { t } from './strings.js';

export default { title: 'Primitives/Skeleton', component: Skeleton, parameters: { docs: { description: { component: 'S1/S2: reserves the final size. Pass the real row count (the page size), not a default.' } } } };

export const Rows = { render: (_, ctx) => <Skeleton rows={5} variant="row" label={t(ctx).loading} /> };
export const Text = { render: (_, ctx) => <div className="y7-sb-narrow"><Skeleton rows={3} variant="text" label={t(ctx).loading} /></div> };
export const Card = { render: (_, ctx) => <div className="y7-sb-narrow"><Skeleton rows={1} variant="card" label={t(ctx).loading} /></div> };
export const PageOf25 = { name: 'A page of 25 rows', render: (_, ctx) => <Skeleton rows={25} variant="row" label={t(ctx).loading} /> };
