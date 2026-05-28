import { createElement, formatNumber } from '/Trigonometry/assets/js/core/utils.js';
import { createBoard } from '/Trigonometry/assets/js/jsxgraph/board-utils.js';

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
const BB = [-1.55, 1.55, 1.55, -1.55];

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

export function mountCosSinAnimation(target, options) {
  const wrapper = createElement('div', { className: 'board-zone' });
  target.append(wrapper);

  const { board, destroy } = createBoard(wrapper, {
    axis: true,
    grid: true,
    boundingbox: BB,
    keepAspectRatio: true,
  });

  // Keep board square — defer first call so CSS layout has resolved
  const boardEl = board.containerObj;
  function resizeBoard() {
    const w = boardEl.clientWidth;
    if (w > 0) {
      board.resizeContainer(w, w);
      board.setBoundingBox(BB, true);
    }
  }
  requestAnimationFrame(resizeBoard);
  window.addEventListener('resize', resizeBoard);

  const currentValue = {
    angle: 0, cos: 1, sin: 0,
    angleExact: '0', cosExact: '1', sinExact: '0',
  };
  const valueMode = options.valueMode || 'both';
  const showCos = valueMode !== 'sin';
  const showSin = valueMode !== 'cos';

  // Origin
  const O = board.create('point', [0, 0], {
    name: '', size: 2, strokeColor: '#374151', fillColor: '#374151',
    fixed: true, withLabel: false,
  });

  // Unit circle — site primary color
  const circle = board.create('circle', [O, 1], {
    strokeWidth: 2.5,
    strokeColor: '#176b87',
    fillColor: 'transparent',
  });

  // Point P
  const point = board.create('glider', [1, 0, circle], {
    name: 'P', size: 5,
    strokeColor: '#d96c3f', fillColor: '#d96c3f',
    withLabel: true, label: { offset: [8, -12], fontSize: 13, fontWeight: 'bold' },
  });

  // Projection feet
  const projX = board.create('point', [() => point.X(), 0], {
    name: '', size: 3, strokeColor: '#2563eb', fillColor: '#2563eb',
    fixed: true, withLabel: false,
  });
  const projY = board.create('point', [0, () => point.Y()], {
    name: '', size: 3, strokeColor: '#16a34a', fillColor: '#16a34a',
    fixed: true, withLabel: false,
  });

  // Radius OP
  board.create('segment', [O, point], {
    strokeColor: '#94a3b8', strokeWidth: 2, strokeOpacity: 0.8,
  });

  // cos projection: dashed P→A, solid O→A (blue)
  board.create('segment', [point, projX], {
    strokeColor: '#2563eb', strokeWidth: 1.5, dash: 2, strokeOpacity: 0.7,
  });
  board.create('segment', [O, projX], {
    strokeColor: '#2563eb', strokeWidth: 4, strokeOpacity: 0.85,
  });

  // sin projection: dashed P→B, solid O→B (green)
  board.create('segment', [point, projY], {
    strokeColor: '#16a34a', strokeWidth: 1.5, dash: 2, strokeOpacity: 0.7,
  });
  board.create('segment', [O, projY], {
    strokeColor: '#16a34a', strokeWidth: 4, strokeOpacity: 0.85,
  });

  // Coordinate label — placed radially outside P, clamped to board edges
  const LABEL_R = 1.28;   // distance from origin (just outside the unit circle)
  const MARGIN  = 0.18;   // keep label this far from each board edge
  const [bbL, bbT, bbR, bbB] = BB; // left, top, right, bottom

  board.create('text', [
    () => {
      const angle = angleFromXY(point.X(), point.Y());
      const raw = Math.cos(angle) * LABEL_R;
      return Math.max(bbL + MARGIN, Math.min(bbR - MARGIN, raw));
    },
    () => {
      const angle = angleFromXY(point.X(), point.Y());
      const raw = Math.sin(angle) * LABEL_R;
      return Math.max(bbB + MARGIN, Math.min(bbT - MARGIN, raw));
    },
    () => `(${displayCos(currentValue)}, ${displaySin(currentValue)})`,
  ], {
    fontSize: 12,
    color: '#374151',
    anchorX: 'middle',
    anchorY: 'middle',
  });

  // Board text — three color-coded lines, top-left
  board.create('text', [-1.50, 1.48, () => `θ = ${displayAngle(currentValue)}`], {
    color: '#5b21b6', fontSize: 13, fontStyle: 'bold',
  });
  if (showCos) {
    board.create('text', [-1.50, 1.30, () => `cos(θ) = ${displayCos(currentValue)}`], {
      color: '#1d4ed8', fontSize: 13,
    });
  }
  if (showSin) {
    board.create('text', [-1.50, showCos ? 1.12 : 1.30, () => `sin(θ) = ${displaySin(currentValue)}`], {
      color: '#15803d', fontSize: 13,
    });
  }

  // Controls
  const controls = createElement('div', { className: 'control-row' });
  const saveButton = createElement('button', {
    className: 'btn btn-primary', attrs: { type: 'button' }, text: '+ Enregistrer',
  });
  const clearButton = createElement('button', {
    className: 'btn btn-ghost', attrs: { type: 'button' }, text: 'Réinitialiser',
  });
  controls.append(saveButton, clearButton);
  wrapper.append(controls);

  let isSnapping = false;

  const closestClassicValue = (angle) => CLASSIC_VALUES.reduce((best, candidate) => {
    const d = angleDistance(angle, candidate.angle);
    if (!best || d < best.distance) return { distance: d, value: candidate };
    return best;
  }, null)?.value || CLASSIC_VALUES[0];

  function displayAngle(v) { return v.angleExact || formatNumber(v.angle, 3); }
  function displayCos(v)   { return v.cosExact   || formatNumber(v.cos, 3); }
  function displaySin(v)   { return v.sinExact   || formatNumber(v.sin, 3); }

  function updateCurrentValue() {
    const cos = point.X();
    const sin = point.Y();
    const angle = angleFromXY(cos, sin);
    const closest = closestClassicValue(angle);

    if (angleDistance(angle, closest.angle) <= SNAP_TOLERANCE) {
      Object.assign(currentValue, closest);
    } else {
      currentValue.angle = angle;
      currentValue.cos = cos;
      currentValue.sin = sin;
      currentValue.angleExact = undefined;
      currentValue.cosExact = undefined;
      currentValue.sinExact = undefined;
    }
  }

  const readCurrent = () => ({ ...currentValue });
  const emitCurrent = () => options.onCurrentValues(readCurrent());

  const maybeSnap = () => {
    if (isSnapping) return;
    const angle = angleFromXY(point.X(), point.Y());
    const closest = closestClassicValue(angle);
    if (angleDistance(angle, closest.angle) > SNAP_TOLERANCE) return;
    isSnapping = true;
    point.moveTo([closest.cos, closest.sin], 0);
    isSnapping = false;
  };

  point.on('drag', () => { maybeSnap(); updateCurrentValue(); emitCurrent(); });
  point.on('up',   () => { maybeSnap(); updateCurrentValue(); emitCurrent(); });

  saveButton.addEventListener('click',  () => options.onSaveRequested(readCurrent()));
  clearButton.addEventListener('click', () => options.onClearRequested());

  updateCurrentValue();
  emitCurrent();

  return () => {
    window.removeEventListener('resize', resizeBoard);
    destroy();
  };
}
