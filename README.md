# @sergiivorotyntsev/y7-ui

Y7's shared UI library (UXSYS-1 Stage 1): design tokens, React Aria primitives styled with CSS modules, a Storybook catalogue, and the lint gates both apps run. One source for the website portal (`Y7-WEBSITE`, React 19, Puppeteer prerender) and the dispatch admin (`TRANSPORT`, React 18).

The rules the library satisfies are in [docs/ui-standards.md](./docs/ui-standards.md) (C1-C5 controls, T1-T3 tokens, S1-S5 stability, A1-A4 answers, L1-L5 lists and statuses, F, X accessibility, P process). Rule IDs are cited in component comments and story descriptions.

## Layout

```
tokens/src/      DTCG 2025.10 sources: base.tokens.json (shared), site.tokens.json, admin.tokens.json
tokens/build.mjs Style Dictionary 5 build -> tokens/dist/{site,admin}.css, *.scoped.css, *.js, index.js (committed)
tokens/test/     token contract tests (node --test)
src/index.js     the primitives (import a theme CSS first)
src/styles/      base.css: the Focus-Visible Law, one UI font, tabular numbers, reduced motion
src/primitives/  Button, IconButton, Select, DateRange, SearchField, FilterBar, Chip, Banner, Skeleton, TableRow, SidePanel, Dialog, Provider, shared
lint/            eslint.js (flat config export), stylelint.cjs (Stylelint 17 config export)
stories/         Storybook 10 stories, one per component per state, strings in en/pl/uk/ru
tests/           vitest + Testing Library (jsdom)
docs/            ui-standards.md (approved), lint-gates.md (how the apps adopt the gates)
```

## Install and use

Publishing to GitHub Packages is a later stage. Until then, install from a local path or a git tag.

```js
// once, at the app root (choose the theme):
import '@sergiivorotyntsev/y7-ui/tokens/site.css';     // Y7-WEBSITE: Dispatch Board paper
// import '@sergiivorotyntsev/y7-ui/tokens/admin.css'; // TRANSPORT: dark admin
import { Y7Provider, Button, FilterBar, Select, DateRange, SearchField, StatusChip, Banner } from '@sergiivorotyntsev/y7-ui';

<Y7Provider theme="site" locale={account.locale /* en | pl | uk | ru (or ua) */}>
  <App />
</Y7Provider>
```

`Y7Provider` renders **no element of its own** (Claude's ruling, 2026-11-07: adopting the library must never change an app's layout). It provides React Aria's `I18nProvider`, so `Select`, `DateRange` and the calendar speak the account's language, and after mount puts `data-y7-theme` on `<html>`. To avoid a first-paint flash, write the attribute in `index.html` (or load the unscoped theme CSS, which sets `:root`) and pass `applyTheme={false}`. `<html lang>` is the app's own job (X3). Every primitive root carries `.y7-ui` itself; a dark region in the site theme adds `.y7-on-inverse` to its own element. The `*.scoped.css` files define the variables only under `[data-y7-theme="..."]` (Storybook switches themes with them).

**Admin light theme:** not built yet. Claude's ruling: it is required before any admin screen migrates (not for the portal pilot).

Tokens in JS, without literals: `import { cssVar, tokens } from '@sergiivorotyntsev/y7-ui/tokens/site'` then `style={{ background: cssVar('color-surface-panel') }}`.

### Peer dependencies and constraints
- `react` / `react-dom` `^18 || ^19`. No `React.lazy`, no `window` access at import time (the site prerenders every route with Puppeteer; `useMediaQuery` is false on the server and the first client render).
- Styles are CSS modules reading `--y7-*` variables only. No literal colour or size exists in component CSS or JSX; the library passes its own gates (`npm run lint`).

## Components (all states in Storybook)

| Component | What it guarantees | Required words (props) |
|---|---|---|
| `Button` | primary / secondary / ghost / danger; sm 28, md 36 (toolbar), lg 44; `isBusy` keeps the width and shows a named spinner (A1) | children, `busyLabel` when busy |
| `IconButton` | square, 36px (44px on `pointer: coarse`, C5); `aria-label` required | `aria-label` |
| `Select` | React Aria Select; muted placeholder words (C4); `labelPosition` above / inline / hidden (C3); loading, error (icon + words), empty list | `label`, `placeholder`, `emptyText`, `errorMessage?`, `loadingLabel?` |
| `DateRange` | ONE control; empty = `emptyText` in the muted token, never a mask; set = `Intl.formatRange` ("Nov 6 – 7", "6–7 lis", "6–7 лист.", "6–7 нояб."); clear ×; localized RangeCalendar popover | `label`, `emptyText`, `clearLabel` |
| `SearchField` | same shell as Select; clear × named; `isBusy` spinner (A3) | `label`, `placeholder`, `clearLabel`, `busyLabel?` |
| `FilterBar` | one row of equal-height controls with one label position forced onto children (C2, C3); applied chips with × and "Clear all"; narrow: "Filters (N)" button opening a sheet with Apply / Clear (L4) | `labels` object |
| `StatusChip` | L1 tones `done` (green) `progress` (blue) `needs-you` (amber) `blocked` (red) `neutral`; words mandatory; `needs-you` requires `action` | children, `action` for amber |
| `FilterChip` | removable chip, × named by `removeLabel` | `removeLabel` |
| `Banner` | info / success / needs-you / error; icon + words always; error is `role="alert"`; optional `action` (busy-capable) and dismiss | `title` or children, `action` for needs-you, `dismissLabel` with `onDismiss` |
| `Skeleton` | reserves the final size; `rows` = the real page size; variants text / row / card | `label` |
| `Table`, `TableRow` | 48px fixed header row that never moves on expand (S1); identifiers never truncate (L3); expansion in a second row with `aria-expanded`/`aria-controls` | `toggleLabel` when expandable |
| `SidePanel` | fixed-width right drawer (full width < 768px), focus trap, Esc, return focus | `title`, `closeLabel` |
| `Dialog` | centred dialog or `variant="sheet"`; `role="alertdialog"` supported | `title`, `closeLabel` |

### Documented aria fallbacks
Every visible string comes from props. When a required accessible-name prop is missing the component warns once in development and falls back to a single English word so the element is never nameless: `Working` (Button busy), `Remove` (FilterChip), `Clear` (DateRange, SearchField), `Close` (Dialog, SidePanel), `Dismiss` (Banner), `Loading` (Select loading, Skeleton), `Searching` (SearchField busy), `Filters (N)`, `Clear all`, `Apply`, `Clear` (FilterBar). Treat a warning as a defect in the app: the words must come from the account's language.

## Tokens

- Format: W3C DTCG 2025.10 JSON (`$type`, `$value` objects for color, dimension, duration, shadow). Colours are sRGB objects with `components`, `alpha` and the `hex` fallback.
- Names are semantic (`color.surface.page`, `color.status.needs-you.fg`, `size.control.md`), never hex names. Source values: site from `Y7-WEBSITE/src/styles/variables.css` (`--v2-*`), `theme.js v2` and `DESIGN.md`; admin from `TRANSPORT/web/src/styles/ui.css` (`--ui-*`) resolved through `web/src/theme/tokens.css` `[data-theme="dark"]`.
- Two themes: `site` (paper `#f4f0e8`, card cream, ink, signal red, Bonded Pine, red focus ring with a quiet neutral ring for on-load focus) and `admin` (dark page `#0b0c0e`, panel `#1a1d21`, blue focus ring `#5ea1ff` which is its own token and never the error colour).
- Build: `npm run tokens` (also runs on `prepack`). Tests: `npm run test:tokens` assert that every semantic token resolves in both themes, both themes expose the same names, the status and focus tokens exist, admin focus ≠ error, the type scale is six steps 11-20px, control heights are 36 / 44, the UI font stack is system-ui first.

## Lint gates for the apps
See [docs/lint-gates.md](./docs/lint-gates.md): ESLint flat config (`react/forbid-elements` for button/select/dialog; `no-restricted-syntax` for native date inputs and colour/size literals in `style={{}}`) and Stylelint 17 (`color-no-hex`, `color-named: never`, `function-disallowed-list` rgb/rgba/hsl/hsla, px bans for font-size/padding/margin/gap/border-radius, strict-value for colour/font-size/z-index/font-family). Warn on old code, error on new code.

## Scripts
`npm run tokens` build tokens · `npm test` (tokens, logic, vitest) · `npm run lint` (ESLint + Stylelint on the library) · `npm run storybook` dev · `npm run build-storybook` static build (only when `~/.y7/machine.lock` is free).

## Dependencies (why each is here)
Runtime:
- `react-aria-components` 1.22.1: accessible, localized primitives (Select, RangeCalendar, Dialog, Button with `isPending`) for React 18 and 19; replaces 5 dialog and 4 filter-bar implementations.
- `@internationalized/date` 3.12.4: the `CalendarDate` value type `DateRange` exchanges (React Aria's own date library).

Dev:
- `style-dictionary` 5.8.0: builds DTCG 2025.10 tokens into CSS variables and a JS map (Node ≥ 22).
- `storybook`, `@storybook/react-vite` 10.6.6: the catalogue, Vite builder, static build.
- `@storybook/addon-a11y` 10.6.6: axe-core in every story (X1), `test: 'error'`.
- `vite` 8.3.6, `@vitejs/plugin-react` 6.2.1: Storybook's and vitest's bundler and JSX transform.
- `vitest` 5.1.0, `jsdom` 31: component unit tests; `@testing-library/react` 16, `@testing-library/user-event` 14, `@testing-library/jest-dom` 7: role-based assertions and real interaction.
- `eslint` 9.39 (pinned below 10 because `eslint-plugin-react` 7.37.5 peers `^9.7`), `eslint-plugin-react` 7.37.5 (`forbid-elements`), `@eslint/js`, `globals`: the ESLint gate and the library's own lint.
- `stylelint` 17.16 (pinned: `stylelint-declaration-strict-value` 1.12.1 supports 16-17 only), `stylelint-declaration-strict-value` 1.12.1: the Stylelint gate.
- `react`, `react-dom` 19.3.1: dev copies for tests and Storybook (peers for the apps).
