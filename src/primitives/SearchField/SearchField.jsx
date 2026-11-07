import { SearchField as RACSearchField, Label, Input, Button, FieldError, Text } from 'react-aria-components';
import { Icon } from '../shared/Icon.jsx';
import { Spinner } from '../shared/Spinner.jsx';
import { cx } from '../shared/cx.js';
import field from '../shared/field.module.css';
import styles from './SearchField.module.css';

/**
 * SearchField (C1-C4). Same shell as Select: label position, control height, muted placeholder words.
 * `clearLabel` names the × button; `isBusy` shows a spinner while results load (A3).
 */
export function SearchField({ label, labelPosition = 'above', placeholder, description, errorMessage, isBusy = false, busyLabel, clearLabel, className, ...rest }) {
  return (
    <RACSearchField {...rest} isInvalid={!!errorMessage || rest.isInvalid} data-label-position={labelPosition} className={cx('y7-ui', field.field, styles.field, className)}>
      <Label className={field.label}>{label}</Label>
      <div className={cx(field.control, styles.control)}>
        <span className={field.icon}><Icon name="search" /></span>
        <Input placeholder={placeholder} className={styles.input} />
        {isBusy ? <span className={field.icon}><Spinner size="sm" label={busyLabel ?? 'Searching'} /></span> : null}
        <Button aria-label={clearLabel ?? 'Clear'} className={styles.clear}><Icon name="close" /></Button>
      </div>
      {description ? <Text slot="description" className={field.description}>{description}</Text> : null}
      <FieldError className={field.error}>{errorMessage ? <><span className={field.icon}><Icon name="error" /></span><span>{errorMessage}</span></> : null}</FieldError>
    </RACSearchField>
  );
}
