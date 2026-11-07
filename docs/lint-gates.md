# Lint gates: warn on old code, error on new code

The library ships two configs. Both apps add them so that existing files warn (the migration backlog stays visible, the build stays green) and files written from now on fail the PR. Rule IDs refer to [ui-standards.md](./ui-standards.md).

## ESLint (C1, T1)

`@sergiivorotyntsev/y7-ui/eslint` exports `y7ESLint(options)` returning flat-config objects, plus the raw `rules` and `restrictedSyntax` for custom wiring. The app must have `eslint ^9.7` and `eslint-plugin-react ^7.37` installed (ESLint 10 is not yet supported by `eslint-plugin-react`).

What it forbids:
- `react/forbid-elements`: raw `<button>`, `<select>`, `<dialog>` (use `Button`, `IconButton`, `Select`, `Dialog`, `SidePanel`).
- `no-restricted-syntax`:
  - `<input type="date|datetime-local|month|time|week">` (use `DateRange`; a native input shows a mm/dd/yyyy mask, C4);
  - colour literals inside `style={{ ... }}`: hex, `rgb()`, `rgba()`, `hsl()`, `hsla()`, `oklch()`, `color-mix()`, named colours, on colour-like properties (`color`, `background`, `border*`, `outline*`, `fill`, `stroke`, `boxShadow`, ...);
  - size literals inside `style={{ ... }}`: `'14px'`, `'1.5rem'` or a non-zero number on `fontSize`, `padding*`, `margin*`, `gap`, `borderRadius`, `width`, `height`, ...

Example `eslint.config.js` in an app:

```js
import { y7ESLint } from '@sergiivorotyntsev/y7-ui/eslint';

export default [
  // ...the app's existing config...
  // 1. Everything warns: the backlog is visible, nothing breaks today.
  ...y7ESLint({ level: 'warn', files: ['src/**/*.{js,jsx}'] }),
  // 2. New or migrated areas error. Add a glob here when a screen is rebuilt on the library.
  ...y7ESLint({ level: 'error', files: ['src/pages/portal/Loads/**/*.jsx', 'src/components/ui/**/*.jsx'] }),
  // 3. Allow-list: files that legitimately own a raw element (a wrapper around a third-party widget, the one legacy page kept as is).
  { files: ['src/legacy/PrintView.jsx'], rules: { 'react/forbid-elements': 'off', 'no-restricted-syntax': 'off' } },
];
```

Or pass the allow-list to the helper: `y7ESLint({ level: 'error', files: [...], allow: ['src/legacy/PrintView.jsx'] })` appends the same "off" object.

Flat config applies the last matching object, so the `error` block must come after the `warn` block.

Alternative for "new code" without maintaining globs: in CI, run `eslint --rule '...'` only on files added in the PR (`git diff --diff-filter=A --name-only origin/main...HEAD`) with `level: 'error'`, and the whole tree with `level: 'warn'`.

## Stylelint 17 (T1)

`@sergiivorotyntsev/y7-ui/stylelint` is a CommonJS config object with `plugins`, `rules` (error level), and two extra keys: `errorRules` and `warnRules` (the same rules at `severity: 'warning'`). Pin `stylelint` to 17: `stylelint-declaration-strict-value` 1.12.x does not support 18.

What it forbids in CSS and CSS modules:
- `color-no-hex`, `color-named: never`, `function-disallowed-list` `rgb rgba hsl hsla oklch oklab color-mix`;
- `declaration-property-value-disallowed-list`: px (and rem/em for font-size) on `font-size`, `padding*`, `margin*`, `gap`, `row-gap`, `column-gap`, `inset*`, `border-*-radius`;
- `scale-unlimited/declaration-strict-value` on `/color$/`, `fill`, `stroke`, `background-color`, `font-size`, `font-family`, `z-index`: the value must read a token (`var(--y7-...)`) or be a keyword (`transparent`, `inherit`, `currentcolor`, `none`, `auto`, `0`).

Example `stylelint.config.js` in an app (CommonJS shown; ESM `import y7 from '@sergiivorotyntsev/y7-ui/stylelint'` works too):

```js
const y7 = require('@sergiivorotyntsev/y7-ui/stylelint');

module.exports = {
  plugins: y7.plugins,
  rules: y7.warnRules,                      // old code warns
  ignoreFiles: ['src/styles/variables.css', 'src/theme/tokens.css', 'node_modules/**'],  // token files are the one legal home of literals
  overrides: [
    { files: ['src/pages/portal/Loads/**/*.css', 'src/components/ui/**/*.css'], rules: y7.errorRules },  // new code errors
  ],
};
```

Tailwind in the admin: the gate reads CSS, not class names. Point Tailwind's palette at the `--y7-*` variables (`colors: { ink: 'var(--y7-color-text-primary)' }`) and the gate covers the generated CSS; arbitrary-value classes (`bg-[#fff]`) need a separate check (`no-restricted-syntax` on `Literal[value=/\\[#[0-9a-f]/]` in className) when the admin migrates.

## The library passes its own gates

`npm run lint` runs both configs at error level over `src/`, `stories/` and `.storybook/`. `react/forbid-elements` is off inside `src/primitives/**` only (that is where the raw elements legally live, wrapped by React Aria); the literal rules stay on everywhere. `tokens/dist/**` is ignored by Stylelint (generated token files).
