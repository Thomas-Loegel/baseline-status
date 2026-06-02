import { describe, it, expect } from 'vitest';
import { esc, safeUrl, toYear, getBrowserStatus } from '../src/utils';
import type { WebStatusFeature } from '../src/types';

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
    expect(safeUrl('https://example.com/a', 'FB')).toBe('https://example.com/a');
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
