import '../tokens/dist/site.scoped.css';
import '../tokens/dist/admin.scoped.css';
import '../src/styles/base.css';
import './canvas.css';
import { Y7Provider } from '../src/index.js';

export default {
  globalTypes: {
    theme: { description: 'Theme (site = Dispatch Board paper, admin = TRANSPORT dark)', toolbar: { title: 'Theme', icon: 'paintbrush', items: [{ value: 'site', title: 'site' }, { value: 'admin', title: 'admin' }], dynamicTitle: true } },
    locale: { description: 'Locale', toolbar: { title: 'Locale', icon: 'globe', items: [{ value: 'en', title: 'English' }, { value: 'pl', title: 'Polski' }, { value: 'uk', title: 'Українська' }, { value: 'ru', title: 'Русский' }], dynamicTitle: true } },
  },
  initialGlobals: { theme: 'site', locale: 'en' },
  parameters: {
    layout: 'fullscreen',
    backgrounds: { disable: true },
    // X1: axe-core, zero serious/critical. `test: 'error'` fails the story in the test runner and marks it in the panel.
    a11y: { test: 'error', options: { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] } } },
  },
  decorators: [
    (Story, ctx) => (
      // The Provider renders no element (ruling 7); the canvas is Storybook's own, so a story is judged on its theme's page
      <Y7Provider theme={ctx.globals.theme} locale={ctx.globals.locale}>
        <div className="y7-sb-canvas" lang={ctx.globals.locale}><Story /></div>
      </Y7Provider>
    ),
  ],
};
