/** Joins class names, skipping falsy values. Accepts RAC render-prop functions by returning a function. */
export const cx = (...parts) => parts.filter(Boolean).join(' ');
