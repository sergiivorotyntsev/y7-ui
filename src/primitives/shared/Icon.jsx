// A fixed inventory of inline SVG glyphs (aria-hidden; the words beside them carry the meaning).
const PATHS = {
  close: 'M6 6l12 12M18 6L6 18',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  chevronDown: 'M6 9l6 6 6-6',
  chevronLeft: 'M15 6l-6 6 6 6',
  chevronRight: 'M9 6l6 6-6 6',
  search: 'M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zm9.5 16l-4.6-4.6',
  calendar: 'M4 6.5h16M7 3v4M17 3v4M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z',
  filter: 'M3 5h18l-7 8v6l-4 2v-8z',
  info: 'M12 8h.01M11 12h1v5h1M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z',
  warning: 'M12 9v4M12 17h.01M10.3 3.9L1.8 18.6A2 2 0 0 0 3.5 21.5h17a2 2 0 0 0 1.7-2.9L13.7 3.9a2 2 0 0 0-3.4 0z',
  error: 'M12 8v5M12 16.5h.01M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z',
  success: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM8.5 12.5l2.5 2.5 4.5-5',
};

export function Icon({ name, size = 'md', className = '' }) {
  const d = PATHS[name];
  if (!d) return null;
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} data-size={size}>
      <path d={d} />
    </svg>
  );
}
