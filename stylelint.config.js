// The library's own Stylelint: the shipped gate, at error level. Token files (tokens/dist) are the one legal home of literals.
import y7 from './lint/stylelint.cjs';

export default {
  plugins: y7.plugins,
  rules: y7.rules,
  ignoreFiles: ['tokens/dist/**', 'node_modules/**', 'storybook-static/**'],
};
