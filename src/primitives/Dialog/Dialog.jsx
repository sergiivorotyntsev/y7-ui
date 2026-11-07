import { ModalOverlay, Modal, Dialog as RACDialog, Heading } from 'react-aria-components';
import { IconButton } from '../IconButton/IconButton.jsx';
import { cx } from '../shared/cx.js';
import { warnOnce } from '../shared/warnOnce.js';
import styles from './Dialog.module.css';

/**
 * Dialog: focus trap, Esc, return focus (React Aria). `title` is required for the accessible name; `closeLabel` names the ×.
 * `actions` renders in the footer. variant: 'center' (default) | 'sheet' (bottom sheet on narrow widths, used by FilterBar).
 * role 'dialog' | 'alertdialog'. Controlled: isOpen / onOpenChange.
 */
export function Dialog({ isOpen, onOpenChange, title, closeLabel, actions, variant = 'center', role = 'dialog', isDismissable = true, className, children, ...rest }) {
  if (!title) warnOnce('Dialog: a title is required (the accessible name).');
  if (!closeLabel) warnOnce('Dialog: pass closeLabel (the accessible name of the × button).');
  return (
    <ModalOverlay isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={isDismissable} className={cx('y7-ui', styles.overlay)}>
      <Modal className={cx(styles.modal, styles[variant])} data-variant={variant}>
        <RACDialog {...rest} role={role} className={cx(styles.dialog, className)}>
          {({ close }) => (
            <>
              <header className={styles.header}>
                <Heading slot="title" className={styles.title}>{title}</Heading>
                <IconButton icon="close" aria-label={closeLabel ?? 'Close'} onPress={close} />
              </header>
              <div className={styles.body}>{children}</div>
              {actions ? <footer className={styles.footer}>{actions}</footer> : null}
            </>
          )}
        </RACDialog>
      </Modal>
    </ModalOverlay>
  );
}
