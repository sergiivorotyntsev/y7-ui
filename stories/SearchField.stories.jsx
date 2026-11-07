import { SearchField } from '../src/index.js';
import { t } from './strings.js';

export default { title: 'Primitives/SearchField', component: SearchField };

export const Empty = { render: (_, ctx) => <div className="y7-sb-narrow"><SearchField label={t(ctx).search} placeholder={t(ctx).searchPlaceholder} clearLabel={t(ctx).clearSearch} /></div> };
export const WithValue = { render: (_, ctx) => <div className="y7-sb-narrow"><SearchField label={t(ctx).search} defaultValue="1HGCM82633A" placeholder={t(ctx).searchPlaceholder} clearLabel={t(ctx).clearSearch} /></div> };
export const Busy = { render: (_, ctx) => <div className="y7-sb-narrow"><SearchField label={t(ctx).search} defaultValue="Camry" isBusy busyLabel={t(ctx).loading} placeholder={t(ctx).searchPlaceholder} clearLabel={t(ctx).clearSearch} /></div> };
export const InlineLabel = { render: (_, ctx) => <SearchField label={t(ctx).search} labelPosition="inline" placeholder={t(ctx).searchPlaceholder} clearLabel={t(ctx).clearSearch} /> };
export const Disabled = { render: (_, ctx) => <div className="y7-sb-narrow"><SearchField label={t(ctx).search} isDisabled placeholder={t(ctx).searchPlaceholder} clearLabel={t(ctx).clearSearch} /></div> };
export const Error = { render: (_, ctx) => <div className="y7-sb-narrow"><SearchField label={t(ctx).search} defaultValue="?" errorMessage={t(ctx).bannerError} placeholder={t(ctx).searchPlaceholder} clearLabel={t(ctx).clearSearch} /></div> };
