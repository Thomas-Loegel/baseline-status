export interface Translations {
  status: Record<string, { title: string; desc: string }>;
  newlyChip: string;
  browsersLabel: string;
  browserSupport: { available: string; unavailable: string; unknown: string };
  versionSince: string;
  link: string;
  newTab: string;
}

export const translations: Record<string, Translations> = {
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
      error: { title: 'Failed to load', desc: 'Could not retrieve feature data.' },
      unknown: { title: 'Unknown availability', desc: 'No browser support data available.' },
    },
    newlyChip: 'Newly available',
    browsersLabel: 'Browser support',
    browserSupport: { available: 'supported', unavailable: 'not supported', unknown: 'unknown' },
    versionSince: 'since v',
    link: 'View on webstatus.dev',
    newTab: '(new tab)',
  },
  fr: {
    status: {
      limited: {
        title: 'Disponibilité limitée',
        desc: "Cette fonctionnalité n'est pas Baseline car elle ne fonctionne pas dans certains navigateurs courants.",
      },
      newly: {
        title: 'Nouvellement disponible',
        desc: 'Depuis que cette fonctionnalité est devenue Baseline, elle fonctionne sur les derniers appareils et navigateurs.',
      },
      widely: {
        title: 'Largement disponible',
        desc: 'Cette fonctionnalité est bien établie et fonctionne sur de nombreux appareils et navigateurs.',
      },
      loading: { title: 'Chargement…', desc: '' },
      error: { title: 'Échec du chargement', desc: 'Impossible de récupérer les données de la fonctionnalité.' },
      unknown: { title: 'Disponibilité inconnue', desc: 'Aucune donnée de support navigateur disponible.' },
    },
    newlyChip: 'Nouvellement disponible',
    browsersLabel: 'Support navigateurs',
    browserSupport: { available: 'supporté', unavailable: 'non supporté', unknown: 'inconnu' },
    versionSince: 'depuis v',
    link: 'Voir sur webstatus.dev',
    newTab: '(nouvel onglet)',
  },
};

/** Retourne les traductions pour la locale donnée, avec fallback sur "en". */
export function getTranslations(lang: string): Translations {
  const normalized = lang.split('-')[0].toLowerCase();
  return translations[normalized] ?? translations['en'];
}
