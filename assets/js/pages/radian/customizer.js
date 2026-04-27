import { bootCustomizerPage } from '/Trigonometry/assets/js/core/customizer-shell.js';
import { schema } from './config-schema.js';
import { defaults } from './defaults.js';

bootCustomizerPage({
  notion: {
    id: 'radian',
    title: 'Le radian',
    description: 'Sélectionne les blocs affichés pour enseigner la notion de radian.',
    pagePath: './index.html',
  },
  schema,
  defaults,
  storageKey: 'customizer:radian',
});
