import { bootCustomizerPage } from '/assets/js/core/customizer-shell.js';
import { schema } from './config-schema.js';
import { defaults } from './defaults.js';

bootCustomizerPage({
  notion: {
    id: 'perimetre',
    title: 'Périmètre du cercle',
    description: 'Configure les blocs autour de l’animation du fil et de la lecture de π.',
    pagePath: './index.html',
  },
  schema,
  defaults,
  storageKey: 'customizer:perimetre',
});
