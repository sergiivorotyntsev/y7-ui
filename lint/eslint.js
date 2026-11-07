// ESLint flat-config gate (C1, T1) for the apps. Usage in an app's eslint.config.js:
//   import { y7ESLint } from '@sergiivorotyntsev/y7-ui/eslint';
//   export default [ ...y7ESLint({ level: 'warn', files: ['src/**/*.{js,jsx}'] }),          // old code warns
//                    ...y7ESLint({ level: 'error', files: ['src/portal/loads/**/*.jsx'] }) ]; // new code errors
// Requires eslint-plugin-react in the app (it is a peer of this config, not bundled).
import react from 'eslint-plugin-react';

const SIZE_PROPS = '^(fontSize|lineHeight|padding(Top|Right|Bottom|Left|Inline|Block|InlineStart|InlineEnd|BlockStart|BlockEnd)?|margin(Top|Right|Bottom|Left|Inline|Block|InlineStart|InlineEnd|BlockStart|BlockEnd)?|gap|rowGap|columnGap|borderRadius|width|height|minWidth|minHeight|maxWidth|maxHeight|inlineSize|blockSize)$';
const COLOR_PROPS = '^(color|background|backgroundColor|border|borderColor|borderTop|borderRight|borderBottom|borderLeft|outline|outlineColor|fill|stroke|boxShadow|textDecorationColor|caretColor|accentColor)$';
const COLOR_LITERAL = '^(.*(#[0-9a-fA-F]{3,8}\\b|\\brgba?\\(|\\bhsla?\\(|\\boklch\\(|\\bcolor-mix\\().*)$';
const NAMED_COLORS = '^(white|black|red|blue|green|gray|grey|orange|yellow|amber|silver|navy|teal|purple|pink|brown|crimson|tomato|gold|ivory|beige|maroon)$';
const PX = '^-?\\d+(\\.\\d+)?(px|rem|em)$';

/** Restricted JSX syntax: native date-like inputs; colour and size literals inside style={{}} objects. */
export const restrictedSyntax = [
  { selector: 'JSXOpeningElement[name.name="input"] > JSXAttribute[name.name="type"] > Literal[value=/^(date|datetime-local|month|time|week)$/]', message: 'C1/C4: use DateRange from @sergiivorotyntsev/y7-ui; a native date input shows a mm/dd/yyyy mask.' },
  { selector: 'JSXOpeningElement[name.name="dialog"]', message: 'C1: use Dialog or SidePanel from @sergiivorotyntsev/y7-ui.' },
  { selector: `JSXAttribute[name.name="style"] ObjectExpression > Property[key.name=/${COLOR_PROPS}/] > Literal[value=/${COLOR_LITERAL}/]`, message: 'T1: no colour literals in style; read a token: var(--y7-...) or cssVar() from @sergiivorotyntsev/y7-ui/tokens.' },
  { selector: `JSXAttribute[name.name="style"] ObjectExpression > Property[key.name=/${COLOR_PROPS}/] > Literal[value=/${NAMED_COLORS}/]`, message: 'T1: no named colours in style; read a token.' },
  { selector: `JSXAttribute[name.name="style"] ObjectExpression > Property[key.name=/${COLOR_PROPS}/] > TemplateLiteral > TemplateElement[value.raw=/${COLOR_LITERAL}/]`, message: 'T1: no colour literals in style template strings; read a token.' },
  { selector: `JSXAttribute[name.name="style"] ObjectExpression > Property[key.name=/${SIZE_PROPS}/] > Literal[value=/${PX}/]`, message: 'T1: no px/rem size literals in style; read a space, size or font-size token.' },
  { selector: `JSXAttribute[name.name="style"] ObjectExpression > Property[key.name=/${SIZE_PROPS}/] > Literal[value=type(number)][value!=0]`, message: 'T1: no numeric size literals in style; read a space, size or font-size token.' },
];

export const rules = {
  'react/forbid-elements': ['error', { forbid: [
    { element: 'button', message: 'C1: use Button or IconButton from @sergiivorotyntsev/y7-ui.' },
    { element: 'select', message: 'C1: use Select from @sergiivorotyntsev/y7-ui.' },
    { element: 'dialog', message: 'C1: use Dialog or SidePanel from @sergiivorotyntsev/y7-ui.' },
  ] }],
  'no-restricted-syntax': ['error', ...restrictedSyntax],
};

const withLevel = (level) => Object.fromEntries(Object.entries(rules).map(([k, v]) => [k, [level, ...v.slice(1)]]));

/**
 * Returns flat-config objects. options.level 'warn' | 'error'; options.files globs; options.allow globs where the
 * rules are off (the library's own primitives folder is always allowed when the app lints node_modules, which it should not).
 */
export function y7ESLint({ level = 'error', files = ['**/*.{js,jsx,mjs,cjs,ts,tsx}'], allow = [] } = {}) {
  const configs = [{
    name: `y7-ui/gates (${level})`,
    files,
    plugins: { react },
    settings: { react: { version: 'detect' } },
    rules: withLevel(level),
  }];
  if (allow.length) configs.push({ name: 'y7-ui/gates allow-list', files: allow, rules: { 'react/forbid-elements': 'off', 'no-restricted-syntax': 'off' } });
  return configs;
}

export default y7ESLint;
