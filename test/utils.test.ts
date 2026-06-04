import { describe, expect, it } from 'vitest';
import { getTranslations, registerTranslations } from '../src/i18n';
import type { Translations } from '../src/i18n';
import type { WebStatusFeature } from '../src/types';
import { esc, getBrowserStatus, safeUrl, toYear } from '../src/utils';

describe('esc', () => {
  it('échappe les caractères HTML dangereux', () => {
    expect(esc('<img src=x onerror="alert(1)">')).toBe(
      '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;',
    );
  });
  it('gère les valeurs non-string', () => {
    expect(esc(42)).toBe('42');
    expect(esc(null)).toBe('null');
  });
});

describe('safeUrl', () => {
  it('laisse passer une URL https', () => {
    expect(safeUrl('https://example.com/a', 'FB')).toBe(
      'https://example.com/a',
    );
  });
  it('rejette http, javascript: et les URL invalides', () => {
    expect(safeUrl('http://example.com', 'FB')).toBe('FB');
    expect(safeUrl('javascript:alert(1)', 'FB')).toBe('FB');
    expect(safeUrl('pas-une-url', 'FB')).toBe('FB');
    expect(safeUrl(undefined, 'FB')).toBe('FB');
  });
  it('échappe les caractères dangereux dans une URL valide', () => {
    expect(safeUrl('https://e.com/?a="x"', 'FB')).toContain('&quot;');
  });
});

describe('toYear', () => {
  it('extrait l’année', () => {
    expect(toYear('2023-09-12')).toBe('2023');
  });
  it('renvoie une chaîne vide si absent ou invalide', () => {
    expect(toYear(undefined)).toBe('');
    expect(toYear('pas-une-date')).toBe('');
  });
});

describe('getBrowserStatus', () => {
  const feature: WebStatusFeature = {
    browser_implementations: {
      chrome: { status: 'available', version: '112' },
      firefox: { status: 'unavailable' },
    },
  };
  it('détecte le support', () => {
    expect(getBrowserStatus(feature, 'chrome')).toBe('available');
  });
  it('détecte le non-support explicite', () => {
    expect(getBrowserStatus(feature, 'firefox')).toBe('unavailable');
  });
  it('renvoie unavailable pour un navigateur absent', () => {
    expect(getBrowserStatus(feature, 'safari')).toBe('unavailable');
  });
});

describe('getTranslations', () => {
  it('retourne les traductions anglaises pour "en"', () => {
    const en = getTranslations('en');
    expect(en.newlyChip).toBe('Newly available');
  });
  it('revient sur "en" pour une locale inconnue', () => {
    const en = getTranslations('en');
    expect(getTranslations('zh')).toBe(en);
  });
  it('registerTranslations enregistre et retourne une nouvelle locale', () => {
    const de: Translations = {
      status: {
        limited: { title: 'Eingeschränkte Verfügbarkeit', desc: 'desc' },
        newly: { title: 'Neu verfügbar', desc: 'desc' },
        widely: { title: 'Weit verfügbar', desc: 'desc' },
        loading: { title: 'Laden…', desc: '' },
        error: { title: 'Fehler', desc: 'desc' },
        unknown: { title: 'Unbekannt', desc: 'desc' },
      },
      newlyChip: 'Neu verfügbar',
      browsersLabel: 'Browserunterstützung',
      browserSupport: { available: 'unterstützt', unavailable: 'nicht unterstützt', unknown: 'unbekannt' },
      versionSince: 'seit v',
      link: 'Auf webstatus.dev ansehen',
      newTab: '(neues Tab)',
    };
    registerTranslations('de', de);
    expect(getTranslations('de')).toBe(de);
  });
  it('normalise les locales avec région ("de-DE" → "de")', () => {
    expect(getTranslations('de-DE')).toBe(getTranslations('de'));
  });
  it('normalise la casse ("DE" → "de")', () => {
    expect(getTranslations('DE')).toBe(getTranslations('de'));
  });
  it('les traductions "en" couvrent tous les statuts requis', () => {
    const required = ['limited', 'newly', 'widely', 'loading', 'error', 'unknown'];
    const t = getTranslations('en');
    for (const status of required) {
      expect(t.status[status], `en.status.${status}`).toBeDefined();
      expect(typeof t.status[status].title, `en.status.${status}.title`).toBe('string');
      expect(typeof t.status[status].desc, `en.status.${status}.desc`).toBe('string');
    }
  });
  it('les traductions "en" ont les champs UI requis', () => {
    const uiFields = ['newlyChip', 'browsersLabel', 'versionSince', 'link', 'newTab'] as const;
    const t = getTranslations('en');
    for (const field of uiFields) {
      expect(typeof t[field], `en.${field}`).toBe('string');
    }
    const support = ['available', 'unavailable', 'unknown'] as const;
    for (const key of support) {
      expect(typeof t.browserSupport[key], `en.browserSupport.${key}`).toBe('string');
    }
  });
});
