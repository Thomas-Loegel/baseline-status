import type { WebStatusFeature, WidgetStatus } from './types';
import { esc, safeUrl, toYear, getBrowserStatus } from './utils';
import { LABELS, STATUS_COLORS, STYLES } from './constants';
import { BROWSER_ICONS, BROWSER_NAMES, SUPPORT_ICONS, CHEVRON_ICON } from './icons';

const API = 'https://api.webstatus.dev/v1/features/';
const BROWSERS = ['chrome', 'edge', 'firefox', 'safari'] as const;

/* ─── Rendu ─── */

function renderBrowsers(feature: WebStatusFeature, color: string): string {
  return BROWSERS.map((b) => {
    const st = getBrowserStatus(feature, b);
    const version = feature?.browser_implementations?.[b]?.version ?? '';
    const supportIcon = SUPPORT_ICONS[st] ?? SUPPORT_ICONS.no_data;
    const iconColor = st === 'available' ? color : st === 'unavailable' ? '#ea8600' : '#aaa';
    const statusLabel = st === 'available' ? 'supporté' : st === 'unavailable' ? 'non supporté' : 'inconnu';
    const versionLabel = version ? ` depuis v${esc(version)}` : '';

    return `
      <div class="browser-item" role="listitem" aria-label="${BROWSER_NAMES[b]} : ${statusLabel}${versionLabel}">
        <span class="browser-icon" aria-hidden="true">${BROWSER_ICONS[b]}</span>
        <span class="browser-support" style="color:${iconColor}" aria-hidden="true">${supportIcon}</span>
      </div>`;
  }).join('');
}

function renderStatusIcon(status: WidgetStatus, color: string): string {
  if (status === 'loading')
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2" stroke-dasharray="31.4" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/></circle></svg>`;
  if (status === 'error' || status === 'unknown')
    return `<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="1.5"/><path stroke="${color}" stroke-linecap="round" stroke-width="2" d="M12 8v4m0 4h.01"/></svg>`;
  if (status === 'limited')
    return `<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="${color}" stroke-linejoin="round" stroke-width="1.5" d="M12 3 2 20h20z"/><path stroke="${color}" stroke-linecap="round" stroke-width="2" d="M12 10v4m0 3h.01"/></svg>`;
  return `<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="1.5"/><path stroke="${color}" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7.5 12.5 3 3 6-6"/></svg>`;
}

function renderWidget(feature: WebStatusFeature | null, status: WidgetStatus): string {
  const label = LABELS[status] || LABELS.unknown;
  const color = STATUS_COLORS[status] || STATUS_COLORS.unknown;
  const featureName = feature?.name ? esc(feature.name) : '';
  const fallbackUrl = `https://webstatus.dev/features/${encodeURIComponent(feature?.feature_id ?? '')}`;
  const wptLink = safeUrl(feature?.spec?.links?.[0]?.link, fallbackUrl);
  const hasData = !!feature && !['loading', 'error', 'unknown'].includes(status);

  const titleText =
    status === 'newly' && feature?.baseline?.low_date
      ? `${label.title} ${toYear(feature.baseline.low_date)}`
      : label.title;

  const badgeHtml = label.badge ? `<span class="badge" style="background:${color}">${label.badge}</span>` : '';
  const newlyChip = status === 'newly' ? `<span class="newly-chip" style="background:${color}">Newly available</span>` : '';

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

  const browserRow = renderBrowsers(feature, color);

  return `
    <details class="widget" part="widget">
      <summary>
        ${statusSection}
        <div class="browsers" role="list" aria-label="Support navigateurs">${browserRow}</div>
        <span class="chevron" aria-hidden="true">${CHEVRON_ICON}</span>
      </summary>
      <div class="expandable">
        <p class="desc">${label.desc}</p>
        <a class="link" href="${wptLink}" target="_blank" rel="noopener noreferrer">
          Voir sur webstatus.dev
          <span aria-hidden="true"> ↗</span>
          <span class="visually-hidden">(nouvel onglet)</span>
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
    return ['featureid'];
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
    this.#fetch();
  }

  disconnectedCallback(): void {
    this.#controller?.abort();
  }

  attributeChangedCallback(_name: string, oldVal: string | null, newVal: string | null): void {
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

  #render(html: string): void {
    this.#content.innerHTML = html;
  }

  async #fetch(): Promise<void> {
    const id = this.featureId;
    if (!id) {
      this.#render(renderWidget(null, 'unknown'));
      return;
    }

    this.#controller?.abort();
    this.#controller = new AbortController();
    this.#render(renderWidget(null, 'loading'));

    try {
      const res = await fetch(`${API}${encodeURIComponent(id)}`, { signal: this.#controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as WebStatusFeature;
      this.#render(renderWidget(data, (data?.baseline?.status as WidgetStatus) ?? 'unknown'));
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      this.#render(renderWidget(null, 'error'));
    }
  }
}
