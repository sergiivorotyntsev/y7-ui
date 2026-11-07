# Y7 UI standards (UXSYS-1, approved 2026-11-07 with Claude's amendments)

The robot reviewer checks every PR against these rules. Each rule has an ID, a plain statement, how it is checked, and what counts as a failure.

How each rule is checked:
- **lint**: a lint gate fails the PR.
- **walk**: an automated browser walk measures it.
- **shot**: a screenshot diff against an approved baseline.
- **review**: the Claude critique of the PR's screenshots names it.

The source is Sergii's standing rules (UXSYS-1 appendix A), plus the site rules in Y7-WEBSITE `CLAUDE.md` and `DESIGN.md`.

## 1. Controls come from the library
| ID | Rule | Check | Fails when |
|---|---|---|---|
| C1 | No raw `<button>`, `<select>`, `<input type=date>`, `<dialog>` outside the component library. | lint (`no-restricted-syntax` on JSX elements, allow-list = library paths) | any new raw element; old code warns |
| C2 | One height per control row: every control in a toolbar or filter bar has the same height, radius, border and font. | walk: bounding boxes of controls sharing a parent row | heights differ by > 1 px |
| C3 | Every control in a group is labelled the same way: all labels above, or all inline ("Status: Active"). | walk: label position per control in a row | mixed |
| C4 | Empty never looks filled: placeholders and "no value" states use the muted token and words ("Any date"), never format masks (`mm/dd/yyyy`) or grey digits. | walk: no `input[type=date]` showing a mask; contrast of placeholder vs value | a mask or a placeholder at value contrast |
| C5 | Icon buttons have an accessible name and a 44 px target on touch widths. | axe + walk | no name, or < 44 px at 390 |

## 2. Tokens, not literals
| ID | Rule | Check | Fails when |
|---|---|---|---|
| T1 | Colours, font sizes, radii, spacing and fonts come from tokens (CSS variables generated from the DTCG source). | stylelint (`color-no-hex`, `declaration-property-value-disallowed-list` for px font-size), ESLint on inline `style` literals | a literal in new code |
| T2 | One UI font stack for en, pl, ua and ru, with the same heights in every language. | walk in 4 locales, including the longest Polish and Russian labels: computed font-family identical; control heights identical | differs |
| T3 | Signal red is used under the Signal Budget (website) and status colours by meaning (admin). | review + walk (count of red fills per viewport) | over budget |

## 3. Stability: no jumps, flicker or piece-by-piece assembly
| ID | Rule | Check | Fails when |
|---|---|---|---|
| S1 | No layout shift while loading, filtering, paginating, expanding or switching tabs. | walk: CLS from `PerformanceObserver('layout-shift')` over the interaction, plus element box diffs | CLS > 0.01 or any row header moves |
| S2 | Loading keeps the shape: a skeleton of the final size, or the previous content dimmed. Never an empty area that grows. | walk: container height before and after | height changes by > 2 px |
| S3 | Tabs and panels keep their width when switching. | walk | width changes |
| S4 | Fonts do not swap visibly: no FOIT or FOUT on controls. | walk: `document.fonts` ready before first paint of controls, or a metric-compatible fallback | swap observed |
| S5 | "Updated hh:mm" and counts never change the width of their row: tabular numbers and a reserved width. | walk: row width before and after an update and a count change | width changes |

## 4. Every action answers at once, in words
| ID | Rule | Check | Fails when |
|---|---|---|---|
| A1 | A pressed button shows progress within 100 ms (spinner, or a disabled state with words) until the work ends. | walk: state after click at 100 ms | no change |
| A2 | Every failure says what went wrong and what to do, in the account's language. No raw server strings, no HTTP codes alone, and a "session ended" message only for a real session end. | walk with injected 401, 403, 500, timeout and offline; text check | generic, raw, or untrue |
| A3 | No hidden waits: a data pull longer than 1 s shows progress (counts or steps), and a long list read shows what is loading. | walk with a slowed API | silent wait > 1 s |
| A4 | No live-looking control that does nothing. No disabled or duplicate menu items without a reason shown. | review + walk (click every enabled control and expect an effect) | a no-op control |

## 5. Lists and statuses
| ID | Rule | Check | Fails when |
|---|---|---|---|
| L1 | A status is clear at a glance: one word per status across the badge, filter and steps; colour is never the only signal. **Status colours (admin and portal): green = done; blue = in progress / waiting on others; amber = "needs you", ALWAYS with the words of what to do; red = blocked / do not.** | unit test on the status vocabulary + walk (every amber element has an action phrase) + review | two words for one state; colour only; amber without an action in words |
| L2 | The customer sees everything about their load on the row: photos, BOL and links, without expanding. | walk on a seeded load with evidence | needs an expand |
| L3 | Columns fit their content: full names, no truncation of identifiers, no file names under thumbnails. | walk: `scrollWidth > clientWidth` on identifier cells | truncated identifier |
| L4 | Narrow widths look designed: 390 and 768 layouts are their own, with no horizontal scroll, and nothing swells into a blob. | walk at 390, 768, 1280, 1440 and 1920 | horizontal scroll, or overlap |
| L5 | Lists are live: no Refresh button as the way to see new data. A small ↻ with "Updated hh:mm" is allowed as a secondary control. | review | a primary Refresh |

## 6. Forms and settings
| ID | Rule | Check | Fails when |
|---|---|---|---|
| F1 | Mandatory steps are numbered, and the current step is visible. | review | unnumbered required flow |
| F2 | Settings are always-visible blocks, grouped in one place. Each option says what it changes, and each meaning has a "?" tooltip. | review + walk (every setting has a description node) | missing description |
| F3 | No duplicated information, fields or buttons on one screen. | review + walk (duplicate accessible names in one region) | duplicate |
| F4 | Frequent operator actions take one step, never an over-detailed modal. | review | — |
| F5 | Fields align in columns, groups are symmetric, and forms look the same across screens. **Exception: the CD price dialog's equal-weight buttons with no primary choice are a deliberate safety ruling (AFPS1 CDPRICE: the safe default changes nothing); do not flag them. Its dense facts block is still in scope.** | shot + review | — |

## 7. Accessibility and language
| ID | Rule | Check | Fails when |
|---|---|---|---|
| X1 | axe-core: zero serious or critical violations. | walk | any |
| X2 | Visible `:focus-visible` on every interactive element. On the website: a 2 px red outline, offset 2, for keyboard focus; a field focused by the page on load shows a neutral ring until the person acts. **Admin app: the focus colour is its own token and never the error colour.** | walk: autofocus plus screenshot review; token check | missing; a red ring on load; an admin focus ring in the error colour |
| X3 | `<html lang>` follows the account's language, and screen readers hear the right language. | walk after a language switch | stays `en` |
| X4 | Copy has no em dashes on customer surfaces (website rule) and parity in en, pl, ua and ru. | locale tests | em dash; missing key |

## 8. Process
| ID | Rule | Check |
|---|---|---|
| P1 | Design first, for **new screens and visible layout changes**: coded only after Sergii approves an HTML mockup built from the real tokens, and the build is diffed against it. Bug fixes and copy fixes need no mockup. | PR template link to the approved mockup (or "bug/copy fix") |
| P2 | Every PR attaches shots at 1440 and 390, in en and ru, before and after. | CI artifact |
| P3 | The robot reviewer's report (C, T, S, A, L, F, X) is attached to the STOP. | CI |
