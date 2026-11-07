import { useState } from 'react';
import { Button, Dialog, SidePanel, StatusChip } from '../src/index.js';
import { t } from './strings.js';

export default { title: 'Primitives/Overlays', parameters: { docs: { description: { component: 'Dialog and SidePanel on React Aria: focus trap, Esc, return focus. Dialog variant sheet is the narrow filter sheet.' } } } };

function DialogDemo({ s, role }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onPress={() => setOpen(true)}>{s.open}</Button>
      <Dialog isOpen={open} onOpenChange={setOpen} role={role} title={s.dialogTitle} closeLabel={s.close} actions={<><Button variant="ghost" onPress={() => setOpen(false)}>{s.keep}</Button><Button variant="danger" onPress={() => setOpen(false)}>{s.confirmCancel}</Button></>}>
        <p>{s.dialogBody}</p>
      </Dialog>
    </>
  );
}
function PanelDemo({ s }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onPress={() => setOpen(true)}>{s.open}</Button>
      <SidePanel isOpen={open} onOpenChange={setOpen} title={s.panelTitle} closeLabel={s.close} footer={<Button onPress={() => setOpen(false)}>{s.save}</Button>}>
        <div className="y7-sb-stack"><StatusChip tone="needs-you" action={s.needsYouAction}>{s.needsYou}</StatusChip><p>{s.dialogBody}</p></div>
      </SidePanel>
    </>
  );
}
export const DialogStory = { name: 'Dialog', render: (_, ctx) => <DialogDemo s={t(ctx)} /> };
export const AlertDialog = { render: (_, ctx) => <DialogDemo s={t(ctx)} role="alertdialog" /> };
export const SidePanelStory = { name: 'SidePanel', render: (_, ctx) => <PanelDemo s={t(ctx)} /> };
