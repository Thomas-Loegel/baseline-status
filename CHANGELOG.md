# Changelog

## 1.1.0

### Minor Changes

- Add `lang` attribute for UI label internationalization (i18n).

  The component now accepts a `lang` attribute (`"en"` | `"fr"`, default `"en"`) that translates all hardcoded UI labels: status titles and descriptions, browser support aria-labels, chip text, and link labels. Data from the API (feature name, browser versions) is unaffected. Unknown locales fall back to `"en"`; region subtags are normalized (`fr-FR` → `fr`).

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-06-02

### Added

- `<baseline-status>` web component displaying the [Baseline](https://web.dev/baseline) status of a web platform feature
- Data fetched from `api.webstatus.dev` — zero runtime dependencies
- Four status levels: `widely` available, `newly` available, `limited` support, `loading`/`error` states
- Browser support grid for Chrome, Edge, Firefox and Safari with version badges
- Auto-registration on import; `register(tagName)` export for a custom element name
- Theming via CSS custom properties (`--baseline-font-family`, `--baseline-border-radius`, `--baseline-font-size`)
- Accessible markup: `aria-live` region, `<details>` for browser breakdown, `role="list"` grid
- XSS-safe: all remote data escaped via `esc()`, all links validated via `safeUrl()`
- SSR-safe: guarded `typeof CSSStyleSheet` check, no crash in Node environments
- TypeScript types exported: `WebStatusFeature`, `BaselineLevel`, `WidgetStatus`
- ESM (`.js`) and UMD (`.cjs`) builds with bundled type declarations (`.d.ts`)
