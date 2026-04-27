import { bootCustomizerPage } from '/assets/js/core/customizer-shell.js';
import { schema } from './config-schema.js';
import { defaults } from './defaults.js';

bootCustomizerPage({
  notion: {
    id: 'relations-angles',
    title: 'Relation entre les angles',
    description: 'Choisis la fonction (cos/sin), les angles visibles et les blocs à afficher.',
    pagePath: './index.html',
  },
  schema,
  defaults,
  storageKey: 'customizer:relations-angles',
});
