import { Banner } from '../src/index.js';
import { t } from './strings.js';

export default { title: 'Primitives/Banner', component: Banner, parameters: { docs: { description: { component: 'A2/L1: every tone has an icon and words; error is role=alert; needs-you carries the action.' } } } };

export const Info = { render: (_, ctx) => <Banner tone="info" title={t(ctx).bannerInfoTitle}>{t(ctx).bannerInfo}</Banner> };
export const Success = { render: (_, ctx) => <Banner tone="success">{t(ctx).bannerSuccess}</Banner> };
export const NeedsYou = { render: (_, ctx) => <Banner tone="needs-you" title={t(ctx).bannerNeedsYouTitle} action={{ label: t(ctx).signBol, onPress: () => {} }}>{t(ctx).bannerNeedsYou}</Banner> };
export const Error = { render: (_, ctx) => <Banner tone="error" title={t(ctx).bannerErrorTitle} action={{ label: t(ctx).retry, onPress: () => {} }}>{t(ctx).bannerError}</Banner> };
export const ErrorBusyRetry = { name: 'Error, retry in progress', render: (_, ctx) => <Banner tone="error" title={t(ctx).bannerErrorTitle} action={{ label: t(ctx).retry, onPress: () => {}, isBusy: true, busyLabel: t(ctx).loading }}>{t(ctx).bannerError}</Banner> };
export const Dismissible = { render: (_, ctx) => <Banner tone="info" title={t(ctx).bannerInfoTitle} onDismiss={() => {}} dismissLabel={t(ctx).dismiss}>{t(ctx).bannerInfo}</Banner> };
