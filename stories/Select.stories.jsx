import { useState } from 'react';
import { Select } from '../src/index.js';
import { t } from './strings.js';

export default { title: 'Primitives/Select', component: Select, parameters: { docs: { description: { component: 'C1 Select on React Aria. Empty shows muted placeholder words (C4); label above or inline (C3); 36px control (C2).' } } } };

const items = (s) => [{ id: 'active', label: s.active }, { id: 'transit', label: s.inTransit }, { id: 'delivered', label: s.delivered }, { id: 'closed', label: s.closed }];

export const Empty = { render: (_, ctx) => <div className="y7-sb-narrow"><Select label={t(ctx).status} placeholder={t(ctx).anyStatus} items={items(t(ctx))} emptyText={t(ctx).emptyList} /></div> };
function Selected({ s }) { const [k, setK] = useState('closed'); return <div className="y7-sb-narrow"><Select label={s.status} placeholder={s.anyStatus} items={items(s)} selectedKey={k} onSelectionChange={setK} emptyText={s.emptyList} /></div>; }
export const WithValue = { render: (_, ctx) => <Selected s={t(ctx)} /> };
export const InlineLabel = { render: (_, ctx) => <Select label={t(ctx).status} labelPosition="inline" placeholder={t(ctx).anyStatus} items={items(t(ctx))} emptyText={t(ctx).emptyList} /> };
export const Disabled = { render: (_, ctx) => <div className="y7-sb-narrow"><Select label={t(ctx).status} placeholder={t(ctx).anyStatus} items={items(t(ctx))} isDisabled emptyText={t(ctx).emptyList} /></div> };
export const Loading = { render: (_, ctx) => <div className="y7-sb-narrow"><Select label={t(ctx).status} placeholder={t(ctx).anyStatus} items={[]} isLoading loadingLabel={t(ctx).loadMore} emptyText={t(ctx).emptyList} /></div> };
export const Error = { render: (_, ctx) => <div className="y7-sb-narrow"><Select label={t(ctx).status} placeholder={t(ctx).anyStatus} items={items(t(ctx))} errorMessage={t(ctx).bannerError} emptyText={t(ctx).emptyList} /></div> };
export const EmptyList = { render: (_, ctx) => <div className="y7-sb-narrow"><Select label={t(ctx).status} placeholder={t(ctx).anyStatus} items={[]} emptyText={t(ctx).emptyList} /></div> };
