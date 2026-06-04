import { describe, expect, it } from 'vitest';
import { getTranslations, translations } from '../src/i18n';
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
    expect(getTranslations('en')).toBe(translations.en);
  });
  it('retourne les traductions françaises pour "fr"', () => {
    expect(getTranslations('fr')).toBe(translations.fr);
  });
  it('normalise les locales avec région ("fr-FR" → "fr")', () => {
    expect(getTranslations('fr-FR')).toBe(translations.fr);
  });
  it('normalise la casse ("FR" → "fr")', () => {
    expect(getTranslations('FR')).toBe(translations.fr);
  });
  it('revient sur "en" pour une locale inconnue', () => {
    expect(getTranslations('zh')).toBe(translations.en);
  });
  it('chaque locale couvre tous les statuts requis', () => {
    const required = [
      'limited',
      'newly',
      'widely',
      'loading',
      'error',
      'unknown',
    ];
    for (const [locale, t] of Object.entries(translations)) {
      for (const status of required) {
        expect(t.status[status], `${locale}.status.${status}`).toBeDefined();
        expect(
          typeof t.status[status].title,
          `${locale}.status.${status}.title`,
        ).toBe('string');
        expect(
          typeof t.status[status].desc,
          `${locale}.status.${status}.desc`,
        ).toBe('string');
      }
    }
  });
  it('chaque locale a les champs UI requis', () => {
    const uiFields = [
      'newlyChip',
      'browsersLabel',
      'versionSince',
      'link',
      'newTab',
    ] as const;
    for (const [locale, t] of Object.entries(translations)) {
      for (const field of uiFields) {
        expect(typeof t[field], `${locale}.${field}`).toBe('string');
      }
      const support = ['available', 'unavailable', 'unknown'] as const;
      for (const key of support) {
        expect(
          typeof t.browserSupport[key],
          `${locale}.browserSupport.${key}`,
        ).toBe('string');
      }
    }
  });
});
