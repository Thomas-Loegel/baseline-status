import type { WidgetStatus } from './types';

export const STATUS_COLORS: Record<WidgetStatus, string> = {
  limited: 'var(--bs-color-limited, #ea8600)',
  newly: 'var(--bs-color-newly,   #1a73e8)',
  widely: 'var(--bs-color-widely,  #1e8e3e)',
  unknown: 'var(--bs-color-unknown, #707070)',
  loading: 'var(--bs-color-unknown, #707070)',
  error: 'var(--bs-color-limited, #ea8600)',
};

/* ─── Styles (Shadow DOM, isolés) ─── */
export const STYLES = `
  :host {
    display: block;
    font-family: var(--bs-font, system-ui, -apple-system, sans-serif);
    font-size: 14px;
    color: inherit;
  }
  .visually-hidden {
    position: absolute;
    width: 1px; height: 1px;
    padding: 0; margin: -1px;
    overflow: hidden;
    clip: rect(0,0,0,0);
    white-space: nowrap;
    border: 0;
  }

  /* Widget container */
  .widget {
    border: 1px solid var(--bs-border, light-dark(#d9d9d9, #3a3a3a));
    border-radius: var(--bs-radius, 12px);
    background: var(--bs-bg, transparent);
    overflow: hidden;
  }

  /* Simple state (loading / error / unknown) */
  .widget--simple .status-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
  }

  /* Details / Summary (data states) */
  details.widget summary {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    cursor: pointer;
    list-style: none;
    user-select: none;
  }
  details.widget summary::-webkit-details-marker { display: none; }
  details.widget summary:hover { background: var(--bs-hover, light-dark(rgba(0,0,0,.03), rgba(255,255,255,.04))); }

  /* Status icon */
  .status-icon { flex-shrink: 0; display: flex; align-items: center; }
  .status-icon svg { width: var(--bs-status-icon-size, 22px); height: var(--bs-status-icon-size, 22px); }

  /* Info (title + badge + feature name) */
  .info { flex: 1; min-width: 0; }
  .title-row {
    display: flex;
    align-items: center;
    gap: 7px;
    flex-wrap: wrap;
  }
  .badge {
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .04em;
    padding: 2px 7px;
    border-radius: 4px;
    flex-shrink: 0;
  }
  .title { font-size: 14px; font-weight: 500; }
  .newly-chip {
    display: inline-block;
    margin-top: 5px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: #fff;
    padding: 2px 7px;
    border-radius: 4px;
  }
  .feature-name { font-size: 12px; opacity: .55; margin-top: 2px; }

  /* Browser row */
  .browsers {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
  }
  .browser-item {
    display: flex;
    align-items: flex-end;
    gap: 1px;
  }
  .browser-icon svg { display: block; height: var(--bs-browser-icon-size, 21px); width: auto; }
  .browser-support svg { display: block; height: var(--bs-support-icon-size, var(--bs-browser-icon-size, 21px)); width: auto; }

  /* Chevron */
  .chevron {
    flex-shrink: 0;
    color: var(--bs-muted, light-dark(#888, #666));
    transition: transform .2s ease;
  }
  .chevron svg { display: block; width: 16px; height: 16px; }
  details[open] .chevron { transform: rotate(180deg); }

  /* Expandable section */
  .expandable {
    padding: 14px 20px 16px;
    border-top: 1px solid var(--bs-border, light-dark(#d9d9d9, #3a3a3a));
  }
  .desc {
    font-size: 13px;
    line-height: 1.6;
    opacity: .75;
    margin: 0 0 12px;
  }
  .link {
    font-size: 12px;
    color: var(--bs-link, light-dark(#1a73e8, #5aa1ff));
    text-decoration: none;
  }
  .link:hover { text-decoration: underline; }
`;
