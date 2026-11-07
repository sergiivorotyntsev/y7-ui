/** Storybook 10, Vite builder. Static build only (`npm run build-storybook`); never hosted. */
export default {
  framework: '@storybook/react-vite',
  stories: ['../stories/**/*.stories.@(js|jsx)'],
  addons: ['@storybook/addon-a11y'],
  core: { disableTelemetry: true },
};
