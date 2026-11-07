import { IconButton } from '../src/index.js';
import { t } from './strings.js';

export default { title: 'Primitives/IconButton', component: IconButton, parameters: { docs: { description: { component: 'C5: accessible name required; 44px target on touch (pointer: coarse).' } } } };

export const Default = { render: (_, ctx) => <IconButton icon="close" aria-label={t(ctx).close} /> };
export const Variants = { render: (_, ctx) => <div className="y7-sb-row"><IconButton icon="more" aria-label={t(ctx).more}>…</IconButton><IconButton icon="search" variant="secondary" aria-label={t(ctx).search} /><IconButton icon="close" variant="danger" aria-label={t(ctx).delete} /></div> };
export const Sizes = { render: (_, ctx) => <div className="y7-sb-row"><IconButton icon="close" size="sm" aria-label={t(ctx).close} /><IconButton icon="close" size="md" aria-label={t(ctx).close} /><IconButton icon="close" size="lg" aria-label={t(ctx).close} /></div> };
export const Disabled = { render: (_, ctx) => <IconButton icon="close" isDisabled aria-label={t(ctx).close} /> };
