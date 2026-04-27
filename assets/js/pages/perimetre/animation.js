import { createElement, formatNumber, clamp } from '/assets/js/core/utils.js';
import { createBoard } from '/assets/js/jsxgraph/board-utils.js';

const BOUNDING_BOX = [-2.2, 2, 4.8, -1.9];
const CIRCLE_CENTER = { x: -0.55, y: 0 };
const LOOP_HOLD_MS = 900;

function blendPoints(source, target, ratio) {
  return source.map((point, index) => [
    (1 - ratio) * point[0] + ratio * target[index][0],
    (1 - ratio) * point[1] + ratio * target[index][1],
  ]);
}

/**
 * Anime l'enroulement d'un demi-cercle sur une règle (référence trigo-02).
 * @param {HTMLElement} target
 * @returns {() => void}
 */
export function mountPerimetreAnimation(target) {
  const wrapper = createElement('div', { className: 'board-zone' });
  target.append(wrapper);

  const { board, destroy } = createBoard(wrapper, {
    axis: true,
    grid: true,
    boundingbox: BOUNDING_BOX,
    keepAspectRatio: true,
  });

  const O = board.create('point', [CIRCLE_CENTER.x, CIRCLE_CENTER.y], { name: '', visible: false, fixed: true, highlight: false });
  board.create('circle', [O, 1], { strokeColor: '#eab308', strokeWidth: 4, fixed: true, highlight: false, layer: 3 });

  const steps = 240;
  const arcPoints = [];
  const rulerPoints = [];
  const rulerX0 = CIRCLE_CENTER.x + 1.35;
  const rulerY0 = CIRCLE_CENTER.y + 0.75;

  for (let index = 0; index <= steps; index += 1) {
    const ratio = index / steps;
    const theta = ratio * Math.PI;
    arcPoints.push([CIRCLE_CENTER.x + Math.cos(theta), CIRCLE_CENTER.y + Math.sin(theta)]);
    rulerPoints.push([rulerX0 + (Math.PI - theta), rulerY0]);
  }

  let morphCurvePoints = arcPoints.map((point) => [...point]);
  let morphCurve = board.create('curve', [
    morphCurvePoints.map((point) => point[0]),
    morphCurvePoints.map((point) => point[1]),
  ], {
    strokeColor: '#ef4444',
    strokeWidth: 4,
    fixed: true,
    highlight: false,
    layer: 6,
  });

  const rulerPaddingX = 0.2;
  const rulerPaddingY = 0.26;
  const rulerP1 = board.create('point', [rulerX0 - rulerPaddingX, rulerY0 + rulerPaddingY], { visible: false, fixed: true, highlight: false });
  const rulerP2 = board.create('point', [rulerX0 + Math.PI + rulerPaddingX, rulerY0 + rulerPaddingY], { visible: false, fixed: true, highlight: false });
  const rulerP3 = board.create('point', [rulerX0 + Math.PI + rulerPaddingX, rulerY0 - rulerPaddingY], { visible: false, fixed: true, highlight: false });
  const rulerP4 = board.create('point', [rulerX0 - rulerPaddingX, rulerY0 - rulerPaddingY], { visible: false, fixed: true, highlight: false });

  const rulerBody = board.create('polygon', [rulerP1, rulerP2, rulerP3, rulerP4], {
    fillColor: '#f8fafc',
    fillOpacity: 1,
    borders: { strokeColor: '#cbd5e1', strokeWidth: 2 },
    fixed: true,
    highlight: false,
    layer: 4,
  });
  rulerBody.vertices.forEach((vertex) => {
    vertex.setAttribute({ visible: false, fixed: true, highlight: false });
  });

  board.create('segment', [[rulerX0, rulerY0], [rulerX0 + Math.PI, rulerY0]], {
    strokeColor: '#64748b',
    strokeWidth: 3,
    fixed: true,
    highlight: false,
    layer: 5,
  });

  const marks = [
    { index: 0, label: '0', major: true },
    { index: 1, label: 'π/4', major: false },
    { index: 2, label: 'π/2', major: true },
    { index: 3, label: '3π/4', major: false },
    { index: 4, label: 'π', major: true },
  ];

  marks.forEach(({ index, label, major }) => {
    const x = rulerX0 + index * (Math.PI / 4);
    const height = major ? 0.16 : 0.11;

    board.create('segment', [[x, rulerY0 - height], [x, rulerY0 + height]], {
      strokeColor: '#64748b',
      strokeWidth: major ? 3 : 2,
      fixed: true,
      highlight: false,
      layer: 5,
    });

    board.create('text', [x, rulerY0 - (rulerPaddingY + 0.08), label], {
      anchorX: 'middle',
      anchorY: 'top',
      fontSize: 12,
      strokeColor: '#0f172a',
      fixed: true,
      highlight: false,
      layer: 6,
    });
  });

  board.create('text', [rulerX0 + Math.PI, rulerY0 + (rulerPaddingY + 0.1), '≈ 3,14'], {
    anchorX: 'middle',
    anchorY: 'bottom',
    fontSize: 12,
    strokeColor: '#64748b',
    fixed: true,
    highlight: false,
    layer: 6,
  });

  const controls = createElement('div', { className: 'control-row' });
  const playButton = createElement('button', { className: 'btn btn-primary', attrs: { type: 'button' }, text: 'Play' });
  const pauseButton = createElement('button', { className: 'btn btn-secondary', attrs: { type: 'button' }, text: 'Pause' });
  const resetButton = createElement('button', { className: 'btn btn-secondary', attrs: { type: 'button' }, text: 'Reset' });
  const slider = createElement('input', {
    attrs: {
      type: 'range',
      min: '0',
      max: '1',
      step: '0.005',
      value: '0',
    },
  });
  const legend = createElement('p', {
    className: 'block-description',
    text: 'Le demi-cercle (longueur π) est déroulé sur la règle…',
  });

  controls.append(playButton, pauseButton, resetButton, slider);
  wrapper.append(controls, legend);

  let progress = 0;
  let playing = false;
  let rafId = null;
  let loopHoldUntil = null;

  function setProgress(nextProgress) {
    progress = clamp(nextProgress, 0, 1);
    slider.value = progress.toFixed(3);

    morphCurvePoints = blendPoints(arcPoints, rulerPoints, progress);

    board.removeObject(morphCurve);
    morphCurve = board.create('curve', [
      morphCurvePoints.map((point) => point[0]),
      morphCurvePoints.map((point) => point[1]),
    ], {
      strokeColor: '#ef4444',
      strokeWidth: 4,
      fixed: true,
      highlight: false,
      layer: 6,
    });

    if (progress < 1) {
      legend.textContent = `Le demi-cercle est déroulé sur la règle… (progression ${formatNumber(progress * 100, 0)}%)`;
    } else {
      legend.innerHTML = '<strong>Demi-périmètre = π</strong>  →  périmètre du cercle unité = <strong>2π</strong>';
    }

    board.update();
  }

  function stopPlayback() {
    playing = false;
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function tick(now) {
    if (!playing) {
      return;
    }

    if (loopHoldUntil !== null) {
      if (now < loopHoldUntil) {
        rafId = window.requestAnimationFrame(tick);
        return;
      }
      loopHoldUntil = null;
      setProgress(0);
    }

    const next = progress + 1 / (3 * 60);
    if (next >= 1) {
      setProgress(1);
      loopHoldUntil = now + LOOP_HOLD_MS;
    } else {
      setProgress(next);
    }

    rafId = window.requestAnimationFrame(tick);
  }

  playButton.addEventListener('click', () => {
    if (playing) {
      return;
    }
    playing = true;
    rafId = window.requestAnimationFrame(tick);
  });

  pauseButton.addEventListener('click', () => {
    stopPlayback();
  });

  resetButton.addEventListener('click', () => {
    stopPlayback();
    loopHoldUntil = null;
    setProgress(0);
  });

  slider.addEventListener('input', (event) => {
    stopPlayback();
    loopHoldUntil = null;
    const value = Number(event.target.value);
    setProgress(value);
  });

  setProgress(0);
  playButton.click();

  return () => {
    stopPlayback();
    destroy();
  };
}
