import { useState } from 'react';
import { Button } from '../src/index.js';
import { STRINGS, LOCALES, t } from './strings.js';

export default { title: 'Primitives/Button', component: Button, parameters: { docs: { description: { component: 'C1 Button. Variants primary / secondary / ghost / danger; sizes sm / md (toolbar 36px) / lg (44px); busy keeps its width (A1).' } } } };

export const Primary = { render: (_, ctx) => <Button>{t(ctx).save}</Button> };
export const Secondary = { render: (_, ctx) => <Button variant="secondary">{t(ctx).cancel}</Button> };
export const Ghost = { render: (_, ctx) => <Button variant="ghost">{t(ctx).more}</Button> };
export const Danger = { render: (_, ctx) => <Button variant="danger">{t(ctx).delete}</Button> };
export const Disabled = { render: (_, ctx) => <div className="y7-sb-row"><Button isDisabled>{t(ctx).save}</Button><Button variant="secondary" isDisabled>{t(ctx).cancel}</Button><Button variant="ghost" isDisabled>{t(ctx).more}</Button><Button variant="danger" isDisabled>{t(ctx).delete}</Button></div> };
export const Sizes = { render: (_, ctx) => <div className="y7-sb-row"><Button size="sm">{t(ctx).save}</Button><Button size="md">{t(ctx).save}</Button><Button size="lg">{t(ctx).save}</Button></div> };

function BusyDemo({ s }) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="y7-sb-stack">
      <div className="y7-sb-row">
        <span className="y7-sb-measure"><Button isBusy={busy} busyLabel={s.saving} onPress={() => { setBusy(true); setTimeout(() => setBusy(false), 2000); }}>{s.save}</Button></span>
        <span className="y7-sb-measure"><Button isBusy busyLabel={s.saving}>{s.save}</Button></span>
        <span className="y7-sb-measure"><Button variant="secondary" isBusy busyLabel={s.saving}>{s.signIn}</Button></span>
      </div>
      <p className="y7-sb-note">Press the first button: the dashed box (its width) does not change while it is busy; the label becomes invisible and a spinner named "{s.saving}" takes its place.</p>
    </div>
  );
}
export const Busy = { render: (_, ctx) => <BusyDemo s={t(ctx)} /> };

export const AllLocalesSameHeight = {
  name: 'All locales, same height',
  render: () => (
    <div className="y7-sb-stack">
      {LOCALES.map((l) => (
        <div className="y7-sb-row" key={l} lang={l}>
          <Button>{STRINGS[l].save}</Button><Button variant="secondary">{STRINGS[l].signIn}</Button><Button variant="ghost">{STRINGS[l].closed}</Button><Button variant="danger">{STRINGS[l].delete}</Button>
        </div>
      ))}
      <p className="y7-sb-note">T2: one system UI font stack; the longest Polish and Russian labels ("Zaloguj się ponownie", "Отменённые и закрытые") keep the 36px row.</p>
    </div>
  ),
};
