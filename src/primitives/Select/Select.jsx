import { Select as RACSelect, Label, Button, SelectValue, Popover, ListBox, ListBoxItem, FieldError, Text } from 'react-aria-components';
import { Icon } from '../shared/Icon.jsx';
import { Spinner } from '../shared/Spinner.jsx';
import { cx } from '../shared/cx.js';
import field from '../shared/field.module.css';
import styles from './Select.module.css';

/**
 * Select (C1, C2, C3, C4). items: [{ id, label, description? }]. `placeholder` is the muted "no value" words.
 * labelPosition above | inline | hidden (hidden keeps the label for screen readers). `isLoading` shows a spinner in the control.
 * errorMessage renders with an icon under the control; emptyText shows in the list when there are no items.
 */
export function Select({ label, labelPosition = 'above', items = [], placeholder, description, errorMessage, isLoading = false, loadingLabel, emptyText, className, ...rest }) {
  return (
    <RACSelect {...rest} placeholder={placeholder} isInvalid={!!errorMessage || rest.isInvalid} data-label-position={labelPosition} className={cx('y7-ui', field.field, className)}>
      <Label className={field.label}>{label}</Label>
      <Button className={cx(field.control, styles.trigger)}>
        <SelectValue className={field.value} />
        <span className={field.icon}>{isLoading ? <Spinner size="sm" label={loadingLabel ?? 'Loading'} /> : <Icon name="chevronDown" />}</span>
      </Button>
      {description ? <Text slot="description" className={field.description}>{description}</Text> : null}
      <FieldError className={field.error}>{errorMessage ? <><span className={field.icon}><Icon name="error" /></span><span>{errorMessage}</span></> : null}</FieldError>
      <Popover className={cx('y7-ui', field.popover)}>
        <ListBox items={items} className={styles.list} renderEmptyState={() => <div className={field.empty}>{emptyText}</div>}>
          {(item) => (
            <ListBoxItem id={item.id} textValue={item.label} className={styles.item}>
              {({ isSelected }) => (
                <>
                  <span className={styles.itemLabel}>{item.label}</span>
                  {item.description ? <span className={styles.itemDescription}>{item.description}</span> : null}
                  <span className={styles.check} aria-hidden="true">{isSelected ? <Icon name="check" /> : null}</span>
                </>
              )}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </RACSelect>
  );
}
