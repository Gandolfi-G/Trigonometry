import { bootNotionPage } from '/Trigonometry/assets/js/core/page-shell.js';
import { createElement, formatNumber } from '/Trigonometry/assets/js/core/utils.js';
import { renderQuiz } from '/Trigonometry/assets/js/core/quiz.js';
import { defaults } from './defaults.js';
import { schema } from './config-schema.js';
import { mountCosSinAnimation } from './animation.js';

const notion = {
  id: 'cosinus-sinus',
  title: 'Cosinus et sinus',
  subtitle: 'Tableau de valeurs',
  description: 'Enregistre des positions du point pour construire progressivement un tableau angle / cosinus / sinus.',
  customizerPath: '/Trigonometry/assets/js/pages/cosinus-sinus/customizer.html',
};

const rowsStore = {
  rows: [],
  listeners: new Set(),
};

const currentStore = {
  values: { angle: 0, cos: 1, sin: 0, angleExact: '0', cosExact: '1', sinExact: '0' },
  listeners: new Set(),
};

function toExactDisplay(values) {
  return {
    angle: values.angleExact || formatNumber(values.angle, 3),
    cos: values.cosExact || formatNumber(values.cos, 3),
    sin: values.sinExact || formatNumber(values.sin, 3),
  };
}

function getValueModeFlags(valueMode) {
  return {
    showCos: valueMode !== 'sin',
    showSin: valueMode !== 'cos',
  };
}

function setCurrent(values) {
  currentStore.values = values;
  currentStore.listeners.forEach((listener) => listener(values));
}

function subscribeCurrent(listener) {
  currentStore.listeners.add(listener);
  listener(currentStore.values);
  return () => currentStore.listeners.delete(listener);
}

function pushRow(values) {
  const exact = toExactDisplay(values);
  rowsStore.rows = [
    ...rowsStore.rows,
    {
      angle: values.angle,
      cos: values.cos,
      sin: values.sin,
      angleExact: exact.angle,
      cosExact: exact.cos,
      sinExact: exact.sin,
      index: rowsStore.rows.length + 1,
    },
  ];
  rowsStore.listeners.forEach((listener) => listener(rowsStore.rows));
}

function clearRows() {
  rowsStore.rows = [];
  rowsStore.listeners.forEach((listener) => listener(rowsStore.rows));
}

function subscribeRows(listener) {
  rowsStore.listeners.add(listener);
  listener(rowsStore.rows);
  return () => rowsStore.listeners.delete(listener);
}

bootNotionPage({
  notion,
  schema,
  defaults,
  buildBlocks: ({ config }) => {
    const valueModeFlags = getValueModeFlags(config.valueMode);
    const blocksRoot = document.getElementById('blocks-root');
    blocksRoot?.classList.toggle('cos-sin-split', Boolean(config.showAnimation && config.showTable));

    const blocks = [];

    if (config.showAnimation) {
      blocks.push({
        id: 'animation',
        title: 'Animation et enregistrement',
        description: 'Le point est aimanté sur les angles remarquables. Clique sur “Enregistrer” pour ajouter la valeur exacte au tableau.',
        render: (target) => mountCosSinAnimation(target, {
          onCurrentValues: setCurrent,
          onSaveRequested: pushRow,
          onClearRequested: clearRows,
          valueMode: config.valueMode,
        }),
      });
    }

    if (config.showTable) {
      blocks.push({
        id: 'table',
        title: 'Tableau de valeurs',
        render: (target) => {
          const summary = createElement('div', { className: 'inline-values' });
          const currentChip = createElement('span', { className: 'value-chip' });
          const countChip = createElement('span', { className: 'value-chip' });
          summary.append(currentChip, countChip);

          const columns = [
            { key: 'angle', label: 'Angle', getValue: (row) => row.angleExact },
          ];
          if (valueModeFlags.showCos) {
            columns.push({ key: 'cos', label: 'cos(angle)', getValue: (row) => row.cosExact });
          }
          if (valueModeFlags.showSin) {
            columns.push({ key: 'sin', label: 'sin(angle)', getValue: (row) => row.sinExact });
          }

          const table = createElement('table', { className: 'data-table' });
          table.innerHTML = `
            <thead>
              <tr>
                <th>#</th>
                ${columns.map((column) => `<th>${column.label}</th>`).join('')}
              </tr>
            </thead>
            <tbody></tbody>
          `;

          const tbody = table.querySelector('tbody');

          target.append(summary, table);

          const cleanups = [
            subscribeCurrent((values) => {
              const exact = toExactDisplay(values);
              const parts = [`Courant: θ=${exact.angle}`];
              if (valueModeFlags.showCos) {
                parts.push(`cos(θ)=${exact.cos}`);
              }
              if (valueModeFlags.showSin) {
                parts.push(`sin(θ)=${exact.sin}`);
              }
              currentChip.textContent = parts.join(' | ');
            }),
            subscribeRows((rows) => {
              countChip.textContent = `Lignes enregistrées: ${rows.length}`;
              if (!tbody) return;
              tbody.innerHTML = rows
                .map((row) => `
                  <tr>
                    <td>${row.index}</td>
                    ${columns.map((column) => `<td>${column.getValue(row)}</td>`).join('')}
                  </tr>
                `)
                .join('');
            }),
          ];

          return () => cleanups.forEach((cleanup) => cleanup());
        },
      });
    }

    if (config.showQuiz) {
      blocks.push({
        id: 'quiz',
        title: 'Quiz rapide',
        render: (target) => {
          renderQuiz(target, {
            question: 'Sur le cercle trigonométrique, que vaut l’abscisse du point associé à t ?',
            choices: [
              { label: 'sin(t)', correct: false, explanation: 'Non : sin(t) est l’ordonnée.' },
              { label: 'cos(t)', correct: true, explanation: 'Correct : l’abscisse est cos(t).' },
              { label: 'tan(t)', correct: false, explanation: 'Non : la tangente ne correspond pas directement à l’abscisse.' },
            ],
          });
        },
      });
    }

    return blocks;
  },
});
