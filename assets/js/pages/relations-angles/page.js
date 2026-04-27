import { bootNotionPage } from '/assets/js/core/page-shell.js';
import { createElement, unique } from '/assets/js/core/utils.js';
import { defaults } from './defaults.js';
import { schema, ANGLE_OPTIONS, ANGLE_LABELS } from './config-schema.js';
import { mountRelationsAnimation } from './animation.js';

const notion = {
  id: 'relations-angles',
  title: 'Relation entre les angles',
  subtitle: 'Comparer x avec des angles liés',
  description: 'Affiche des relations trigonométriques en cosinus, sinus ou tangente pour plusieurs transformations d’angle.',
  customizerPath: '/assets/js/pages/relations-angles/customizer.html',
};

const angleColorMap = {
  x: '#111827',
  negX: '#6b7280',
  piPlusX: '#ef4444',
  piMinusX: '#f59e0b',
  piOver2PlusX: '#16a34a',
  piOver2MinusX: '#06b6d4',
  twoPiMinusX: '#7c3aed',
};

function createRelationStore(initialState) {
  let state = structuredClone(initialState);
  const listeners = new Set();

  return {
    getState() {
      return state;
    },
    setState(partial) {
      state = { ...state, ...partial };
      listeners.forEach((listener) => listener(state));
    },
    subscribe(listener) {
      listeners.add(listener);
      listener(state);
      return () => listeners.delete(listener);
    },
  };
}

function buildFormula(functionType, token) {
  const rhsMap = {
    cos: {
      x: 'cos(x)',
      negX: 'cos(x)',
      piPlusX: '-cos(x)',
      piMinusX: '-cos(x)',
      piOver2PlusX: '-sin(x)',
      piOver2MinusX: 'sin(x)',
      twoPiMinusX: 'cos(x)',
    },
    sin: {
      x: 'sin(x)',
      negX: '-sin(x)',
      piPlusX: '-sin(x)',
      piMinusX: 'sin(x)',
      piOver2PlusX: 'cos(x)',
      piOver2MinusX: 'cos(x)',
      twoPiMinusX: '-sin(x)',
    },
    tan: {
      x: 'tan(x)',
      negX: '-tan(x)',
      piPlusX: 'tan(x)',
      piMinusX: '-tan(x)',
      piOver2PlusX: '-1/tan(x)',
      piOver2MinusX: '1/tan(x)',
      twoPiMinusX: '-tan(x)',
    },
  };

  const fn = functionType === 'sin' ? 'sin' : functionType === 'tan' ? 'tan' : 'cos';
  const rhs = rhsMap[fn][token] || '...';
  const angle = ANGLE_LABELS[token] || token;
  return `${fn}(${angle}) = ${rhs}`;
}

bootNotionPage({
  notion,
  schema,
  defaults,
  buildBlocks: ({ config }) => {
    const controlsMode = config.controlsMode || 'full';
    const blocksRoot = document.getElementById('blocks-root');
    const splitLayout = Boolean(config.showAnimation && config.showFormula);
    blocksRoot?.classList.toggle('relations-split', splitLayout);

    const store = createRelationStore({
      baseAngle: Math.PI / 6,
      functionType: config.functionType,
      angles: [...config.angles],
    });

    const blocks = [];

    if (config.showAnimation) {
      blocks.push({
        id: 'animation',
        title: 'Animation des angles liés',
        description: 'Les angles sélectionnés sont tracés avec leurs couleurs dédiées. Dans l’animation, bleu = longueur liée au cosinus et rouge = longueur liée au sinus.',
        render: (target) => mountRelationsAnimation(target, {
          getState: store.getState,
          setState: store.setState,
          subscribe: store.subscribe,
          showAngleController: controlsMode !== 'none',
        }),
      });
    }

    if (controlsMode === 'full') {
      blocks.push({
        id: 'controls',
        title: 'Contrôles',
        description: 'Ces contrôles modifient la visualisation locale sans changer l’URL.',
        render: (target) => {
          const controls = createElement('div', { className: 'control-row' });
          const checkboxMap = new Map();
          let fnSelect = null;
          let angleChoiceContainer = null;
          let actions = null;

          fnSelect = createElement('select');
          fnSelect.innerHTML = `
            <option value="cos">cosinus</option>
            <option value="sin">sinus</option>
            <option value="tan">tangente</option>
          `;
          fnSelect.value = store.getState().functionType;

          angleChoiceContainer = createElement('div', { className: 'angle-checkbox-list' });

          ANGLE_OPTIONS.forEach((token) => {
            const label = createElement('label', { className: 'angle-checkbox-item' });
            const checkbox = createElement('input', {
              attrs: {
                type: 'checkbox',
                value: token,
              },
            });

            checkbox.checked = store.getState().angles.includes(token);

            checkbox.addEventListener('change', () => {
              const checkboxes = Array.from(angleChoiceContainer.querySelectorAll('input[type="checkbox"]'));
              const selected = checkboxes
                .filter((input) => input.checked)
                .map((input) => input.value);
              store.setState({ angles: unique(selected) });
            });

            checkboxMap.set(token, checkbox);

            const text = createElement('span', { text: ANGLE_LABELS[token] || token });
            text.style.color = angleColorMap[token] || '#334155';
            label.append(checkbox, text);
            angleChoiceContainer.append(label);
          });

          const allButton = createElement('button', {
            className: 'btn btn-secondary',
            attrs: { type: 'button' },
            text: 'Tout cocher',
          });

          const noneButton = createElement('button', {
            className: 'btn btn-secondary',
            attrs: { type: 'button' },
            text: 'Tout décocher',
          });

          allButton.addEventListener('click', () => {
            store.setState({ angles: [...ANGLE_OPTIONS] });
          });

          noneButton.addEventListener('click', () => {
            store.setState({ angles: [] });
          });

          actions = createElement('div', { className: 'control-row' });
          actions.append(allButton, noneButton);

          fnSelect.addEventListener('change', () => {
            store.setState({ functionType: fnSelect.value });
          });

          controls.append(
            createElement('span', { text: 'Fonction :' }),
            fnSelect
          );

          const unsub = store.subscribe((state) => {
            if (fnSelect) {
              fnSelect.value = state.functionType;
            }

            checkboxMap.forEach((checkbox, token) => {
              checkbox.checked = state.angles.includes(token);
            });
          });

          target.append(controls);
          if (angleChoiceContainer && actions) {
            target.append(angleChoiceContainer, actions);
          }

          return () => {
            unsub();
          };
        },
      });
    }

    if (config.showFormula) {
      blocks.push({
        id: 'formula',
        title: 'Formules de relation',
        render: (target) => {
          const list = createElement('div', { className: 'quiz' });
          const tanWarning = createElement('p', {
            className: 'block-description',
            text: 'Attention : tan(x) est indéfinie si cos(x)=0, et 1/tan(x) est indéfini si tan(x)=0.',
          });
          target.append(list, tanWarning);

          const unsub = store.subscribe((state) => {
            list.innerHTML = '';
            tanWarning.hidden = state.functionType !== 'tan';

            const formulaTokens = state.angles.filter((token) => token !== 'x');

            formulaTokens.forEach((token) => {
              const line = createElement('p', { className: 'quiz-option' });
              const tag = createElement('span', { text: ANGLE_LABELS[token] || token });
              tag.style.display = 'inline-block';
              tag.style.marginRight = '0.55rem';
              tag.style.padding = '0.12rem 0.48rem';
              tag.style.border = '1px solid #d9e0d4';
              tag.style.borderRadius = '999px';
              tag.style.color = angleColorMap[token] || '#334155';
              tag.style.fontWeight = '700';
              line.append(tag, document.createTextNode(buildFormula(state.functionType, token)));
              list.append(line);
            });

            if (formulaTokens.length === 0) {
              list.append(createElement('p', {
                className: 'quiz-result quiz-result-neutral',
                text: 'Aucune formule à afficher (la formule de base f(x)=f(x) est masquée).',
              }));
            }
          });

          return () => {
            unsub();
          };
        },
      });
    }

    return blocks;
  },
});
