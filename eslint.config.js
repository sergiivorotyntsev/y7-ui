// The library's own lint: its gates applied to itself. The primitives folder is where the raw elements legally live,
// so react/forbid-elements is off there, while the token/literal rules stay on (component CSS and JSX carry no literals).
import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import { y7ESLint } from './lint/eslint.js';

export default [
  { ignores: ['node_modules/**', 'storybook-static/**', 'tokens/dist/**', 'coverage/**'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    plugins: { react },
    languageOptions: { ecmaVersion: 2024, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } }, globals: { ...globals.browser, ...globals.node } },
    settings: { react: { version: 'detect' } },
    rules: { ...react.configs.flat['jsx-runtime'].rules, 'react/jsx-uses-vars': 'error', 'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }] },
  },
  ...y7ESLint({ level: 'error', files: ['src/**/*.{js,jsx}', 'stories/**/*.{js,jsx}', '.storybook/**/*.{js,jsx}'] }),
  // The primitives wrap React Aria components, not raw <button>/<select>; Table/TableRow use <table> markup only.
  { files: ['src/primitives/**/*.jsx'], rules: { 'react/forbid-elements': 'off' } },
  { files: ['lint/stylelint.cjs'], languageOptions: { sourceType: 'commonjs' } },
];
