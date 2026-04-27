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
    description: 'Montre la visualisation du fil le long du demi-cercle puis sur la règle.',
  },
  showExplanation: {
    type: 'boolean',
    default: true,
    label: 'Afficher l’explication de l’animation',
    description: 'Ajoute des repères pour lire la longueur π sur le cercle unité.',
  },
  showText: {
    type: 'boolean',
    default: true,
    label: 'Afficher le texte informatif',
    description: 'Affiche le rappel théorique sur le périmètre du cercle.',
  },
  showQuiz: {
    type: 'boolean',
    default: true,
    label: 'Afficher le quiz',
    description: 'Ajoute une question de vérification.',
  },
};
