import { bootNotionPage } from '/Trigonometry/assets/js/core/page-shell.js';
import { createElement, formatNumber } from '/Trigonometry/assets/js/core/utils.js';
import { renderQuiz } from '/Trigonometry/assets/js/core/quiz.js';
import { defaults } from './defaults.js';
import { schema } from './config-schema.js';
import { mountCoordonneesAnimation } from './animation.js';

const notion = {
  id: 'coordonnees',
  title: 'Coordonnées d’un point',
  subtitle: 'Projection sur les axes',
  description: 'Les coordonnées d’un point du cercle trigonométrique sont données par (cos t, sin t).',
  customizerPath: '/Trigonometry/assets/js/pages/coordonnees/customizer.html',
};

const valuesStore = {
  value: { angle: 0, x: 1, y: 0 },
  listeners: new Set(),
};

function setValues(nextValues) {
  valuesStore.value = nextValues;
  valuesStore.listeners.forEach((listener) => listener(nextValues));
}

function subscribeValues(listener) {
  valuesStore.listeners.add(listener);
  listener(valuesStore.value);
  return () => valuesStore.listeners.delete(listener);
}

bootNotionPage({
  notion,
  schema,
  defaults,
  buildBlocks: ({ config }) => {
    const blocks = [];

    if (config.showAnimation) {
      blocks.push({
        id: 'animation',
        title: 'Animation : point et projections',
        render: (target) => mountCoordonneesAnimation(target, { onValuesChange: setValues }),
      });
    }

    if (config.showDefinition) {
      blocks.push({
        id: 'definition',
        title: 'Définition',
        render: (target) => {
          target.innerHTML = `
            <p>Sur le cercle trigonométrique, un point associé à l’angle <strong>t</strong> a pour coordonnées :</p>
            <p><strong>P(cos(t), sin(t))</strong>.</p>
          `;
        },
      });
    }

    if (config.showXYValues) {
      blocks.push({
        id: 'xy-values',
        title: 'Affichage des valeurs x et y',
        render: (target) => {
          const row = createElement('div', { className: 'inline-values' });
          const angleChip = createElement('span', { className: 'value-chip' });
          const xChip = createElement('span', { className: 'value-chip' });
          const yChip = createElement('span', { className: 'value-chip' });
          row.append(angleChip, xChip, yChip);
          target.append(row);

          return subscribeValues((values) => {
            angleChip.textContent = `t = ${formatNumber(values.angle, 3)} rad`;
            xChip.textContent = `x = ${formatNumber(values.x, 3)}`;
            yChip.textContent = `y = ${formatNumber(values.y, 3)}`;
          });
        },
      });
    }

    if (config.showText) {
      blocks.push({
        id: 'text',
        title: 'Texte informatif',
        render: (target) => {
          target.innerHTML = `
            <p>Les projections horizontale et verticale sur les axes permettent de lire directement cosinus et sinus.</p>
            <p>Quand le point est dans le 2e ou 3e quadrant, certaines coordonnées deviennent négatives.</p>
          `;
        },
      });
    }

    if (config.showQuiz) {
      blocks.push({
        id: 'quiz',
        title: 'Quiz rapide',
        render: (target) => {
          renderQuiz(target, {
            question: 'Si P est associé à un angle t, quelles sont ses coordonnées ?',
            choices: [
              { label: '(sin(t), cos(t))', correct: false, explanation: 'Attention à l’ordre : x puis y.' },
              { label: '(cos(t), sin(t))', correct: true, explanation: 'Correct : x = cos(t), y = sin(t).' },
              { label: '(t, 1)', correct: false, explanation: 'Non : t est un angle, pas une coordonnée cartésienne.' },
            ],
          });
        },
      });
    }

    return blocks;
  },
});
