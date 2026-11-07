import * as site from '../tokens/dist/site.js';

export default { title: 'Tokens/Colour', parameters: { docs: { description: { component: 'Semantic colour tokens as the active theme resolves them. Switch the theme in the toolbar.' } } } };

const names = Object.keys(site.tokens).filter((k) => k.startsWith('color-') && !k.endsWith('gradient'));
export const Swatches = {
  render: () => (
    <div className="y7-sb-swatches">
      {names.map((n) => <div key={n} className="y7-sb-swatch"><span style={{ backgroundColor: `var(--y7-${n})` }} /><code>{n}</code></div>)}
    </div>
  ),
};
