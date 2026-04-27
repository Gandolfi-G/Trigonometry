import { createElement } from '/Trigonometry/assets/js/core/utils.js';
import { createBoard } from '/Trigonometry/assets/js/jsxgraph/board-utils.js';
import { COLORS } from '/Trigonometry/assets/js/jsxgraph/common-styles.js';

const TAU = Math.PI * 2;
const ANTI_TRIGO_START = TAU - 0.0001;

function normalizeAngle(angle) {
  const mod = angle % TAU;
  return mod >= 0 ? mod : mod + TAU;
}

function getDirectionSign(rotationDirection) {
  return rotationDirection === 'antiTrigo' ? -1 : 1;
}

function toCartesian(radius, angle) {
  return [radius * Math.cos(angle), radius * Math.sin(angle)];
}

function getDirectionIndicatorData(directionSign) {
  const outerRadius = 1.28;
  const startAngle = Math.PI / 9;
  const endAngle = (5 * Math.PI) / 9;
  const tipAngle = directionSign > 0 ? endAngle : startAngle;
  const [startX, startY] = toCartesian(outerRadius, startAngle);
  const [endX, endY] = toCartesian(outerRadius, endAngle);
  const [tipX, tipY] = toCartesian(outerRadius, tipAngle);
  const tangentX = directionSign * -Math.sin(tipAngle);
  const tangentY = directionSign * Math.cos(tipAngle);
  return {
    startX,
    startY,
    endX,
    endY,
    tipX,
    tipY,
    tangentX,
    tangentY,
  };
}

function mountDirectionIndicator(board, centerPoint, getDirectionSignValue) {
  const tipSize = 0.12;

  const startPoint = board.create('point', [
    () => getDirectionIndicatorData(getDirectionSignValue()).startX,
    () => getDirectionIndicatorData(getDirectionSignValue()).startY,
  ], {
    visible: false,
    fixed: true,
    name: '',
  });
  const endPoint = board.create('point', [
    () => getDirectionIndicatorData(getDirectionSignValue()).endX,
    () => getDirectionIndicatorData(getDirectionSignValue()).endY,
  ], {
    visible: false,
    fixed: true,
    name: '',
  });

  board.create('arc', [centerPoint, startPoint, endPoint], {
    strokeColor: COLORS.helper,
    strokeWidth: 3,
  });

  const tipTail = board.create('point', [
    () => {
      const data = getDirectionIndicatorData(getDirectionSignValue());
      return data.tipX - data.tangentX * tipSize;
    },
    () => {
      const data = getDirectionIndicatorData(getDirectionSignValue());
      return data.tipY - data.tangentY * tipSize;
    },
  ], {
    visible: false,
    fixed: true,
    name: '',
  });
  const tipHead = board.create('point', [
    () => {
      const data = getDirectionIndicatorData(getDirectionSignValue());
      return data.tipX + data.tangentX * tipSize;
    },
    () => {
      const data = getDirectionIndicatorData(getDirectionSignValue());
      return data.tipY + data.tangentY * tipSize;
    },
  ], {
    visible: false,
    fixed: true,
    name: '',
  });

  board.create('arrow', [tipTail, tipHead], {
    strokeColor: COLORS.helper,
    strokeWidth: 3,
    lastArrow: true,
  });
}

/**
 * Animation du cercle trigonométrique.
 * @param {HTMLElement} target
 * @param {{
 *  showControls: boolean,
 *  rotationDirection?: 'trigo'|'antiTrigo',
 *  onAngleChange: (angle: number) => void
 * }} options
 * @returns {() => void}
 */
export function mountCercleAnimation(target, options) {
  const wrapper = createElement('div', { className: 'board-zone' });
  target.append(wrapper);

  const { board, destroy } = createBoard(wrapper, {
    axis: true,
    boundingbox: [-1.6, 1.6, 1.6, -1.6],
  });

  const O = board.create('point', [0, 0], {
    fixed: true,
    size: 2,
    name: 'O',
    color: COLORS.axis,
  });

  const A = board.create('point', [1, 0], {
    fixed: true,
    size: 2,
    name: 'I',
    color: COLORS.axis,
  });

  const unitCircle = board.create('circle', [O, A], {
    strokeColor: COLORS.circle,
    strokeWidth: 2,
  });

  let directionSign = getDirectionSign(options.rotationDirection);
  mountDirectionIndicator(board, O, () => directionSign);
  let angle = directionSign < 0 ? ANTI_TRIGO_START : 0;

  const point = board.create('glider', [1, 0, unitCircle], {
    name: 'P',
    size: 4,
    color: COLORS.point,
    snapToGrid: false,
  });

  const radiusSegment = board.create('segment', [O, point], {
    strokeColor: COLORS.point,
    strokeWidth: 2,
  });

  const directionPoint = board.create(
    'point',
    [
      () => Math.cos(angle + directionSign * 0.2),
      () => Math.sin(angle + directionSign * 0.2),
    ],
    {
      visible: false,
      name: '',
    }
  );

  board.create('arrow', [point, directionPoint], {
    strokeColor: COLORS.helper,
    strokeWidth: 2,
    lastArrow: true,
  });

  board.create('arc', [O, A, point], {
    strokeColor: COLORS.arc,
    strokeWidth: 2,
  });

  let intervalId = null;
  let sliderInput = null;

  const setAngle = (nextAngle) => {
    angle = normalizeAngle(nextAngle);
    point.setPositionDirectly(window.JXG.COORDS_BY_USER, [Math.cos(angle), Math.sin(angle)]);
    if (sliderInput) {
      sliderInput.value = String(Math.round(angle * 100));
    }
    board.update();
    options.onAngleChange(angle);
  };

  point.on('drag', () => {
    angle = normalizeAngle(Math.atan2(point.Y(), point.X()));
    options.onAngleChange(angle);
    board.update();
  });

  if (options.showControls) {
    const controls = createElement('div', { className: 'control-row' });
    const playButton = createElement('button', {
      className: 'btn btn-primary',
      attrs: { type: 'button' },
      text: 'Play',
    });
    const pauseButton = createElement('button', {
      className: 'btn btn-secondary',
      attrs: { type: 'button' },
      text: 'Pause',
    });
    const resetButton = createElement('button', {
      className: 'btn btn-secondary',
      attrs: { type: 'button' },
      text: 'Reset',
    });
    const slider = createElement('input', {
      attrs: {
        type: 'range',
        min: '0',
        max: String(Math.round(TAU * 100)),
        step: '1',
        value: '0',
      },
    });
    const directionButton = createElement('button', {
      className: 'btn btn-secondary',
      attrs: { type: 'button' },
      text: '',
    });
    sliderInput = slider;

    const updateDirectionButtonLabel = () => {
      directionButton.textContent = directionSign > 0
        ? 'Sens: trigonométrique'
        : 'Sens: anti-trigonométrique';
    };
    updateDirectionButtonLabel();

    controls.append(playButton, pauseButton, resetButton, directionButton, slider);
    wrapper.append(controls);

    playButton.addEventListener('click', () => {
      if (intervalId) {
        return;
      }
      intervalId = window.setInterval(() => {
        setAngle(angle + directionSign * 0.02);
      }, 25);
    });

    pauseButton.addEventListener('click', () => {
      if (!intervalId) {
        return;
      }
      clearInterval(intervalId);
      intervalId = null;
    });

    resetButton.addEventListener('click', () => {
      setAngle(directionSign < 0 ? ANTI_TRIGO_START : 0);
    });

    directionButton.addEventListener('click', () => {
      directionSign *= -1;
      updateDirectionButtonLabel();
      board.update();
    });

    slider.addEventListener('input', () => {
      const next = Number(slider.value) / 100;
      setAngle(next);
    });
  }

  setAngle(directionSign < 0 ? ANTI_TRIGO_START : 0);

  return () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    radiusSegment?.remove?.();
    destroy();
  };
}
