export interface Translations {
  status: Record<string, { title: string; desc: string }>;
  newlyChip: string;
  browsersLabel: string;
  browserSupport: { available: string; unavailable: string; unknown: string };
  versionSince: string;
  link: string;
  newTab: string;
}

const translations: Record<string, Translations> = {
  en: {
    status: {
      limited: {
        title: 'Limited availability',
        desc: 'This feature is not Baseline because it does not work in some commonly-used browsers.',
      },
      newly: {
        title: 'Newly available',
        desc: 'Since this feature became Baseline, it now works across the latest devices and browser versions.',
      },
      widely: {
        title: 'Widely available',
        desc: 'This feature is well established and works across many devices and browser versions.',
      },
      loading: { title: 'Loading…', desc: '' },
      error: {
        title: 'Failed to load',
        desc: 'Could not retrieve feature data.',
      },
      unknown: {
        title: 'Unknown availability',
        desc: 'No browser support data available.',
      },
    },
    newlyChip: 'Newly available',
    browsersLabel: 'Browser support',
    browserSupport: {
      available: 'supported',
      unavailable: 'not supported',
      unknown: 'unknown',
    },
    versionSince: 'since v',
    link: 'View on webstatus.dev',
    newTab: '(new tab)',
  },
};

/** Registers a locale so the component can use it via the `lang` attribute. */
export function registerTranslations(lang: string, t: Translations): void {
  translations[lang.split('-')[0].toLowerCase()] = t;
}

/** Returns translations for the given locale, falling back to `en`. */
export function getTranslations(lang: string): Translations {
  const normalized = lang.split('-')[0].toLowerCase();
  return translations[normalized] ?? translations.en;
}
