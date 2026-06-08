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
    container-type: inline-size;
    font-family: var(--bs-font, system-ui, -apple-system, sans-serif);
    font-size: 16px;
    color: inherit;
    max-width: 700px;
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
  .widget {
    border: 1px solid var(--bs-border, light-dark(#d9d9d9, #3a3a3a));
    border-radius: var(--bs-radius, 12px);
    background: var(--bs-bg, transparent);
  }
  .widget--simple .status-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
  }
  details.widget summary {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 16px;
    padding: 14px 20px;
    cursor: pointer;
    list-style: none;
    user-select: none;
  }
  details.widget summary::-webkit-details-marker { display: none; }
  details.widget summary:hover { background: var(--bs-hover, light-dark(rgba(0,0,0,.03), rgba(255,255,255,.04))); }
  .title-row {
    grid-column: 1 / 3;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .info {
    grid-column: 1 / 3;
    display: grid;
    gap: 12px;
    align-self: start;

    @media (min-width: 500px) {
      grid-column: auto;
    }
  }
  .badge {
    display: inline-block;
    max-width: 100%;
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: .04em;
    padding: 2px 7px;
    border-radius: 4px;
    flex-shrink: 0;
    box-sizing: border-box;
  }
  .title {
    font-size: 18px;
    font-weight: 500;
  }
  .badges-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: start;
  }
  .newly-chip {
    display: inline-block;
    max-width: 100%;
    box-sizing: border-box;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: #fff;
    padding: 2px 7px;
    border-radius: 4px;
  }
  .feature-name {
    font-size: 14px;
  }
  .browsers {
    grid-column: 1 / 3;
    display: flex;
    gap: 6px;
    justify-content: start;

    @media (min-width: 500px) {
      grid-column: auto;
      justify-content: end;
      align-self: start;
    }
  }
  .browser-item {
    display: flex;
    align-items: flex-end;
  }
  .browser-icon svg { display: block; height: 32px; width: auto; }
  .browser-support svg { display: block; height: 32px; width: auto; }

  .chevron {
    flex-shrink: 0;
    color: var(--bs-muted, light-dark(#888, #666));
    transition: transform .2s ease;
  }
  .chevron svg { display: block; width: 16px; height: 16px; }
  details[open] .chevron { transform: rotate(180deg); }
  .expandable {
    padding: 14px 20px 16px;
    border-top: 1px solid var(--bs-border, light-dark(#d9d9d9, #3a3a3a));
  }
  .desc {
    font-size: 14px;
    line-height: 1.6;
    margin: 0 0 12px;
  }
  .link {
    font-size: 13px;
    color: var(--bs-link, light-dark(#1a73e8, #5aa1ff));
    text-decoration: none;
  }
  .link:hover { text-decoration: underline; }
`;
