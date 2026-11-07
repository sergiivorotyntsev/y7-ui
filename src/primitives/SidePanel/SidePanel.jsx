import { ModalOverlay, Modal, Dialog as RACDialog, Heading } from 'react-aria-components';
import { IconButton } from '../IconButton/IconButton.jsx';
import { cx } from '../shared/cx.js';
import { warnOnce } from '../shared/warnOnce.js';
import styles from './SidePanel.module.css';

/**
 * SidePanel (S3): a right-hand drawer of fixed width (size.panel.width; full width under 768px). Focus trap, Esc, return focus.
 * `title` names it; `closeLabel` names the ×; `footer` is optional. Tabs inside keep their width since the panel does.
 */
export function SidePanel({ isOpen, onOpenChange, title, closeLabel, footer, isDismissable = true, className, children, ...rest }) {
  if (!title) warnOnce('SidePanel: a title is required (the accessible name).');
  if (!closeLabel) warnOnce('SidePanel: pass closeLabel (the accessible name of the × button).');
  return (
    <ModalOverlay isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={isDismissable} className={cx('y7-ui', styles.overlay)}>
      <Modal className={styles.panel}>
        <RACDialog {...rest} className={cx(styles.dialog, className)}>
          {({ close }) => (
            <>
              <header className={styles.header}>
                <Heading slot="title" className={styles.title}>{title}</Heading>
                <IconButton icon="close" aria-label={closeLabel ?? 'Close'} onPress={close} />
              </header>
              <div className={styles.body}>{children}</div>
              {footer ? <footer className={styles.footer}>{footer}</footer> : null}
            </>
          )}
        </RACDialog>
      </Modal>
    </ModalOverlay>
  );
}
