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
    description: 'Affiche le point mobile sur le cercle et ses projections.',
  },
  showDefinition: {
    type: 'boolean',
    default: true,
    label: 'Afficher la définition',
    description: 'Affiche la définition des coordonnées sur le cercle trigonométrique.',
  },
  showXYValues: {
    type: 'boolean',
    default: true,
    label: 'Afficher x et y',
    description: 'Affiche les valeurs numériques de x et y en temps réel.',
  },
  showText: {
    type: 'boolean',
    default: true,
    label: 'Afficher le texte informatif',
    description: 'Ajoute des explications complémentaires.',
  },
  showQuiz: {
    type: 'boolean',
    default: true,
    label: 'Afficher le quiz',
    description: 'Ajoute une question de vérification.',
  },
};
