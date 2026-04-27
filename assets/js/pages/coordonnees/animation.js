import { createElement, formatNumber } from '/Trigonometry/assets/js/core/utils.js';
import { createBoard } from '/Trigonometry/assets/js/jsxgraph/board-utils.js';

const TAU = Math.PI * 2;

function normalizeAngle(angle) {
  const mod = angle % TAU;
  return mod >= 0 ? mod : mod + TAU;
}

/**
 * Animation des coordonnées d'un point du cercle trigonométrique.
 * Inspirée de la référence trigo-04.
 * @param {HTMLElement} target
 * @param {{ onValuesChange: (values: {angle: number, x: number, y: number}) => void }} options
 * @returns {() => void}
 */
export function mountCoordonneesAnimation(target, options) {
  const wrapper = createElement('div', { className: 'board-zone' });
  target.append(wrapper);

  const { board, destroy } = createBoard(wrapper, {
    axis: true,
    grid: true,
    boundingbox: [-1.7, 1.7, 1.7, -1.7],
    keepAspectRatio: true,
  });

  const O = board.create('point', [0, 0], {
    name: 'O',
    fixed: true,
    size: 2,
    strokeColor: '#111111',
    fillColor: '#111111',
  });

  const circle = board.create('circle', [O, 1], {
    strokeWidth: 3,
    strokeColor: '#eab308',
  });

  const point = board.create('glider', [1, 0, circle], {
    name: 'P',
    size: 3.5,
    strokeColor: '#ef4444',
    fillColor: '#ef4444',
    withLabel: true,
    label: { offset: [8, -10] },
  });

  const projectionX = board.create('point', [() => point.X(), 0], {
    name: '',
    size: 2.5,
    strokeColor: '#111111',
    fillColor: '#111111',
    fixed: true,
    withLabel: false,
  });

  const projectionY = board.create('point', [0, () => point.Y()], {
    name: '',
    size: 2.5,
    strokeColor: '#111111',
    fillColor: '#111111',
    fixed: true,
    withLabel: false,
  });

  board.create('segment', [point, projectionX], {
    strokeColor: '#ef4444',
    strokeOpacity: 0.75,
    strokeWidth: 2,
    dash: 2,
  });

  board.create('segment', [point, projectionY], {
    strokeColor: '#ef4444',
    strokeOpacity: 0.75,
    strokeWidth: 2,
    dash: 2,
  });

  board.create('segment', [O, projectionX], {
    strokeColor: '#2563eb',
    strokeOpacity: 0.8,
    strokeWidth: 3,
  });

  board.create('segment', [O, projectionY], {
    strokeColor: '#16a34a',
    strokeOpacity: 0.8,
    strokeWidth: 3,
  });

  board.create('text', [1.03, 1.52, () => `P = (${formatNumber(point.X(), 2)}, ${formatNumber(point.Y(), 2)})`], {
    fontSize: 14,
    fixed: true,
  });

  board.create('text', [() => projectionX.X() + 0.05, 0.12, () => `x = ${formatNumber(point.X(), 2)}`], {
    fontSize: 13,
  });

  board.create('text', [0.12, () => projectionY.Y() + 0.05, () => `y = ${formatNumber(point.Y(), 2)}`], {
    fontSize: 13,
  });

  const emitValues = () => {
    const x = point.X();
    const y = point.Y();
    options.onValuesChange({
      angle: normalizeAngle(Math.atan2(y, x)),
      x,
      y,
    });
  };

  point.on('drag', () => {
    emitValues();
  });

  point.on('up', () => {
    emitValues();
  });

  emitValues();

  return () => {
    destroy();
  };
}
