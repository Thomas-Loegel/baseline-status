# &lt;baseline-status&gt;

> Zero-dependency web component that displays the **Baseline** status (browser support) of a web platform feature, using the [webstatus.dev](https://webstatus.dev) API.

- 🪶 **Zero runtime dependencies** — standard DOM only.
- 🧩 **Native custom element** — works with any framework, or none.
- 🎨 **Themable** via CSS custom properties (automatic light/dark).
- ♿ **Accessible** — `aria-live`, labels, keyboard navigation (`<details>`).
- 🔒 **Safe** — all remote data is escaped, links are validated (https only).

## Installation

```bash
npm install @thomas-loegel/baseline-status
```

## Usage

### With a bundler (Vite, webpack, esbuild…)

The import auto-registers the element:

```js
import '@thomas-loegel/baseline-status';
```

```html
<baseline-status featureId="css-nesting"></baseline-status>
```

### Without a build step, via CDN

```html
<script type="module">
  import 'https://esm.sh/@thomas-loegel/baseline-status';
</script>

<baseline-status featureId="subgrid"></baseline-status>
```

Or the classic self-executing version (plain `<script>` tag without `type=module`):

```html
<script src="https://cdn.jsdelivr.net/npm/@thomas-loegel/baseline-status"></script>
<baseline-status featureId="has"></baseline-status>
```

## Attributes

| Attribute   | Type     | Default | Description                                                      |
| ----------- | -------- | ------- | ---------------------------------------------------------------- |
| `featureId` | `string` | —       | Feature identifier (e.g. `css-nesting`, `subgrid`, `has`)        |
| `lang`      | `string` | `"en"`  | UI language for labels (see [i18n](#internationalization-i18n))  |

Both attributes reflect as JS properties, useful for dynamic control:

```js
const el = document.querySelector('baseline-status');
el.featureId = 'view-transitions';
el.lang = 'fr';
```

### Internationalization (i18n)

The component ships with English (`en`) as the only built-in locale. All other languages can be added at runtime using `registerTranslations` — this keeps the bundle lean and avoids any opinion on which languages to support.

```js
import { registerTranslations } from '@thomas-loegel/baseline-status';

registerTranslations('fr', {
  status: {
    limited:  { title: 'Disponibilité limitée',    desc: "Cette fonctionnalité n'est pas Baseline car elle ne fonctionne pas dans certains navigateurs courants." },
    newly:    { title: 'Nouvellement disponible',  desc: 'Depuis que cette fonctionnalité est devenue Baseline, elle fonctionne sur les derniers appareils et navigateurs.' },
    widely:   { title: 'Largement disponible',     desc: 'Cette fonctionnalité est bien établie et fonctionne sur de nombreux appareils et navigateurs.' },
    loading:  { title: 'Chargement…',              desc: '' },
    error:    { title: 'Échec du chargement',      desc: 'Impossible de récupérer les données de la fonctionnalité.' },
    unknown:  { title: 'Disponibilité inconnue',   desc: 'Aucune donnée de support navigateur disponible.' },
  },
  newlyChip:      'Nouvellement disponible',
  browsersLabel:  'Support navigateurs',
  browserSupport: { available: 'supporté', unavailable: 'non supporté', unknown: 'inconnu' },
  versionSince:   'depuis v',
  link:           'Voir sur webstatus.dev',
  newTab:         '(nouvel onglet)',
});
```

Then use the `lang` attribute as usual:

```html
<baseline-status featureId="css-nesting" lang="fr"></baseline-status>
```

The `Translations` type is exported for full TypeScript support:

```ts
import { registerTranslations } from '@thomas-loegel/baseline-status';
import type { Translations } from '@thomas-loegel/baseline-status';

const de: Translations = { /* … */ };
registerTranslations('de', de);
```

Any unknown locale falls back to `en`. Region subtags are accepted and normalized (`fr-FR` → `fr`).

## Customization (CSS custom properties)

| Property             | Default              | Role                          |
| -------------------- | -------------------- | ----------------------------- |
| `--bs-color-limited` | `#ea8600`            | Color for the *Limited* state |
| `--bs-color-newly`   | `#1a73e8`            | Color for the *Newly* state   |
| `--bs-color-widely`  | `#1e8e3e`            | Color for the *Widely* state  |
| `--bs-color-unknown` | `#707070`            | Color for the *Unknown* state |
| `--bs-radius`        | `12px`               | Border radius                 |
| `--bs-font`          | `system-ui, …`       | Font family                   |
| `--bs-border`        | `light-dark(…)`      | Border color                  |
| `--bs-bg`            | `transparent`        | Widget background             |

```css
baseline-status {
  --bs-radius: 8px;
  --bs-color-widely: #16a34a;
}
```

The container is also exposed via `::part(widget)`:

```css
baseline-status::part(widget) { box-shadow: 0 1px 3px rgba(0,0,0,.1); }
```

## Framework usage

- **Vanilla / Vue / Svelte / Angular**: works out of the box, `featureId` is a string attribute.
- **React 19+**: native custom element prop support, `<baseline-status featureId="has" />` works.
- **React ≤ 18**: pass the value as an attribute (it's a string, so it's handled), or use a `ref`:

  ```jsx
  const ref = useRef();
  useEffect(() => { ref.current.featureId = 'has'; }, []);
  return <baseline-status ref={ref} />;
  ```

## Security

The component fetches data from `api.webstatus.dev` and injects it into its Shadow DOM. All remote text (feature name, version) is escaped with a dedicated function, and external links are validated (`https:` only, otherwise fallback) — neutralizing HTML injections and `javascript:` scheme attacks.

## Development

```bash
npm run dev        # playground at http://localhost:5173
npm run typecheck  # TypeScript type check
npm run test       # unit tests (vitest)
npm run build      # build to dist/ (ESM + UMD + types)
```

## Acknowledgements

Inspired by [web-platform-dx/baseline-status](https://github.com/web-platform-dx/baseline-status).

## License

MIT
