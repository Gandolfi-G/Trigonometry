import { createElement, formatNumber } from '/assets/js/core/utils.js';
import { createBoard } from '/assets/js/jsxgraph/board-utils.js';

const TAU = Math.PI * 2;
const EPS = 1e-6;
const TAN_CAP = 2.1;

const angleColorMap = {
  x: '#111827',
  negX: '#6b7280',
  piPlusX: '#ef4444',
  piMinusX: '#f59e0b',
  piOver2PlusX: '#16a34a',
  piOver2MinusX: '#06b6d4',
  twoPiMinusX: '#7c3aed',
};

const angleLabelMap = {
  x: 'x',
  negX: '-x',
  piPlusX: 'π+x',
  piMinusX: 'π-x',
  piOver2PlusX: 'π/2+x',
  piOver2MinusX: 'π/2-x',
  twoPiMinusX: '2π-x',
};

const FAMILY_COLOR = {
  cos: '#1d4ed8',
  sin: '#b91c1c',
};

const RELATION_FAMILY = {
  cos: {
    x: 'cos',
    negX: 'cos',
    piPlusX: 'cos',
    piMinusX: 'cos',
    piOver2PlusX: 'sin',
    piOver2MinusX: 'sin',
    twoPiMinusX: 'cos',
  },
  sin: {
    x: 'sin',
    negX: 'sin',
    piPlusX: 'sin',
    piMinusX: 'sin',
    piOver2PlusX: 'cos',
    piOver2MinusX: 'cos',
    twoPiMinusX: 'sin',
  },
};

function normalizeAngle(angle) {
  const mod = angle % TAU;
  return mod >= 0 ? mod : mod + TAU;
}

function angleFromToken(token, baseAngle) {
  switch (token) {
    case 'x':
      return baseAngle;
    case 'negX':
      return -baseAngle;
    case 'piPlusX':
      return Math.PI + baseAngle;
    case 'piMinusX':
      return Math.PI - baseAngle;
    case 'piOver2PlusX':
      return Math.PI / 2 + baseAngle;
    case 'piOver2MinusX':
      return Math.PI / 2 - baseAngle;
    case 'twoPiMinusX':
      return TAU - baseAngle;
    default:
      return baseAngle;
  }
}

/**
 * Animation de comparaison d'angles liés à x avec projections cos/sin/tan.
 * @param {HTMLElement} target
 * @param {{
 *  getState: () => { baseAngle: number, functionType: 'cos'|'sin'|'tan', angles: string[] },
 *  setState: (partial: Partial<{ baseAngle: number, functionType: 'cos'|'sin'|'tan', angles: string[] }>) => void,
 *  subscribe: (listener: (state: any) => void) => () => void,
 *  showAngleController?: boolean,
 * }} options
 * @returns {() => void}
 */
export function mountRelationsAnimation(target, options) {
  const wrapper = createElement('div', { className: 'board-zone' });
  target.append(wrapper);

  const { board, destroy } = createBoard(wrapper, {
    axis: true,
    grid: false,
    boundingbox: [-2.2, 2.2, 2.2, -2.2],
    keepAspectRatio: true,
  });

  const O = board.create('point', [0, 0], { fixed: true, visible: false });
  const I = board.create('point', [1, 0], { fixed: true, visible: false });

  const unitCircle = board.create('circle', [O, I], {
    strokeColor: '#111827',
    strokeWidth: 2.5,
  });

  const tangentTop = board.create('point', [1, TAN_CAP], { fixed: true, visible: false });
  const tangentBottom = board.create('point', [1, -TAN_CAP], { fixed: true, visible: false });

  const tangentLine = board.create('segment', [tangentTop, tangentBottom], {
    strokeColor: '#7c3aed',
    strokeWidth: 2,
    dash: 2,
    visible: false,
  });

  const tangentLabel = board.create('text', [1.06, TAN_CAP - 0.1, 'droite tangente x=1'], {
    strokeColor: '#7c3aed',
    fontSize: 12,
    anchorX: 'left',
    anchorY: 'middle',
    visible: false,
  });

  const pointP = board.create('glider', [
    () => Math.cos(options.getState().baseAngle),
    () => Math.sin(options.getState().baseAngle),
    unitCircle,
  ], {
    name: 'P',
    size: 4,
    color: '#111827',
    withLabel: true,
    label: { offset: [10, -10] },
  });

  const baseRay = board.create('segment', [O, pointP], {
    strokeColor: '#111827',
    strokeWidth: 4,
  });

  const tokens = Object.keys(angleColorMap);
  const objects = {};

  const legend = createElement('div', { className: 'inline-values' });
  const cosLegend = createElement('span', { className: 'value-chip', text: 'Bleu = longueur liée au cosinus' });
  const sinLegend = createElement('span', { className: 'value-chip', text: 'Rouge = longueur liée au sinus' });
  cosLegend.style.borderColor = FAMILY_COLOR.cos;
  cosLegend.style.color = FAMILY_COLOR.cos;
  sinLegend.style.borderColor = FAMILY_COLOR.sin;
  sinLegend.style.color = FAMILY_COLOR.sin;
  legend.append(cosLegend, sinLegend);
  wrapper.append(legend);

  const showAngleController = options.showAngleController !== false;
  let angleSlider = null;
  let angleLabel = null;

  if (showAngleController) {
    const angleControls = createElement('div', { className: 'control-row' });
    angleLabel = createElement('span', { className: 'value-chip' });
    angleSlider = createElement('input', {
      attrs: {
        type: 'range',
        min: '0',
        max: String(Math.round(Math.PI * 2 * 1000)),
        step: '1',
        value: String(Math.round(options.getState().baseAngle * 1000)),
      },
    });

    angleSlider.addEventListener('input', () => {
      const baseAngle = Number(angleSlider.value) / 1000;
      options.setState({ baseAngle });
    });

    angleControls.append(
      createElement('span', { text: 'Angle x :' }),
      angleSlider,
      angleLabel
    );
    wrapper.append(angleControls);
  }

  tokens.forEach((token) => {
    const angleValue = () => angleFromToken(token, options.getState().baseAngle);

    const point = board.create('point', [
      () => Math.cos(angleValue()),
      () => Math.sin(angleValue()),
    ], {
      name: '',
      fixed: true,
      size: token === 'x' ? 4.2 : 3.6,
      color: angleColorMap[token],
    });

    const ray = board.create('segment', [O, point], {
      strokeColor: angleColorMap[token],
      strokeWidth: token === 'x' ? 4 : 3,
      dash: token === 'x' ? 0 : 2,
    });

    const label = board.create('text', [
      () => 1.2 * point.X(),
      () => 1.2 * point.Y(),
      angleLabelMap[token],
    ], {
      color: angleColorMap[token],
      fontSize: 14,
      anchorX: 'middle',
      anchorY: 'middle',
    });

    const footX = board.create('point', [() => point.X(), 0], { fixed: true, visible: false });
    const footY = board.create('point', [0, () => point.Y()], { fixed: true, visible: false });

    const cosDrop = board.create('segment', [point, footX], {
      strokeColor: FAMILY_COLOR.cos,
      strokeWidth: 2,
      dash: 2,
      visible: false,
    });

    const cosAxis = board.create('segment', [O, footX], {
      strokeColor: FAMILY_COLOR.cos,
      strokeWidth: 4,
      visible: false,
      straightFirst: false,
      straightLast: false,
    });

    const sinDrop = board.create('segment', [point, footY], {
      strokeColor: FAMILY_COLOR.sin,
      strokeWidth: 2,
      dash: 2,
      visible: false,
    });

    const sinAxis = board.create('segment', [O, footY], {
      strokeColor: FAMILY_COLOR.sin,
      strokeWidth: 4,
      visible: false,
      straightFirst: false,
      straightLast: false,
    });

    const tanY = () => {
      const c = Math.cos(angleValue());
      if (Math.abs(c) < EPS) {
        return NaN;
      }
      return Math.max(-TAN_CAP, Math.min(TAN_CAP, Math.tan(angleValue())));
    };

    const tanPoint = board.create('point', [1, () => tanY()], {
      fixed: true,
      name: '',
      size: 2.6,
      color: '#7c3aed',
      visible: false,
    });

    const tanAxis = board.create('segment', [[1, 0], tanPoint], {
      strokeColor: '#7c3aed',
      strokeWidth: 4,
      visible: false,
      straightFirst: false,
      straightLast: false,
    });

    const tanRay = board.create('segment', [O, tanPoint], {
      strokeColor: '#7c3aed',
      strokeWidth: 2,
      dash: 2,
      visible: false,
      straightFirst: false,
      straightLast: false,
    });

    objects[token] = {
      point,
      ray,
      label,
      cosDrop,
      cosAxis,
      sinDrop,
      sinAxis,
      tanPoint,
      tanAxis,
      tanRay,
      angleValue,
    };
  });

  function syncBasePoint(angle) {
    pointP.setPositionDirectly(window.JXG.COORDS_BY_USER, [Math.cos(angle), Math.sin(angle)]);
  }

  let syncingFromState = false;

  pointP.on('drag', () => {
    if (syncingFromState) {
      return;
    }
    const angle = normalizeAngle(Math.atan2(pointP.Y(), pointP.X()));
    options.setState({ baseAngle: angle });
  });

  board.on('down', (event) => {
    if (syncingFromState) {
      return;
    }

    const [mouseX, mouseY] = board.getUsrCoordsOfMouse(event);
    const radius = Math.hypot(mouseX, mouseY);
    if (!Number.isFinite(radius) || radius < 0.05 || Math.abs(radius - 1) > 0.18) {
      return;
    }

    const nx = mouseX / radius;
    const ny = mouseY / radius;
    pointP.moveTo([nx, ny], 0);
    const angle = normalizeAngle(Math.atan2(ny, nx));
    options.setState({ baseAngle: angle });
  });

  function updateVisibility(state) {
    const active = new Set(state.angles);

    const tangentMode = state.functionType === 'tan';
    tangentLine.setAttribute({ visible: tangentMode });
    tangentLabel.setAttribute({ visible: tangentMode });

    tokens.forEach((token) => {
      const group = objects[token];
      const isActive = active.has(token);

      group.point.setAttribute({ visible: isActive });
      group.ray.setAttribute({ visible: isActive });
      group.label.setAttribute({ visible: isActive });

      const showCos = isActive && state.functionType === 'cos';
      const showSin = isActive && state.functionType === 'sin';

      if (showCos) {
        const family = RELATION_FAMILY.cos[token] || 'cos';
        const color = FAMILY_COLOR[family] || FAMILY_COLOR.cos;
        group.cosDrop.setAttribute({ strokeColor: color });
        group.cosAxis.setAttribute({ strokeColor: color });
      }

      if (showSin) {
        const family = RELATION_FAMILY.sin[token] || 'sin';
        const color = FAMILY_COLOR[family] || FAMILY_COLOR.sin;
        group.sinDrop.setAttribute({ strokeColor: color });
        group.sinAxis.setAttribute({ strokeColor: color });
      }

      group.cosDrop.setAttribute({ visible: showCos });
      group.cosAxis.setAttribute({ visible: showCos });
      group.sinDrop.setAttribute({ visible: showSin });
      group.sinAxis.setAttribute({ visible: showSin });

      const cosValue = Math.cos(group.angleValue());
      const showTan = isActive && state.functionType === 'tan' && Math.abs(cosValue) > EPS;
      group.tanPoint.setAttribute({ visible: showTan });
      group.tanAxis.setAttribute({ visible: showTan });
      group.tanRay.setAttribute({ visible: showTan });
    });

    board.update();
  }

  const unsubscribe = options.subscribe((state) => {
    syncingFromState = true;
    syncBasePoint(state.baseAngle);
    baseRay.setAttribute({ strokeColor: angleColorMap.x });
    syncingFromState = false;

    if (angleSlider && angleLabel) {
      const normalizedDeg = (state.baseAngle * 180) / Math.PI;
      angleSlider.value = String(Math.round(state.baseAngle * 1000));
      angleLabel.textContent = `x = ${formatNumber(state.baseAngle, 3)} rad (${formatNumber(normalizedDeg, 1)}°)`;
    }

    updateVisibility(state);
  });

  updateVisibility(options.getState());

  return () => {
    unsubscribe();
    destroy();
  };
}
