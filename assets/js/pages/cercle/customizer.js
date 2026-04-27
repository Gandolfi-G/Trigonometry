import { bootCustomizerPage } from '/Trigonometry/assets/js/core/customizer-shell.js';
import { schema } from './config-schema.js';
import { defaults } from './defaults.js';

bootCustomizerPage({
  notion: {
    id: 'cercle',
    title: 'Cercle trigonométrique',
    description: 'Choisis les blocs à afficher pour adapter la séance au niveau des élèves.',
    pagePath: './index.html',
  },
  schema,
  defaults,
  storageKey: 'customizer:cercle',
});
