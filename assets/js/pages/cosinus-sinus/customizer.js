import { bootCustomizerPage } from '/assets/js/core/customizer-shell.js';
import { schema } from './config-schema.js';
import { defaults } from './defaults.js';

bootCustomizerPage({
  notion: {
    id: 'cosinus-sinus',
    title: 'Cosinus et sinus',
    description: 'Active l’animation, le tableau de valeurs et le quiz selon ton scénario pédagogique.',
    pagePath: './index.html',
  },
  schema,
  defaults,
  storageKey: 'customizer:cosinus-sinus',
});
