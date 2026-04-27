import { bootNotionPage } from '/Trigonometry/assets/js/core/page-shell.js';
import { createElement, formatNumber } from '/Trigonometry/assets/js/core/utils.js';
import { renderQuiz } from '/Trigonometry/assets/js/core/quiz.js';
import { defaults } from './defaults.js';
import { schema } from './config-schema.js';
import { mountCercleAnimation } from './animation.js';

const notion = {
  id: 'cercle',
  title: 'Cercle trigonométrique',
  subtitle: 'Lecture de l’angle sur le cercle unité',
  description: 'Cette page présente le sens trigonométrique, le rayon unité et les premières valeurs utiles.',
  customizerPath: '/Trigonometry/assets/js/pages/cercle/customizer.html',
};

const angleStore = {
  value: 0,
  listeners: new Set(),
};

function setAngle(value) {
  angleStore.value = value;
  angleStore.listeners.forEach((listener) => listener(value));
}

function subscribeAngle(listener) {
  angleStore.listeners.add(listener);
  listener(angleStore.value);
  return () => angleStore.listeners.delete(listener);
}

bootNotionPage({
  notion,
  schema,
  defaults,
  buildBlocks: ({ config }) => {
    const isTrigoDirection = config.rotationDirection !== 'antiTrigo';
    const directionLabel = isTrigoDirection
      ? 'sens trigonométrique (inverse des aiguilles d’une montre)'
      : 'sens anti-trigonométrique (sens des aiguilles d’une montre)';

    const blocks = [];

    if (config.showAnimation) {
      blocks.push({
        id: 'animation',
        title: 'Animation du cercle trigonométrique',
        description: `Le point P se déplace sur le cercle unité dans le ${directionLabel}.`,
        render: (target) => mountCercleAnimation(target, {
          showControls: config.showControls,
          rotationDirection: config.rotationDirection,
          onAngleChange: setAngle,
        }),
      });
    }

    if (config.showUsefulValues) {
      blocks.push({
        id: 'values',
        title: 'Valeurs utiles',
        render: (target) => {
          const current = createElement('div', { className: 'inline-values' });
          const angleChip = createElement('span', { className: 'value-chip' });
          const xChip = createElement('span', { className: 'value-chip' });
          const yChip = createElement('span', { className: 'value-chip' });

          current.append(angleChip, xChip, yChip);
          target.append(current);

          const table = createElement('table', { className: 'values-table' });
          table.innerHTML = `
            <thead>
              <tr><th>Angle</th><th>Valeur de x</th><th>Valeur de y</th></tr>
            </thead>
            <tbody>
              <tr><td>0°</td><td>1</td><td>0</td></tr>
              <tr><td>30°</td><td>√3/2</td><td>1/2</td></tr>
              <tr><td>45°</td><td>√2/2</td><td>√2/2</td></tr>
              <tr><td>60°</td><td>1/2</td><td>√3/2</td></tr>
              <tr><td>90°</td><td>0</td><td>1</td></tr>
            </tbody>
          `;

          target.append(table);

          return subscribeAngle((angle) => {
            const degree = (angle * 180) / Math.PI;
            angleChip.textContent = `Angle = ${formatNumber(degree, 1)}°`;
            xChip.textContent = `x = ${formatNumber(Math.cos(angle), 3)}`;
            yChip.textContent = `y = ${formatNumber(Math.sin(angle), 3)}`;
          });
        },
      });
    }

    if (config.showText) {
      blocks.push({
        id: 'text',
        title: 'Repères pédagogiques',
        render: (target) => {
          target.innerHTML = `
            <p>Le cercle trigonométrique est un cercle de rayon <strong>1</strong>.</p>
            <p>Dans cette animation, le point de départ est <strong>I(1,0)</strong> et le point <strong>P</strong> tourne dans le <strong>${directionLabel}</strong>.</p>
            <p>Les coordonnées de <strong>P</strong> se lisent sous la forme <strong>P(x, y)</strong>, avec <strong>x</strong> sur l’axe horizontal et <strong>y</strong> sur l’axe vertical.</p>
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
            question: 'Dans cette animation, le point P tourne dans quel sens ?',
            choices: [
              {
                label: 'Le sens trigonométrique (inverse des aiguilles d’une montre)',
                correct: isTrigoDirection,
                explanation: isTrigoDirection ? 'Correct : c’est le sens choisi dans la personnalisation.' : 'Non : ce n’est pas le sens choisi pour cette animation.',
              },
              {
                label: 'Le sens anti-trigonométrique (sens des aiguilles d’une montre)',
                correct: !isTrigoDirection,
                explanation: !isTrigoDirection ? 'Correct : c’est le sens choisi dans la personnalisation.' : 'Non : ce n’est pas le sens choisi pour cette animation.',
              },
              { label: 'Le sens dépend du quadrant', correct: false, explanation: 'Non : le sens affiché est défini par la personnalisation.' },
            ],
          });
        },
      });
    }

    return blocks;
  },
});
