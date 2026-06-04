# Changelog

## 1.2.0

- **feat** — Add `registerTranslations(lang, translations)` function and `Translations` type to support custom language translations. Built-in French translations have been removed from the bundle — register them externally via `registerTranslations('fr', { … })`.
- **feat** — Add CSS custom properties for icon sizing:
  - `--bs-status-icon-size` (default `22px`) — main status icon
  - `--bs-browser-icon-size` (default `21px`) — browser logos
  - `--bs-support-icon-size` (default: follows `--bs-browser-icon-size`) — support check/cross icons
- **fix** — SVG icons: removed hardcoded `width`/`height` attributes and added missing `viewBox` attributes so CSS sizing works correctly across all browsers.

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
