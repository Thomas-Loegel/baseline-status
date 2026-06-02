import { BaselineStatus } from './baseline-status';

export { BaselineStatus };
export type { WebStatusFeature, BaselineLevel, WidgetStatus } from './types';

/**
 * Enregistre le custom element. Appelée automatiquement à l'import du package,
 * mais ré-exportée pour permettre un nom de tag personnalisé :
 *
 * ```js
 * import { register } from '@arteast/baseline-status';
 * register('feature-status'); // <feature-status featureId="…">
 * ```
 */
export function register(tagName = 'baseline-status'): void {
  if (typeof customElements === 'undefined') return;
  if (!customElements.get(tagName)) {
    customElements.define(tagName, BaselineStatus);
  }
}

// Auto-enregistrement : `import '@arteast/baseline-status'` suffit.
register();

declare global {
  interface HTMLElementTagNameMap {
    'baseline-status': BaselineStatus;
  }
}
