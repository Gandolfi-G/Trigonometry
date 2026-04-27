import { createElement } from '/assets/js/core/utils.js';
import { createBoard } from '/assets/js/jsxgraph/board-utils.js';

const BOUNDING_BOX = [-1.8, 1.8, 1.8, -1.8];
const PHASE_TRANSITION_HOLD_MS = 900;
const LOOP_END_HOLD_MS = 900;

function clampProgress(value) {
  return Math.max(0, Math.min(3, value));
}

function getPhaseLabel(progress) {
  if (progress < 1) return '01 - Segment';
  if (progress < 2) return '02 - Rotation';
  return '03 - Enroulement';
}

/**
 * Animation du radian en 3 phases (référence trigo-03).
 * @param {HTMLElement} target
 * @returns {() => void}
 */
export function mountRadianAnimation(target) {
  const wrapper = createElement('div', { className: 'board-zone' });
  target.append(wrapper);

  const { board, destroy } = createBoard(wrapper, {
    axis: true,
    grid: true,
    boundingbox: BOUNDING_BOX,
    keepAspectRatio: true,
  });

  const O = board.create('point', [0, 0], {
    name: '',
    fixed: true,
    size: 2,
    strokeColor: '#111827',
    fillColor: '#111827',
  });

  board.create('circle', [O, 1], {
    strokeWidth: 2,
    strokeColor: '#3b82f6',
    fixed: true,
    highlight: false,
  });

  const A = board.create('point', [1, 0], {
    name: '',
    fixed: true,
    size: 3,
    strokeColor: '#ef4444',
    fillColor: '#ef4444',
    highlight: false,
    showInfobox: false,
  });

  const radianLength = 1;
  const P = board.create('point', [
    () => Math.cos(radianLength),
    () => Math.sin(radianLength),
  ], {
    name: '',
    fixed: true,
    size: 3,
    strokeColor: '#ef4444',
    fillColor: '#ef4444',
    highlight: false,
    showInfobox: false,
  });

  board.create('segment', [O, A], {
    strokeColor: '#9ca3af',
    strokeOpacity: 0.7,
    strokeWidth: 2,
    fixed: true,
    highlight: false,
  });

  board.create('segment', [O, P], {
    strokeColor: '#9ca3af',
    strokeOpacity: 0.25,
    strokeWidth: 2,
    fixed: true,
    highlight: false,
  });

  const angleOneRadian = board.create('angle', [A, O, P], {
    radius: 0.35,
    withLabel: false,
    strokeWidth: 3,
    strokeColor: '#ff6a00',
    fillColor: '#ff6a00',
    fillOpacity: 0.12,
    fixed: true,
    visible: false,
    highlight: false,
  });

  const oneRadLabel = board.create('text', [
    () => 0.45 * Math.cos(radianLength / 2),
    () => 0.45 * Math.sin(radianLength / 2),
    '1 rad',
  ], {
    fontSize: 28,
    strokeColor: '#111827',
    cssStyle: 'font-weight: 700;',
    fixed: true,
    visible: false,
    anchorX: 'middle',
    anchorY: 'middle',
    highlight: false,
  });

  const movingEndpoint = board.create('point', [0, 0], {
    name: '',
    fixed: true,
    size: 3,
    strokeColor: '#ef4444',
    fillColor: '#ef4444',
    highlight: false,
    showInfobox: false,
  });

  const rigidSegment = board.create('segment', [A, movingEndpoint], {
    strokeColor: '#ef4444',
    strokeWidth: 5,
    highlight: false,
    fixed: true,
  });

  let bend = 0;
  const softCurve = board.create('curve', [
    (t) => (1 - bend) * 1 + bend * Math.cos(t),
    (t) => (1 - bend) * t + bend * Math.sin(t),
    0,
    () => radianLength,
  ], {
    strokeColor: '#ef4444',
    strokeWidth: 5,
    visible: false,
    highlight: false,
  });

  const controls = createElement('div', { className: 'control-row' });
  const playButton = createElement('button', { className: 'btn btn-primary', attrs: { type: 'button' }, text: 'Play' });
  const pauseButton = createElement('button', { className: 'btn btn-secondary', attrs: { type: 'button' }, text: 'Pause' });
  const resetButton = createElement('button', { className: 'btn btn-secondary', attrs: { type: 'button' }, text: 'Reset' });
  const slider = createElement('input', {
    attrs: {
      type: 'range',
      min: '0',
      max: '3',
      step: '0.001',
      value: '0',
    },
  });
  const phaseChip = createElement('span', { className: 'value-chip', text: '01 - Segment' });
  const phaseButton1 = createElement('button', { className: 'btn btn-secondary', attrs: { type: 'button' }, text: '01 Segment' });
  const phaseButton2 = createElement('button', { className: 'btn btn-secondary', attrs: { type: 'button' }, text: '02 Rotation' });
  const phaseButton3 = createElement('button', { className: 'btn btn-secondary', attrs: { type: 'button' }, text: '03 Enroulement' });

  controls.append(playButton, pauseButton, resetButton, slider, phaseChip, phaseButton1, phaseButton2, phaseButton3);
  wrapper.append(controls);

  let progress = 0;
  let playing = false;
  let rafId = null;
  let lastTick = null;
  let holdUntil = null;
  let holdType = null;

  function setProgress(nextProgress) {
    progress = clampProgress(nextProgress);
    slider.value = progress.toFixed(3);
    phaseChip.textContent = getPhaseLabel(progress);

    const phase = progress < 1 ? 1 : progress < 2 ? 2 : 3;

    rigidSegment.setAttribute({ visible: phase !== 3 });
    softCurve.setAttribute({ visible: phase === 3 });

    if (phase === 1) {
      movingEndpoint.setPositionDirectly(window.JXG.COORDS_BY_USER, [0, 0]);
      bend = 0;
    } else if (phase === 2) {
      const ratio = Math.min(1, Math.max(0, progress - 1));
      const angle = ratio * (Math.PI / 2);
      movingEndpoint.setPositionDirectly(window.JXG.COORDS_BY_USER, [1 - Math.cos(angle), Math.sin(angle)]);
      bend = 0;
    } else {
      bend = Math.min(1, Math.max(0, progress - 2));
      const endX = (1 - bend) * 1 + bend * Math.cos(radianLength);
      const endY = (1 - bend) * radianLength + bend * Math.sin(radianLength);
      movingEndpoint.setPositionDirectly(window.JXG.COORDS_BY_USER, [endX, endY]);
    }

    const completed = phase === 3 && bend >= 0.999;
    angleOneRadian.setAttribute({ visible: completed });
    oneRadLabel.setAttribute({ visible: completed });

    board.update();
  }

  function stopPlayback() {
    playing = false;
    lastTick = null;
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function tick(timestamp) {
    if (!playing) {
      return;
    }

    if (holdUntil !== null) {
      if (timestamp < holdUntil) {
        rafId = window.requestAnimationFrame(tick);
        return;
      }
      const finishedHoldType = holdType;
      holdUntil = null;
      holdType = null;
      if (finishedHoldType === 'loopEnd') {
        setProgress(0);
      }
      lastTick = timestamp;
    }

    if (lastTick === null) {
      lastTick = timestamp;
    }

    const elapsed = Math.min(0.04, (timestamp - lastTick) / 1000);
    lastTick = timestamp;

    const next = progress + 0.9 * elapsed;
    if (progress < 2 && next >= 2) {
      setProgress(2);
      holdUntil = timestamp + PHASE_TRANSITION_HOLD_MS;
      holdType = 'phaseTransition';
      rafId = window.requestAnimationFrame(tick);
      return;
    }

    if (next >= 3) {
      setProgress(3);
      holdUntil = timestamp + LOOP_END_HOLD_MS;
      holdType = 'loopEnd';
      rafId = window.requestAnimationFrame(tick);
      return;
    }

    setProgress(next);
    rafId = window.requestAnimationFrame(tick);
  }

  playButton.addEventListener('click', () => {
    if (progress >= 3) {
      setProgress(0);
    }
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
    holdUntil = null;
    holdType = null;
    setProgress(0);
  });

  slider.addEventListener('input', (event) => {
    stopPlayback();
    holdUntil = null;
    holdType = null;
    setProgress(Number(event.target.value));
  });

  phaseButton1.addEventListener('click', () => {
    stopPlayback();
    holdUntil = null;
    holdType = null;
    setProgress(0);
  });

  phaseButton2.addEventListener('click', () => {
    stopPlayback();
    holdUntil = null;
    holdType = null;
    setProgress(1.6);
  });

  phaseButton3.addEventListener('click', () => {
    stopPlayback();
    holdUntil = null;
    holdType = null;
    setProgress(2.6);
  });

  setProgress(0);

  return () => {
    stopPlayback();
    destroy();
  };
}
