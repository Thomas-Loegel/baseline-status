import type { WebStatusFeature } from './types';

/** Échappe les caractères HTML dangereux avant insertion dans innerHTML. */
export function esc(str: unknown): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Renvoie l'URL échappée si (et seulement si) c'est une URL https valide,
 * sinon le fallback. Empêche les schémas type `javascript:`.
 */
export function safeUrl(url: string | undefined, fallback: string): string {
  try {
    const u = new URL(url ?? '');
    return u.protocol === 'https:' ? esc(url) : fallback;
  } catch {
    return fallback;
  }
}

/** Extrait l'année d'une date ISO, ou '' si absente/invalide. */
export function toYear(iso?: string): string {
  if (!iso) return '';
  const year = new Date(iso).getFullYear();
  return Number.isNaN(year) ? '' : String(year);
}

export type BrowserSupport = 'available' | 'unavailable' | 'no_data';

/** Détermine l'état de support d'un navigateur donné pour une feature. */
export function getBrowserStatus(feature: WebStatusFeature, browserId: string): BrowserSupport {
  try {
    const impl = feature.browser_implementations?.[browserId];
    if (!impl) return 'unavailable';
    return impl.status === 'available' ? 'available' : 'unavailable';
  } catch {
    return 'no_data';
  }
}
