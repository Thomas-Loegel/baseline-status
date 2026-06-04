import { STATUS_COLORS, STYLES } from './constants';
import type { Translations } from './i18n';
import { getTranslations } from './i18n';
import {
  BROWSER_ICONS,
  BROWSER_NAMES,
  CHEVRON_ICON,
  getStatusIcon,
  SUPPORT_ICONS,
} from './icons';
import type { WebStatusFeature, WidgetStatus } from './types';
import { esc, getBrowserStatus, safeUrl, toYear } from './utils';

const API = 'https://api.webstatus.dev/v1/features/';
const BROWSERS = ['chrome', 'edge', 'firefox', 'safari'] as const;

/* ─── Rendu ─── */

function renderBrowsers(
  feature: WebStatusFeature,
  color: string,
  t: Translations,
): string {
  return BROWSERS.map((b) => {
    const st = getBrowserStatus(feature, b);
    const version = feature?.browser_implementations?.[b]?.version ?? '';
    const supportIcon = SUPPORT_ICONS[st] ?? SUPPORT_ICONS.no_data;
    const iconColor =
      st === 'available' ? color : st === 'unavailable' ? '#ea8600' : '#aaa';
    const statusLabel =
      st === 'available'
        ? t.browserSupport.available
        : st === 'unavailable'
          ? t.browserSupport.unavailable
          : t.browserSupport.unknown;
    const versionLabel = version ? ` ${t.versionSince}${esc(version)}` : '';

    return `
      <div class="browser-item" role="listitem" aria-label="${BROWSER_NAMES[b]} : ${statusLabel}${versionLabel}">
        <span class="browser-icon" aria-hidden="true">${BROWSER_ICONS[b]}</span>
        <span class="browser-support" style="color:${iconColor}" aria-hidden="true">${supportIcon}</span>
      </div>`;
  }).join('');
}

function renderStatusIcon(status: WidgetStatus, color: string): string {
  const statusMap: Record<
    WidgetStatus,
    'loading' | 'error' | 'unknown' | 'limited' | 'available'
  > = {
    loading: 'loading',
    error: 'error',
    unknown: 'unknown',
    limited: 'limited',
    newly: 'available',
    widely: 'available',
  };
  return getStatusIcon(statusMap[status], color);
}

function renderWidget(
  feature: WebStatusFeature | null,
  status: WidgetStatus,
  t: Translations,
): string {
  const statusLabel = t.status[status] ?? t.status.unknown;
  const color = STATUS_COLORS[status] || STATUS_COLORS.unknown;
  const featureName = feature?.name ? esc(feature.name) : '';
  const fallbackUrl = `https://webstatus.dev/features/${encodeURIComponent(feature?.feature_id ?? '')}`;
  const wptLink = safeUrl(feature?.spec?.links?.[0]?.link, fallbackUrl);
  const hasData =
    !!feature && !['loading', 'error', 'unknown'].includes(status);

  const titleText =
    status === 'newly' && feature?.baseline?.low_date
      ? `${statusLabel.title} ${toYear(feature.baseline.low_date)}`
      : statusLabel.title;

  const badgeHtml =
    status === 'newly' || status === 'widely'
      ? `<span class="badge" style="background:${color}">Baseline</span>`
      : '';
  const newlyChip =
    status === 'newly'
      ? `<span class="newly-chip" style="background:${color}">${t.newlyChip}</span>`
      : '';

  const statusSection = `
    <span class="status-icon" aria-hidden="true">${renderStatusIcon(status, color)}</span>
    <div class="info">
      <div class="title-row">
        ${badgeHtml}
        <span class="title">${titleText}</span>
      </div>
      ${newlyChip}
      ${featureName ? `<div class="feature-name">${featureName}</div>` : ''}
    </div>`;

  if (!hasData) {
    return `
      <div class="widget widget--simple" part="widget">
        <div class="status-row">${statusSection}</div>
      </div>`;
  }

  const browserRow = renderBrowsers(feature, color, t);

  return `
    <details class="widget" part="widget">
      <summary>
        ${statusSection}
        <div class="browsers" role="list" aria-label="${t.browsersLabel}">${browserRow}</div>
        <span class="chevron" aria-hidden="true">${CHEVRON_ICON}</span>
      </summary>
      <div class="expandable">
        <p class="desc">${statusLabel.desc}</p>
        <a class="link" href="${wptLink}" target="_blank" rel="noopener noreferrer">
          ${t.link}
          <span aria-hidden="true"> ↗</span>
          <span class="visually-hidden">${t.newTab}</span>
        </a>
      </div>
    </details>`;
}

/* ─── Feuille de style construite une seule fois, partagée par toutes les instances ─── */
const sheet = typeof CSSStyleSheet !== 'undefined' ? new CSSStyleSheet() : null;
sheet?.replaceSync(STYLES);

/**
 * `<baseline-status>` — affiche le statut Baseline d'une feature web.
 *
 * @attr featureId - identifiant de la feature (ex. `css-nesting`, `subgrid`).
 * @attr lang      - locale des labels UI (ex. `en`, `fr`). Défaut : `en`.
 *
 * @cssprop --bs-color-limited - couleur de l'état "limited".
 * @cssprop --bs-color-newly   - couleur de l'état "newly".
 * @cssprop --bs-color-widely  - couleur de l'état "widely".
 * @cssprop --bs-color-unknown - couleur de l'état "unknown".
 * @cssprop --bs-radius        - rayon des coins (défaut 12px).
 * @cssprop --bs-font          - police utilisée.
 *
 * @csspart widget - le conteneur principal du widget.
 */
export class BaselineStatus extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['featureid', 'lang'];
  }

  #content: HTMLDivElement;
  #controller: AbortController | null = null;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    if (sheet) shadow.adoptedStyleSheets = [sheet];
    this.#content = document.createElement('div');
    this.#content.setAttribute('aria-live', 'polite');
    this.#content.setAttribute('aria-atomic', 'true');
    shadow.appendChild(this.#content);
  }

  connectedCallback(): void {
    // Defer so registerTranslations() calls in the same module script run first.
    queueMicrotask(() => this.#fetch());
  }

  disconnectedCallback(): void {
    this.#controller?.abort();
  }

  attributeChangedCallback(
    _name: string,
    oldVal: string | null,
    newVal: string | null,
  ): void {
    if (oldVal !== newVal && this.isConnected) this.#fetch();
  }

  /** Identifiant de la feature. Reflète l'attribut `featureId`. */
  get featureId(): string {
    return this.getAttribute('featureid') ?? '';
  }

  set featureId(value: string | null) {
    if (value == null) this.removeAttribute('featureid');
    else this.setAttribute('featureid', value);
  }

  /** Locale des labels UI. Reflète l'attribut `lang`. Défaut : `"en"`. */
  get lang(): string {
    return this.getAttribute('lang') ?? 'en';
  }

  set lang(value: string | null) {
    if (value == null) this.removeAttribute('lang');
    else this.setAttribute('lang', value);
  }

  #render(html: string): void {
    this.#content.innerHTML = html;
  }

  async #fetch(): Promise<void> {
    const t = getTranslations(this.lang);
    const id = this.featureId;
    if (!id) {
      this.#render(renderWidget(null, 'unknown', t));
      return;
    }

    this.#controller?.abort();
    this.#controller = new AbortController();
    this.#render(renderWidget(null, 'loading', t));

    try {
      const res = await fetch(`${API}${encodeURIComponent(id)}`, {
        signal: this.#controller.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as WebStatusFeature;
      this.#render(
        renderWidget(
          data,
          (data?.baseline?.status as WidgetStatus) ?? 'unknown',
          t,
        ),
      );
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      this.#render(renderWidget(null, 'error', t));
    }
  }
}
