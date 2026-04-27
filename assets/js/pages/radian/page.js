import { bootNotionPage } from '/assets/js/core/page-shell.js';
import { renderQuiz } from '/assets/js/core/quiz.js';
import { defaults } from './defaults.js';
import { schema } from './config-schema.js';
import { mountRadianAnimation } from './animation.js';

const notion = {
  id: 'radian',
  title: 'Le radian',
  subtitle: 'Définition par longueur d’arc',
  description: 'Un angle de 1 radian intercepte un arc de longueur égale au rayon.',
  customizerPath: '/assets/js/pages/radian/customizer.html',
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
        title: 'Animation du radian',
        render: (target) => mountRadianAnimation(target),
      });
    }

    if (config.showExplanation) {
      blocks.push({
        id: 'explanation',
        title: 'Explication du radian',
        render: (target) => {
          target.innerHTML = `
            <p>Un angle est mesuré en radians en comparant la longueur de son arc au rayon du cercle.</p>
            <p>Quand la longueur d’arc est égale au rayon, l’angle vaut exactement <strong>1 rad</strong>.</p>
            <p>Sur le cercle unité, longueur d’arc et mesure en radians coïncident numériquement.</p>
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
            <p>Conversion utile : <strong>180° = π rad</strong>.</p>
            <p>Donc <strong>1 rad ≈ 57,3°</strong> et <strong>π/2 rad = 90°</strong>.</p>
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
            question: 'Sur le cercle unité, que représente 1 radian ?',
            choices: [
              { label: 'Un arc de longueur 1', correct: true, explanation: 'Correct : longueur d’arc = rayon = 1.' },
              { label: 'Un angle de 1°', correct: false, explanation: 'Non : 1 rad vaut environ 57,3°.' },
              { label: 'Un demi-tour', correct: false, explanation: 'Non : un demi-tour vaut π rad.' },
            ],
          });
        },
      });
    }

    return blocks;
  },
});
