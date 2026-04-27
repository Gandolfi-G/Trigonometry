export const schema = {
  showHero: {
    type: 'boolean',
    default: true,
    label: 'Afficher la section hero',
    description: 'Affiche le titre, la description et l’objectif en haut de page.',
  },
  showAnimation: {
    type: 'boolean',
    default: true,
    label: 'Afficher l’animation',
    description: 'Montre le rayon rouge et l’arc associé.',
  },
  showExplanation: {
    type: 'boolean',
    default: true,
    label: 'Afficher l’explication du radian',
    description: 'Affiche le commentaire guidé sur la définition du radian.',
  },
  showText: {
    type: 'boolean',
    default: true,
    label: 'Afficher le texte informatif',
    description: 'Affiche un rappel théorique complémentaire.',
  },
  showQuiz: {
    type: 'boolean',
    default: true,
    label: 'Afficher le quiz',
    description: 'Ajoute une question de vérification.',
  },
};
