import { bootCustomizerPage } from '/assets/js/core/customizer-shell.js';
import { schema } from './config-schema.js';
import { defaults } from './defaults.js';

bootCustomizerPage({
  notion: {
    id: 'coordonnees',
    title: 'Coordonnées d’un point',
    description: 'Choisis les éléments visibles (définition, valeurs, quiz) selon la séance.',
    pagePath: './index.html',
  },
  schema,
  defaults,
  storageKey: 'customizer:coordonnees',
});
