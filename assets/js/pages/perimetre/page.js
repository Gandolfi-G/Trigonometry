import { bootNotionPage } from '/Trigonometry/assets/js/core/page-shell.js';
import { renderQuiz } from '/Trigonometry/assets/js/core/quiz.js';
import { defaults } from './defaults.js';
import { schema } from './config-schema.js';
import { mountPerimetreAnimation } from './animation.js';

const notion = {
  id: 'perimetre',
  title: 'Périmètre du cercle',
  subtitle: 'Longueur du demi-cercle unité',
  description: 'Le demi-cercle de rayon 1 a une longueur π. L’animation déroule visuellement cette longueur sur une règle.',
  customizerPath: '/Trigonometry/assets/js/pages/perimetre/customizer.html',
};

bootNotionPage({
  notion,
  schema,
  defaults,
  buildBlocks: ({ config }) => {
    const blocks = [];

    if (config.showAnimation) {
      blocks.push({
        id: 'animation',
        title: 'Animation : du demi-cercle à la règle',
        render: (target) => mountPerimetreAnimation(target),
      });
    }

    if (config.showExplanation) {
      blocks.push({
        id: 'explanation',
        title: 'Explication de l’animation',
        render: (target) => {
          target.innerHTML = `
            <p>Le cercle est de rayon 1, donc son périmètre complet vaut <strong>2π</strong>.</p>
            <p>La partie supérieure (un demi-cercle) mesure donc <strong>π</strong>.</p>
            <p>Le segment rouge sur la règle visualise cette même longueur.</p>
          `;
        },
      });
    }

    if (config.showText) {
      blocks.push({
        id: 'text',
        title: 'Texte informatif',
        render: (target) => {
          target.innerHTML = `
            <p>La formule générale du périmètre d’un cercle est <strong>2πR</strong>.</p>
            <p>Quand <strong>R = 1</strong>, le périmètre vaut <strong>2π</strong> et le demi-périmètre vaut <strong>π</strong>.</p>
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
            question: 'Quelle est la longueur du demi-cercle unité ?',
            choices: [
              { label: '2π', correct: false, explanation: '2π est la longueur du cercle complet.' },
              { label: 'π', correct: true, explanation: 'Correct : le demi-cercle unité mesure π.' },
              { label: '1', correct: false, explanation: '1 correspond au rayon, pas à la longueur de l’arc.' },
            ],
          });
        },
      });
    }

    return blocks;
  },
});
