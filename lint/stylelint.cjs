// Stylelint 17 gate (T1) for the apps. Usage in an app's stylelint.config.js:
//   const y7 = require('@sergiivorotyntsev/y7-ui/stylelint');   // or: import y7 from '@sergiivorotyntsev/y7-ui/stylelint'
//   module.exports = { ...y7, overrides: [ { files: ['src/legacy/**/*.css'], rules: y7.warnRules } ] };  // old code warns
// Pin stylelint 17: stylelint-declaration-strict-value 1.12 supports stylelint 16-17 only.
const PX = '/\\d*\\.?\\d+px/';

const strictProps = ['/color$/', 'fill', 'stroke', 'font-size', 'font-family', 'z-index', 'background-color'];
const strictOptions = {
  // Any value that reads a token passes here; color-no-hex and function-disallowed-list still catch a literal mixed in.
  ignoreValues: ['transparent', 'inherit', 'currentcolor', 'currentColor', 'initial', 'unset', 'none', 'auto', '0', '/var\\(--y7-/', '/^var\\(--[a-z-]+\\)$/'],
  ignoreKeywords: { 'font-family': ['inherit', 'monospace', 'sans-serif', 'system-ui'] },
  message: 'T1: ${property} must read a token (var(--y7-...)), not a literal.',
};

const errorRules = {
  'color-no-hex': [true, { message: 'T1: no hex colours; read a token var(--y7-color-...).' }],
  'color-named': ['never', { message: 'T1: no named colours; read a token.' }],
  'function-disallowed-list': [['rgb', 'rgba', 'hsl', 'hsla', 'oklch', 'oklab', 'color-mix'], { message: 'T1: no colour functions in component CSS; the token build owns colour.' }],
  'declaration-property-value-disallowed-list': [{
    'font-size': [PX, '/\\d*\\.?\\d+(rem|em)$/'],
    '/^(padding|margin|gap|row-gap|column-gap|inset)/': [PX],
    '/^border-(start|end|top|bottom)?-?(start|end|left|right)?-?radius$/': [PX],
  }, { message: 'T1: no px sizes for type, spacing or radius; read a token (space, radius, font-size).' }],
  'scale-unlimited/declaration-strict-value': [strictProps, strictOptions],
};
const warnRules = Object.fromEntries(Object.entries(errorRules).map(([k, v]) => {
  const [primary, secondary = {}] = Array.isArray(v) ? v : [v];
  return [k, [primary, { ...secondary, severity: 'warning' }]];
}));

module.exports = {
  plugins: ['stylelint-declaration-strict-value'],
  rules: errorRules,
  errorRules,
  warnRules,
};
