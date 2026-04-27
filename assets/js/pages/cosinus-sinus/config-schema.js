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
    description: 'Affiche le point mobile sur le cercle trigonométrique.',
  },
  showTable: {
    type: 'boolean',
    default: true,
    label: 'Afficher le tableau de valeurs',
    description: 'Montre le tableau alimenté par le bouton “Enregistrer la valeur”.',
  },
  valueMode: {
    type: 'enum',
    default: 'both',
    values: ['both', 'cos', 'sin'],
    valueLabels: {
      both: 'Cosinus et sinus',
      cos: 'Cosinus uniquement',
      sin: 'Sinus uniquement',
    },
    label: 'Valeurs à afficher',
    description: 'Choisit les valeurs affichées dans le tableau et dans les lectures de l’animation.',
  },
  showQuiz: {
    type: 'boolean',
    default: true,
    label: 'Afficher le quiz',
    description: 'Ajoute une question de vérification.',
  },
};
