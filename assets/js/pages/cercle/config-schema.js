export const schema = {
  showHero: {
    type: 'boolean',
    default: true,
    label: 'Afficher la section hero',
    description: 'Affiche le titre, la description et l’objectif en haut de page.',
  },
  rotationDirection: {
    type: 'enum',
    ui: 'switch',
    default: 'trigo',
    values: ['trigo', 'antiTrigo'],
    valueLabels: {
      trigo: 'Sens trigonométrique',
      antiTrigo: 'Sens anti-trigonométrique',
    },
    label: 'Sens de rotation',
    description: 'Choisit le sens de déplacement automatique du point P.',
  },
  showAnimation: {
    type: 'boolean',
    default: true,
    label: 'Afficher l’animation',
    description: 'Affiche le cercle trigonométrique animé avec le point mobile.',
  },
  showControls: {
    type: 'boolean',
    default: true,
    label: 'Afficher les contrôles',
    description: 'Active les boutons play/pause/reset et le curseur de position.',
  },
  showUsefulValues: {
    type: 'boolean',
    default: true,
    label: 'Afficher les valeurs utiles',
    description: 'Affiche les valeurs remarquables et la lecture courante de l’angle.',
  },
  showText: {
    type: 'boolean',
    default: true,
    label: 'Afficher le texte informatif',
    description: 'Montre les rappels pédagogiques sur le sens trigonométrique et le rayon.',
  },
  showQuiz: {
    type: 'boolean',
    default: true,
    label: 'Afficher le quiz',
    description: 'Ajoute une question de vérification rapide.',
  },
};
