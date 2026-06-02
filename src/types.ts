/** Niveau Baseline renvoyé par l'API webstatus.dev. */
export type BaselineLevel = 'limited' | 'newly' | 'widely';

/** État interne du widget (inclut les états transitoires). */
export type WidgetStatus = BaselineLevel | 'loading' | 'error' | 'unknown';

export interface BrowserImplementation {
  status?: string;
  version?: string;
  date?: string;
}

/**
 * Forme (partielle) d'une feature renvoyée par
 * `https://api.webstatus.dev/v1/features/{id}`.
 * Tous les champs sont optionnels : c'est de la donnée externe, on ne fait
 * jamais confiance à sa présence.
 */
export interface WebStatusFeature {
  feature_id?: string;
  name?: string;
  baseline?: {
    status?: BaselineLevel | string;
    low_date?: string;
    high_date?: string;
  };
  browser_implementations?: Record<string, BrowserImplementation>;
  spec?: {
    links?: Array<{ link?: string }>;
  };
}
