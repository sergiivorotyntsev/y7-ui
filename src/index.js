// @sergiivorotyntsev/y7-ui: the primitives. Import a theme first:
//   import '@sergiivorotyntsev/y7-ui/tokens/site.css'   (or tokens/admin.css)
// then this module (it carries src/styles/base.css: the focus law, one UI font, tabular numbers, reduced motion).
// No React.lazy and no window access at import time (the site prerenders with Puppeteer; the admin is React 18).
import './styles/base.css';

export { Y7Provider, useY7Locale } from './primitives/Provider/Y7Provider.jsx';
export { Button } from './primitives/Button/Button.jsx';
export { IconButton } from './primitives/IconButton/IconButton.jsx';
export { Select } from './primitives/Select/Select.jsx';
export { DateRange } from './primitives/DateRange/DateRange.jsx';
export { formatDateRange, toBcp47, SUPPORTED_LOCALES } from './primitives/DateRange/dateRangeFormat.js';
export { SearchField } from './primitives/SearchField/SearchField.jsx';
export { FilterBar } from './primitives/FilterBar/FilterBar.jsx';
export { removeChip, clearAll, countApplied, sheetReducer, initialSheet } from './primitives/FilterBar/filterBarLogic.js';
export { StatusChip, FilterChip } from './primitives/Chip/Chip.jsx';
export { STATUS_TONES, isStatusTone, needsActionWords, assertStatusProps } from './primitives/Chip/statusVocabulary.js';
export { Banner } from './primitives/Banner/Banner.jsx';
export { Skeleton } from './primitives/Skeleton/Skeleton.jsx';
export { Table, TableRow } from './primitives/TableRow/TableRow.jsx';
export { SidePanel } from './primitives/SidePanel/SidePanel.jsx';
export { Dialog } from './primitives/Dialog/Dialog.jsx';
export { Spinner } from './primitives/shared/Spinner.jsx';
export { Icon } from './primitives/shared/Icon.jsx';
export { useMediaQuery } from './primitives/shared/useMediaQuery.js';
// Re-exported so an app can wrap a region in a different locale without a second copy of react-aria.
export { I18nProvider } from 'react-aria-components';
export { CalendarDate, today, getLocalTimeZone, parseDate } from '@internationalized/date';
