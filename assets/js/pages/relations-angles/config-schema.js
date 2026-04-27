export const ANGLE_OPTIONS = ['x', 'negX', 'piPlusX', 'piMinusX', 'piOver2PlusX', 'piOver2MinusX', 'twoPiMinusX'];

export const ANGLE_LABELS = {
  x: 'x',
  negX: '-x',
  piPlusX: 'π + x',
  piMinusX: 'π - x',
  piOver2PlusX: 'π/2 + x',
  piOver2MinusX: 'π/2 - x',
  twoPiMinusX: '2π - x',
};

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
    description: 'Affiche le cercle trigonométrique et les angles sélectionnés.',
  },
  controlsMode: {
    type: 'enum',
    default: 'full',
    values: ['full', 'slider', 'none'],
    valueLabels: {
      full: 'Slider + contrôles complets',
      slider: 'Slider dans l’animation',
      none: 'Aucun contrôle',
    },
    label: 'Affichage des contrôles',
    description: 'Choisit entre slider + options complètes, slider seul dans l’animation, ou aucun contrôle.',
  },
  functionType: {
    type: 'enum',
    default: 'cos',
    values: ['cos', 'sin', 'tan'],
    valueLabels: {
      cos: 'cosinus',
      sin: 'sinus',
      tan: 'tangente',
    },
    label: 'Fonction étudiée',
    description: 'Choisit si les formules portent sur cosinus, sinus ou tangente.',
  },
  angles: {
    type: 'csv',
    default: ['x', 'negX', 'piPlusX', 'piMinusX', 'piOver2PlusX', 'piOver2MinusX', 'twoPiMinusX'],
    values: ANGLE_OPTIONS,
    valueLabels: ANGLE_LABELS,
    label: 'Angles visibles',
    description: 'Liste des angles à afficher dans l’animation.',
  },
  showFormula: {
    type: 'boolean',
    default: true,
    label: 'Afficher les formules',
    description: 'Affiche les relations algébriques correspondantes.',
  },
};
