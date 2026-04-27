import { createElement, formatNumber } from '/assets/js/core/utils.js';
import { createBoard } from '/assets/js/jsxgraph/board-utils.js';

const TAU = Math.PI * 2;
const CLASSIC_VALUES = [
  { angle: 0, angleExact: '0', cos: 1, cosExact: '1', sin: 0, sinExact: '0' },
  { angle: Math.PI / 6, angleExact: 'π/6', cos: Math.sqrt(3) / 2, cosExact: '√3/2', sin: 1 / 2, sinExact: '1/2' },
  { angle: Math.PI / 4, angleExact: 'π/4', cos: Math.SQRT2 / 2, cosExact: '√2/2', sin: Math.SQRT2 / 2, sinExact: '√2/2' },
  { angle: Math.PI / 3, angleExact: 'π/3', cos: 1 / 2, cosExact: '1/2', sin: Math.sqrt(3) / 2, sinExact: '√3/2' },
  { angle: Math.PI / 2, angleExact: 'π/2', cos: 0, cosExact: '0', sin: 1, sinExact: '1' },
  { angle: (2 * Math.PI) / 3, angleExact: '2π/3', cos: -1 / 2, cosExact: '-1/2', sin: Math.sqrt(3) / 2, sinExact: '√3/2' },
  { angle: (3 * Math.PI) / 4, angleExact: '3π/4', cos: -Math.SQRT2 / 2, cosExact: '-√2/2', sin: Math.SQRT2 / 2, sinExact: '√2/2' },
  { angle: (5 * Math.PI) / 6, angleExact: '5π/6', cos: -Math.sqrt(3) / 2, cosExact: '-√3/2', sin: 1 / 2, sinExact: '1/2' },
  { angle: Math.PI, angleExact: 'π', cos: -1, cosExact: '-1', sin: 0, sinExact: '0' },
  { angle: (7 * Math.PI) / 6, angleExact: '7π/6', cos: -Math.sqrt(3) / 2, cosExact: '-√3/2', sin: -1 / 2, sinExact: '-1/2' },
  { angle: (5 * Math.PI) / 4, angleExact: '5π/4', cos: -Math.SQRT2 / 2, cosExact: '-√2/2', sin: -Math.SQRT2 / 2, sinExact: '-√2/2' },
  { angle: (4 * Math.PI) / 3, angleExact: '4π/3', cos: -1 / 2, cosExact: '-1/2', sin: -Math.sqrt(3) / 2, sinExact: '-√3/2' },
  { angle: (3 * Math.PI) / 2, angleExact: '3π/2', cos: 0, cosExact: '0', sin: -1, sinExact: '-1' },
  { angle: (5 * Math.PI) / 3, angleExact: '5π/3', cos: 1 / 2, cosExact: '1/2', sin: -Math.sqrt(3) / 2, sinExact: '-√3/2' },
  { angle: (7 * Math.PI) / 4, angleExact: '7π/4', cos: Math.SQRT2 / 2, cosExact: '√2/2', sin: -Math.SQRT2 / 2, sinExact: '-√2/2' },
  { angle: (11 * Math.PI) / 6, angleExact: '11π/6', cos: Math.sqrt(3) / 2, cosExact: '√3/2', sin: -1 / 2, sinExact: '-1/2' },
];
const SNAP_TOLERANCE = 0.06;

function normalizeAngle(angle) {
  const mod = angle % TAU;
  return mod >= 0 ? mod : mod + TAU;
}

function angleDistance(a, b) {
  return Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));
}

function angleFromXY(x, y) {
  return normalizeAngle(Math.atan2(y, x));
}

/**
 * Animation cosinus/sinus de type trigo-05.
 * @param {HTMLElement} target
 * @param {{
 *  onCurrentValues: (values: {angle: number, cos: number, sin: number}) => void,
 *  onSaveRequested: (values: {angle: number, cos: number, sin: number}) => void,
 *  onClearRequested: () => void,
 *  valueMode?: 'both'|'cos'|'sin',
 * }} options
 * @returns {() => void}
 */
export function mountCosSinAnimation(target, options) {
  const wrapper = createElement('div', { className: 'board-zone' });
  target.append(wrapper);

  const { board, destroy } = createBoard(wrapper, {
    axis: true,
    grid: true,
    boundingbox: [-1.6, 1.6, 1.6, -1.6],
    keepAspectRatio: true,
  });

  const currentValue = {
    angle: 0,
    cos: 1,
    sin: 0,
    angleExact: '0',
    cosExact: '1',
    sinExact: '0',
  };
  const valueMode = options.valueMode || 'both';
  const showCos = valueMode !== 'sin';
  const showSin = valueMode !== 'cos';

  const O = board.create('point', [0, 0], {
    name: '',
    size: 2.5,
    strokeColor: '#111827',
    fillColor: '#111827',
    fixed: true,
    withLabel: false,
  });

  const circle = board.create('circle', [O, 1], {
    strokeWidth: 3,
    strokeColor: '#eab308',
  });

  const point = board.create('glider', [1, 0, circle], {
    name: 'P',
    size: 4,
    strokeColor: '#ef4444',
    fillColor: '#ef4444',
    withLabel: true,
    label: { offset: [8, -10] },
  });

  const projectionX = board.create('point', [() => point.X(), 0], {
    name: 'A',
    size: 3,
    strokeColor: '#38bdf8',
    fillColor: '#38bdf8',
    fixed: true,
    withLabel: false,
  });

  const projectionY = board.create('point', [0, () => point.Y()], {
    name: 'B',
    size: 3,
    strokeColor: '#34d399',
    fillColor: '#34d399',
    fixed: true,
    withLabel: false,
  });

  board.create('segment', [O, point], {
    strokeColor: '#93c5fd',
    strokeWidth: 4,
    strokeOpacity: 0.9,
  });

  board.create('segment', [point, projectionX], {
    strokeColor: '#38bdf8',
    strokeWidth: 2,
    dash: 2,
    strokeOpacity: 0.85,
  });

  board.create('segment', [point, projectionY], {
    strokeColor: '#34d399',
    strokeWidth: 2,
    dash: 2,
    strokeOpacity: 0.85,
  });

  board.create('segment', [O, projectionX], {
    strokeColor: '#38bdf8',
    strokeWidth: 4,
    strokeOpacity: 0.9,
  });

  board.create('segment', [O, projectionY], {
    strokeColor: '#34d399',
    strokeWidth: 4,
    strokeOpacity: 0.9,
  });

  board.create('text', [-1.55, 1.45, () => {
    const parts = [`θ = ${displayAngle(currentValue)}`];
    if (showCos) {
      parts.push(`cos(θ) = ${displayCos(currentValue)}`);
    }
    if (showSin) {
      parts.push(`sin(θ) = ${displaySin(currentValue)}`);
    }
    return parts.join(' | ');
  }], {
    strokeColor: '#111827',
    fontSize: 14,
  });

  board.create('text', [() => point.X() - 0.4, () => point.Y() + 0.16, () => {
    if (showCos && showSin) {
      return `(${displayCos(currentValue)}, ${displaySin(currentValue)})`;
    }
    if (showCos) {
      return `cos(θ) = ${displayCos(currentValue)}`;
    }
    return `sin(θ) = ${displaySin(currentValue)}`;
  }], {
    strokeColor: '#111827',
    fontSize: 13,
  });

  const controls = createElement('div', { className: 'control-row' });
  const saveButton = createElement('button', {
    className: 'btn btn-primary',
    attrs: { type: 'button' },
    text: 'Enregistrer',
  });
  const clearButton = createElement('button', {
    className: 'btn btn-danger',
    attrs: { type: 'button' },
    text: 'Réinitialiser le tableau',
  });

  controls.append(saveButton, clearButton);
  wrapper.append(controls);

  let isSnapping = false;

  const closestClassicValue = (angle) => CLASSIC_VALUES.reduce((best, candidate) => {
    const currentDistance = angleDistance(angle, candidate.angle);
    if (!best || currentDistance < best.distance) {
      return { distance: currentDistance, value: candidate };
    }
    return best;
  }, null)?.value || CLASSIC_VALUES[0];

  function displayAngle(value) {
    return value.angleExact || formatNumber(value.angle, 3);
  }

  function displayCos(value) {
    return value.cosExact || formatNumber(value.cos, 3);
  }

  function displaySin(value) {
    return value.sinExact || formatNumber(value.sin, 3);
  }

  function updateCurrentValue() {
    const cos = point.X();
    const sin = point.Y();
    const angle = angleFromXY(cos, sin);
    const closest = closestClassicValue(angle);
    const distance = angleDistance(angle, closest.angle);

    if (distance <= SNAP_TOLERANCE) {
      currentValue.angle = closest.angle;
      currentValue.cos = closest.cos;
      currentValue.sin = closest.sin;
      currentValue.angleExact = closest.angleExact;
      currentValue.cosExact = closest.cosExact;
      currentValue.sinExact = closest.sinExact;
      return;
    }

    currentValue.angle = angle;
    currentValue.cos = cos;
    currentValue.sin = sin;
    currentValue.angleExact = undefined;
    currentValue.cosExact = undefined;
    currentValue.sinExact = undefined;
  }

  const readCurrent = () => {
    return {
      angle: currentValue.angle,
      cos: currentValue.cos,
      sin: currentValue.sin,
      angleExact: currentValue.angleExact,
      cosExact: currentValue.cosExact,
      sinExact: currentValue.sinExact,
    };
  };

  const emitCurrent = () => {
    options.onCurrentValues(readCurrent());
  };

  const maybeSnap = () => {
    if (isSnapping) {
      return;
    }

    const currentAngle = angleFromXY(point.X(), point.Y());
    const closest = closestClassicValue(currentAngle);
    const distance = angleDistance(currentAngle, closest.angle);

    if (distance > SNAP_TOLERANCE) {
      return;
    }

    isSnapping = true;
    point.moveTo([closest.cos, closest.sin], 0);
    isSnapping = false;
  };

  point.on('drag', () => {
    maybeSnap();
    updateCurrentValue();
    emitCurrent();
  });

  point.on('up', () => {
    maybeSnap();
    updateCurrentValue();
    emitCurrent();
  });

  saveButton.addEventListener('click', () => {
    options.onSaveRequested(readCurrent());
  });

  clearButton.addEventListener('click', () => {
    options.onClearRequested();
  });

  updateCurrentValue();
  emitCurrent();

  return () => {
    destroy();
  };
}
