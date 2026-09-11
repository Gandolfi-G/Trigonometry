import { equationsInequationsVideos } from './content/equations-inequations-videos.js';
import { VERSION_LABEL, RELEASE_DATE } from './core/version.js';

const versionNode = document.getElementById('site-version');
const releaseNode = document.getElementById('release-date');
const manimListNode = document.getElementById('manim-list');

if (versionNode) versionNode.textContent = VERSION_LABEL;
if (releaseNode) releaseNode.textContent = RELEASE_DATE;

const equationExamples = [
  {
    id: 'constant-simple',
    title: 'x + 7 = 12',
    original: 'x + 7 = 12',
    solution: 5,
    verification: ['5 + 7 = 12', '12 = 12'],
    steps: [
      {
        goal: 'On veut enlever le +7 du membre gauche.',
        before: { left: 'x + 7', right: '12' },
        kind: 'add',
        value: -7,
        unit: 'number',
        after: { left: 'x', right: '5' },
        simplification: 'À gauche, +7 - 7 donne 0. À droite, 12 - 7 donne 5.',
      },
    ],
  },
  {
    id: 'coefficient-simple',
    title: '3x - 5 = 10',
    original: '3x - 5 = 10',
    solution: 5,
    verification: ['3 · 5 - 5 = 10', '10 = 10'],
    steps: [
      {
        goal: 'On veut enlever le -5 du membre gauche.',
        before: { left: '3x - 5', right: '10' },
        kind: 'add',
        value: 5,
        unit: 'number',
        after: { left: '3x', right: '15' },
        simplification: 'À gauche, -5 + 5 donne 0. À droite, 10 + 5 donne 15.',
      },
      {
        goal: 'Il reste 3 fois x : on divise par 3.',
        before: { left: '3x', right: '15' },
        kind: 'divide',
        value: 3,
        after: { left: 'x', right: '5' },
        simplification: '3x ÷ 3 donne x. 15 ÷ 3 donne 5.',
      },
    ],
  },
  {
    id: 'x-two-sides',
    title: '4x + 6 = 2x + 18',
    original: '4x + 6 = 2x + 18',
    solution: 6,
    verification: ['4 · 6 + 6 = 2 · 6 + 18', '30 = 30'],
    steps: [
      {
        goal: 'On regroupe les x du même côté en enlevant 2x à droite.',
        before: { left: '4x + 6', right: '2x + 18' },
        kind: 'add',
        value: -2,
        unit: 'x',
        after: { left: '2x + 6', right: '18' },
        simplification: 'À gauche, 4x - 2x donne 2x. À droite, 2x - 2x donne 0.',
      },
      {
        goal: 'On enlève ensuite le +6 du membre gauche.',
        before: { left: '2x + 6', right: '18' },
        kind: 'add',
        value: -6,
        unit: 'number',
        after: { left: '2x', right: '12' },
        simplification: 'À gauche, +6 - 6 donne 0. À droite, 18 - 6 donne 12.',
      },
      {
        goal: 'Il reste 2 fois x : on divise par 2.',
        before: { left: '2x', right: '12' },
        kind: 'divide',
        value: 2,
        after: { left: 'x', right: '6' },
        simplification: '2x ÷ 2 donne x. 12 ÷ 2 donne 6.',
      },
    ],
  },
];

let equationState = {
  exampleIndex: 0,
  stepIndex: 0,
  pending: null,
  history: [],
};

function formatNumber(value) {
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(2).replace(/\.?0+$/, '');
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatSignedTerm(value, unit = 'number', compact = false) {
  const sign = value >= 0 ? '+' : '-';
  const abs = Math.abs(value);
  const number = unit === 'x' && abs === 1 ? '' : formatNumber(abs);
  const body = unit === 'x' ? `${number}x` : number;
  return compact ? `${sign}${body}` : `${sign} ${body}`;
}

function formatOperation(operation, compact = false) {
  if (operation.kind === 'divide') return compact ? `÷${formatNumber(operation.value)}` : `÷ ${formatNumber(operation.value)}`;
  return formatSignedTerm(operation.value, operation.unit, compact);
}

function currentExample() {
  return equationExamples[equationState.exampleIndex];
}

function currentParts() {
  const example = currentExample();
  if (equationState.stepIndex >= example.steps.length) {
    return example.steps.at(-1).after;
  }
  return example.steps[equationState.stepIndex].before;
}

function isFinalStep() {
  return equationState.stepIndex >= currentExample().steps.length;
}

function operationMatchesStep(operation, step) {
  if (operation.side !== 'both' || operation.kind !== step.kind) return false;
  if (operation.kind === 'divide') return Math.abs(operation.value - step.value) < 0.0001;
  return operation.unit === step.unit && Math.abs(operation.value - step.value) < 0.0001;
}

function buildPendingSide(text, operation, sideName) {
  const applies = operation.side === 'both' || operation.side === sideName;
  if (!applies) return text;
  if (operation.kind === 'divide') return `(${text}) ÷ ${formatNumber(operation.value)}`;
  return `${text} ${formatSignedTerm(operation.value, operation.unit)}`;
}

function computeTilt(operation) {
  if (!operation || operation.side === 'both') return 0;
  if (operation.kind === 'divide') return operation.side === 'left' ? 8 : -8;
  const direction = Math.sign(operation.value || 1);
  return operation.side === 'left' ? -8 * direction : 8 * direction;
}

function readOperation() {
  return {
    kind: document.getElementById('equation-action')?.value || 'add',
    value: Number(document.getElementById('equation-value')?.value || 0),
    unit: document.getElementById('equation-unit')?.value || 'number',
    side: document.getElementById('equation-side')?.value || 'both',
  };
}

function stepOperation(step) {
  return {
    kind: step.kind,
    value: step.value,
    unit: step.unit || 'number',
    side: 'both',
  };
}

function setControlsForStep() {
  const action = document.getElementById('equation-action');
  const value = document.getElementById('equation-value');
  const unit = document.getElementById('equation-unit');
  const side = document.getElementById('equation-side');
  const step = currentExample().steps[equationState.stepIndex];
  if (!step) return;
  action.value = step.kind;
  value.value = step.value;
  unit.value = step.unit || 'number';
  side.value = 'both';
  updateEquationControlLabels();
}

function updateEquationControlLabels() {
  const action = document.getElementById('equation-action')?.value || 'add';
  const valueField = document.getElementById('equation-value-field');
  const unitField = document.getElementById('equation-unit-field');
  const unit = document.getElementById('equation-unit');
  if (valueField) valueField.firstChild.textContent = action === 'divide' ? 'diviseur ' : 'valeur ';
  if (unitField) unitField.hidden = action === 'divide';
  if (unit) unit.disabled = action === 'divide';
}

function panMarkup(name, expressionText, operation, sideName) {
  const hasWeight = operation && (operation.side === 'both' || operation.side === sideName);
  const chipClass = operation?.kind === 'divide' ? 'solver-weight-division' : 'solver-weight-addition';
  const chip = hasWeight ? `<span class="solver-weight ${chipClass}">${escapeHtml(formatOperation(operation, true))}</span>` : '';
  return `
    <span class="solver-pan-name">${name}</span>
    <strong>${escapeHtml(expressionText)}</strong>
    <span class="solver-weight-row">${chip}</span>
  `;
}

function renderEquationHistory() {
  const history = document.getElementById('equation-history');
  if (!history) return;
  const example = currentExample();
  const rows = [
    `<li><span>Départ</span><strong>${escapeHtml(example.original)}</strong></li>`,
    ...equationState.history.map(
      (entry) => `
        <li>
          <span>${escapeHtml(entry.operation)}</span>
          <strong>${escapeHtml(entry.left)} = ${escapeHtml(entry.right)}</strong>
          <em>${escapeHtml(entry.simplification)}</em>
        </li>
      `,
    ),
  ];
  history.innerHTML = rows.join('');
}

function renderEquationVerification() {
  const box = document.getElementById('equation-verification');
  const check = document.getElementById('equation-check');
  if (!box || !check) return;
  const example = currentExample();
  box.hidden = !isFinalStep();
  if (!isFinalStep()) {
    check.textContent = '';
    return;
  }
  check.innerHTML = `
    Équation de départ : ${escapeHtml(example.original)}<br>
    On remplace x par ${formatNumber(example.solution)} : ${escapeHtml(example.verification[0])}<br>
    ${escapeHtml(example.verification[1])}, donc la valeur trouvée vérifie bien l'équation.
  `;
}

function renderEquationSolver() {
  const example = currentExample();
  const step = example.steps[equationState.stepIndex];
  const parts = currentParts();
  const pending = equationState.pending;
  const display = pending
    ? {
        left: buildPendingSide(parts.left, pending.operation, 'left'),
        right: buildPendingSide(parts.right, pending.operation, 'right'),
      }
    : parts;
  const operation = pending?.operation || null;

  const left = document.getElementById('balance-left');
  const right = document.getElementById('balance-right');
  const beam = document.getElementById('solver-beam');
  const feedback = document.getElementById('equation-feedback');
  const start = document.getElementById('equation-start');
  const stepLabel = document.getElementById('equation-step-label');
  const apply = document.getElementById('equation-apply');
  const simplify = document.getElementById('equation-simplify');
  const undo = document.getElementById('equation-undo');

  if (left) left.innerHTML = panMarkup('Membre gauche', display.left, operation, 'left');
  if (right) right.innerHTML = panMarkup('Membre droit', display.right, operation, 'right');

  const tilt = computeTilt(operation);
  if (beam) {
    beam.style.transform = `translateX(-50%) rotate(${tilt}deg)`;
    beam.querySelectorAll('.solver-pan').forEach((pan) => {
      pan.style.transform = `rotate(${-tilt}deg)`;
    });
  }

  if (start) start.textContent = `Équation de départ : ${example.original}`;
  if (stepLabel) {
    stepLabel.textContent = step ? `Étape ${equationState.stepIndex + 1} : ${step.goal}` : `Solution obtenue : x = ${formatNumber(example.solution)}`;
  }

  if (feedback) {
    feedback.className = 'equation-feedback';
    if (!pending && step) {
      const expected = formatOperation(stepOperation(step), true);
      feedback.textContent = `Opération attendue : ${expected} sur les deux membres.`;
    } else if (pending && pending.operation.side !== 'both') {
      feedback.classList.add('equation-feedback-error');
      feedback.textContent = "La balance n'est plus à l'équilibre : l'opération n'a pas été faite des deux côtés.";
    } else if (pending && pending.correct) {
      feedback.classList.add('equation-feedback-ok');
      feedback.textContent = 'La balance reste équilibrée. On peut maintenant calculer les simplifications.';
    } else if (pending) {
      feedback.classList.add('equation-feedback-warn');
      feedback.textContent =
        pending.operation.kind === 'divide'
          ? "La balance reste équilibrée, mais cette division n'isole pas x à cette étape. Utilise Retour."
          : "La balance reste équilibrée, mais ce poids ne simplifie pas l'étape utile. Utilise Retour.";
    } else {
      feedback.classList.add('equation-feedback-ok');
      feedback.textContent = `On a trouvé x = ${formatNumber(example.solution)}. Vérifions dans l'équation de départ.`;
    }
  }

  if (apply) apply.disabled = isFinalStep();
  if (simplify) simplify.disabled = !pending || isFinalStep();
  if (undo) undo.disabled = !pending && equationState.stepIndex === 0;

  renderEquationHistory();
  renderEquationVerification();
}

function applyEquationOperation() {
  if (isFinalStep()) return;
  const operation = readOperation();
  if (operation.kind === 'divide' && operation.value === 0) {
    const feedback = document.getElementById('equation-feedback');
    if (feedback) {
      feedback.className = 'equation-feedback equation-feedback-error';
      feedback.textContent = 'On ne peut pas diviser par 0.';
    }
    return;
  }
  const step = currentExample().steps[equationState.stepIndex];
  equationState.pending = {
    operation,
    correct: operationMatchesStep(operation, step),
  };
  renderEquationSolver();
}

function simplifyEquationStep() {
  const pending = equationState.pending;
  const feedback = document.getElementById('equation-feedback');
  if (!pending) return;
  if (pending.operation.side !== 'both') {
    if (feedback) {
      feedback.className = 'equation-feedback equation-feedback-error';
      feedback.textContent = "Impossible de passer à l'étape suivante : la balance n'est pas à l'équilibre.";
    }
    return;
  }
  if (!pending.correct) {
    if (feedback) {
      feedback.className = 'equation-feedback equation-feedback-warn';
      feedback.textContent = "Cette opération est équilibrée, mais elle ne fait pas avancer la résolution prévue. Fais Retour.";
    }
    return;
  }

  const step = currentExample().steps[equationState.stepIndex];
  equationState.history.push({
    operation: `${formatOperation(pending.operation, true)} sur les deux membres`,
    left: step.after.left,
    right: step.after.right,
    simplification: step.simplification,
  });
  equationState.stepIndex += 1;
  equationState.pending = null;
  if (!isFinalStep()) setControlsForStep();
  renderEquationSolver();
}

function undoEquationOperation() {
  if (equationState.pending) {
    equationState.pending = null;
  } else if (equationState.stepIndex > 0) {
    equationState.stepIndex -= 1;
    equationState.history.pop();
    setControlsForStep();
  }
  renderEquationSolver();
}

function resetEquationSolver() {
  equationState.stepIndex = 0;
  equationState.pending = null;
  equationState.history = [];
  setControlsForStep();
  renderEquationSolver();
}

function setupEquationSolver() {
  const select = document.getElementById('equation-example');
  if (select) {
    select.innerHTML = equationExamples
      .map((example, index) => `<option value="${index}">${escapeHtml(example.title)}</option>`)
      .join('');
    select.value = String(equationState.exampleIndex);
    select.addEventListener('change', () => {
      equationState.exampleIndex = Number(select.value);
      resetEquationSolver();
    });
  }
  document.getElementById('equation-action')?.addEventListener('change', updateEquationControlLabels);
  document.getElementById('equation-apply')?.addEventListener('click', applyEquationOperation);
  document.getElementById('equation-simplify')?.addEventListener('click', simplifyEquationStep);
  document.getElementById('equation-undo')?.addEventListener('click', undoEquationOperation);
  document.getElementById('equation-reset')?.addEventListener('click', resetEquationSolver);
  setControlsForStep();
  renderEquationSolver();
}

function formatPolynomialTerm(coef, variable, first = false) {
  if (coef === 0) return '';
  const sign = coef < 0 ? '-' : '+';
  const abs = Math.abs(coef);
  const coefText = variable && abs === 1 ? '' : formatNumber(abs);
  const term = variable ? `${coefText}${variable}` : formatNumber(abs);
  if (first) return coef < 0 ? `-${term}` : term;
  return ` ${sign} ${term}`;
}

function formatPolynomial(a, b, c) {
  const terms = [
    { coef: a, variable: 'x²' },
    { coef: b, variable: 'x' },
    { coef: c, variable: '' },
  ].filter((term) => term.coef !== 0);
  if (!terms.length) return '0';
  return terms.map((term, index) => formatPolynomialTerm(term.coef, term.variable, index === 0)).join('');
}

function formulaFactor(value) {
  return value < 0 ? `(${formatNumber(value)})` : formatNumber(value);
}

function deltaKind(delta) {
  if (delta > 0) return 'positive';
  if (delta < 0) return 'negative';
  return 'zero';
}

function deltaSolutionText(delta, a) {
  if (a === 0) return "a = 0 : ce n'est pas une parabole, donc le discriminant du second degré ne s'applique pas.";
  if (delta > 0) return 'Δ > 0 : deux solutions réelles, la parabole coupe deux fois l’axe des x.';
  if (delta < 0) return 'Δ < 0 : aucune solution réelle, la parabole ne coupe pas l’axe des x.';
  return 'Δ = 0 : une solution réelle double, la parabole touche l’axe des x en un seul point.';
}

function parabolaSvg(opening, roots) {
  const variants = {
    'up-two': { path: 'M16 14 Q80 150 144 14', axis: 62, markers: [[45, 62], [115, 62]] },
    'up-one': { path: 'M16 18 Q80 146 144 18', axis: 82, markers: [[80, 82]] },
    'up-none': { path: 'M16 10 Q80 58 144 10', axis: 92, markers: [] },
    'down-two': { path: 'M16 98 Q80 -38 144 98', axis: 50, markers: [[45, 50], [115, 50]] },
    'down-one': { path: 'M16 94 Q80 -34 144 94', axis: 30, markers: [[80, 30]] },
    'down-none': { path: 'M16 104 Q80 58 144 104', axis: 24, markers: [] },
  };
  const key = `${opening}-${roots}`;
  const visual = variants[key];
  const markers = visual.markers
    .map(([x, y]) => `<circle class="parabola-root" cx="${x}" cy="${y}" r="4.5"></circle>`)
    .join('');
  return `
    <svg class="parabola-mini" viewBox="0 0 160 112" role="img" aria-label="Parabole ${opening === 'up' ? 'convexe' : 'concave'} avec ${roots === 'two' ? 'deux intersections' : roots === 'one' ? 'une tangence' : 'aucune intersection'}">
      <line class="parabola-axis" x1="12" y1="${visual.axis}" x2="148" y2="${visual.axis}"></line>
      <path class="parabola-curve" d="${visual.path}"></path>
      ${markers}
    </svg>
  `;
}

function renderParabolaCases(a, delta) {
  const board = document.getElementById('parabola-board');
  if (!board) return;
  const activeOpening = a > 0 ? 'up' : a < 0 ? 'down' : null;
  const activeRoots = delta > 0 ? 'two' : delta < 0 ? 'none' : 'one';
  const cases = [
    {
      opening: 'up',
      roots: 'two',
      title: 'a > 0 et Δ > 0',
      shape: 'Convexe',
      solutions: '2 solutions',
      description: 'La parabole coupe deux fois l’axe des x.',
    },
    {
      opening: 'up',
      roots: 'one',
      title: 'a > 0 et Δ = 0',
      shape: 'Convexe',
      solutions: '1 solution double',
      description: 'La parabole touche l’axe des x.',
    },
    {
      opening: 'up',
      roots: 'none',
      title: 'a > 0 et Δ < 0',
      shape: 'Convexe',
      solutions: '0 solution réelle',
      description: 'La parabole reste au-dessus de l’axe des x.',
    },
    {
      opening: 'down',
      roots: 'two',
      title: 'a < 0 et Δ > 0',
      shape: 'Concave',
      solutions: '2 solutions',
      description: 'La parabole coupe deux fois l’axe des x.',
    },
    {
      opening: 'down',
      roots: 'one',
      title: 'a < 0 et Δ = 0',
      shape: 'Concave',
      solutions: '1 solution double',
      description: 'La parabole touche l’axe des x.',
    },
    {
      opening: 'down',
      roots: 'none',
      title: 'a < 0 et Δ < 0',
      shape: 'Concave',
      solutions: '0 solution réelle',
      description: 'La parabole reste sous l’axe des x.',
    },
  ];

  if (!activeOpening) {
    board.innerHTML = `
      <article class="parabola-case parabola-current is-active is-linear">
        <svg class="parabola-mini" viewBox="0 0 160 112" role="img" aria-label="Fonction affine">
          <line class="parabola-axis" x1="12" y1="72" x2="148" y2="72"></line>
          <path class="parabola-curve" d="M18 92 L142 28"></path>
        </svg>
        <div class="parabola-copy">
          <strong>a = 0</strong>
          <span>Ce n’est pas une parabole</span>
          <p>Le coefficient de x² est nul : on n’est plus dans une équation du second degré.</p>
        </div>
      </article>
    `;
    return;
  }

  const activeCase = cases.find((item) => item.opening === activeOpening && item.roots === activeRoots);
  board.innerHTML = `
    <article class="parabola-case parabola-current is-active ${activeCase.opening === 'down' ? 'is-concave' : ''}">
      ${parabolaSvg(activeCase.opening, activeCase.roots)}
      <div class="parabola-copy">
        <strong>${activeCase.title}</strong>
        <span>${activeCase.shape} · ${activeCase.solutions}</span>
        <p>${activeCase.description}</p>
      </div>
    </article>
  `;
}

function renderQuadratic() {
  const a = Number(document.getElementById('quad-a')?.value || 0);
  const b = Number(document.getElementById('quad-b')?.value || 0);
  const c = Number(document.getElementById('quad-c')?.value || 0);
  const delta = b * b - 4 * a * c;
  const polynomial = document.getElementById('quad-polynomial');
  const result = document.getElementById('quad-result');
  const polynomialText = formatPolynomial(a, b, c);
  const deltaFormula = `Δ = b² - 4ac = ${formulaFactor(b)}² - 4 · ${formulaFactor(a)} · ${formulaFactor(c)} = ${formatNumber(delta)}`;

  if (polynomial) polynomial.textContent = `P(x) = ax² + bx + c = ${polynomialText}`;
  if (result) {
    result.className = `expression-display delta-${deltaKind(delta)}`;
    result.textContent = `${deltaFormula} ; ${deltaSolutionText(delta, a)}`;
  }
  renderParabolaCases(a, delta);
}

const linearSystemCases = {
  one: {
    equations: ['2x + y = 4', '3x + 2y = 7'],
    lines: [(x) => 4 - 2 * x, (x) => (7 - 3 * x) / 2],
    result: 'Les deux droites se coupent en un seul point : le système possède une solution unique S(1 ; 2).',
    point: { x: 1, y: 2, label: 'S(1 ; 2)' },
  },
  parallel: {
    equations: ['2x + y = 4', '2x + y = 1'],
    lines: [(x) => 4 - 2 * x, (x) => 1 - 2 * x],
    result: 'Les droites ont la même direction mais ne se rencontrent jamais : le système n’a aucune solution.',
  },
  coincident: {
    equations: ['2x + y = 4', '4x + 2y = 8'],
    lines: [(x) => 4 - 2 * x, (x) => 4 - 2 * x],
    result: 'Les deux équations décrivent la même droite : chaque point de la droite est solution, il y a une infinité de solutions.',
    coincident: true,
  },
};

function renderSystemDisplay(system) {
  const display = document.getElementById('system-display');
  const result = document.getElementById('system-result');
  if (display) {
    display.innerHTML = `
      <span class="system-brace">{</span>
      <span class="system-equations">
        <strong class="system-equation system-equation-blue">${escapeHtml(system.equations[0])}</strong>
        <strong class="system-equation system-equation-orange">${escapeHtml(system.equations[1])}</strong>
      </span>
    `;
  }
  if (result) result.textContent = system.result;
}

function drawSystem() {
  const canvas = document.getElementById('system-canvas');
  if (!canvas) return;
  const key = document.getElementById('system-case')?.value || 'one';
  const system = linearSystemCases[key] || linearSystemCases.one;
  renderSystemDisplay(system);

  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const toX = (x) => w / 2 + x * 45;
  const toY = (y) => h / 2 - y * 35;
  const axis = {
    xMin: -5,
    xMax: 5,
    yMin: -4,
    yMax: 4,
  };

  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = '#d9e0d4';
  ctx.lineWidth = 1;
  for (let x = axis.xMin; x <= axis.xMax; x += 1) {
    ctx.beginPath(); ctx.moveTo(toX(x), 0); ctx.lineTo(toX(x), h); ctx.stroke();
  }
  for (let y = axis.yMin; y <= axis.yMax; y += 1) {
    ctx.beginPath(); ctx.moveTo(0, toY(y)); ctx.lineTo(w, toY(y)); ctx.stroke();
  }
  drawSystemAxes(ctx, w, h, toX, toY, axis);

  if (system.coincident) {
    drawSystemLine(ctx, toX, toY, system.lines[1], '#d96c3f', { width: 8, alpha: 0.72 });
    drawSystemLine(ctx, toX, toY, system.lines[0], '#176b87', { width: 4, dash: [10, 7] });
  } else {
    drawSystemLine(ctx, toX, toY, system.lines[0], '#176b87');
    drawSystemLine(ctx, toX, toY, system.lines[1], '#d96c3f');
  }

  ctx.save();
  ctx.font = '800 15px Inter, system-ui, sans-serif';
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(255,255,255,0.88)';
  ctx.fillStyle = '#176b87';
  const firstLabelX = system.coincident ? 1.65 : 2.15;
  ctx.strokeText(system.equations[0], toX(firstLabelX), toY(system.lines[0](firstLabelX)) - 10);
  ctx.fillText(system.equations[0], toX(firstLabelX), toY(system.lines[0](firstLabelX)) - 10);
  ctx.fillStyle = '#d96c3f';
  const secondLabelX = system.coincident ? 0.15 : 0.2;
  ctx.strokeText(system.equations[1], toX(secondLabelX), toY(system.lines[1](secondLabelX)) + 22);
  ctx.fillText(system.equations[1], toX(secondLabelX), toY(system.lines[1](secondLabelX)) + 22);
  ctx.restore();

  if (system.point) {
    ctx.fillStyle = '#1d7b53';
    ctx.beginPath();
    ctx.arc(toX(system.point.x), toY(system.point.y), 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '800 15px Inter, system-ui, sans-serif';
    ctx.fillText(system.point.label, toX(system.point.x) + 10, toY(system.point.y) - 8);
  }
}

function drawSystemAxes(ctx, width, height, toX, toY, axis) {
  const xAxisY = toY(0);
  const yAxisX = toX(0);
  const axisColor = '#54606e';
  const tickSize = 5;
  const arrowSize = 10;

  ctx.save();
  ctx.strokeStyle = axisColor;
  ctx.fillStyle = axisColor;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  drawArrowedLine(ctx, 12, xAxisY, width - 16, xAxisY, arrowSize);
  drawArrowedLine(ctx, yAxisX, height - 12, yAxisX, 14, arrowSize);

  ctx.lineWidth = 2;
  ctx.font = '700 11px Inter, system-ui, sans-serif';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'center';
  for (let x = axis.xMin; x <= axis.xMax; x += 1) {
    const px = toX(x);
    ctx.beginPath();
    ctx.moveTo(px, xAxisY - tickSize);
    ctx.lineTo(px, xAxisY + tickSize);
    ctx.stroke();
    if (x !== 0) ctx.fillText(String(x), px, xAxisY + 8);
  }

  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let y = axis.yMin; y <= axis.yMax; y += 1) {
    const py = toY(y);
    ctx.beginPath();
    ctx.moveTo(yAxisX - tickSize, py);
    ctx.lineTo(yAxisX + tickSize, py);
    ctx.stroke();
    if (y !== 0) ctx.fillText(String(y), yAxisX - 9, py);
  }

  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.font = '900 14px Inter, system-ui, sans-serif';
  ctx.fillText('x', width - 18, xAxisY - 8);
  ctx.fillText('y', yAxisX + 8, 18);
  ctx.restore();
}

function drawArrowedLine(ctx, fromX, fromY, toX, toY, arrowSize) {
  const angle = Math.atan2(toY - fromY, toX - fromX);
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - arrowSize * Math.cos(angle - Math.PI / 6), toY - arrowSize * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(toX - arrowSize * Math.cos(angle + Math.PI / 6), toY - arrowSize * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
}

function drawSystemLine(ctx, toX, toY, fn, color, options = {}) {
  ctx.save();
  ctx.globalAlpha = options.alpha ?? 1;
  ctx.strokeStyle = color;
  ctx.lineWidth = options.width || 4;
  ctx.setLineDash(options.dash || []);
  ctx.beginPath();
  for (let i = -6; i <= 6; i += 0.25) {
    const px = toX(i);
    const py = toY(fn(i));
    if (i === -6) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.restore();
}

const intervalPresets = [
  { id: 'closed-1-5', label: '[1 ; 5]', start: 1, end: 5, includeStart: true, includeEnd: true },
  { id: 'closed-2-6', label: '[2 ; 6]', start: 2, end: 6, includeStart: true, includeEnd: true },
  { id: 'openleft-1-6', label: ']1 ; 6]', start: 1, end: 6, includeStart: false, includeEnd: true },
  { id: 'openright-0-4', label: '[0 ; 4[', start: 0, end: 4, includeStart: true, includeEnd: false },
  { id: 'openleft-3-8', label: ']3 ; 8]', start: 3, end: 8, includeStart: false, includeEnd: true },
  { id: 'openright-4-7', label: '[4 ; 7[', start: 4, end: 7, includeStart: true, includeEnd: false },
];

let activeIntervalMode = 'intersection';

function intervalById(id) {
  const interval = intervalPresets.find((item) => item.id === id) || intervalPresets[0];
  return { ...interval };
}

function hasIntervalPoints(interval) {
  if (!interval || interval.empty) return false;
  if (interval.start < interval.end) return true;
  return interval.start === interval.end && interval.includeStart && interval.includeEnd;
}

function containsIntervalPoint(interval, point) {
  if (!hasIntervalPoints(interval)) return false;
  const afterStart = point > interval.start || (point === interval.start && interval.includeStart);
  const beforeEnd = point < interval.end || (point === interval.end && interval.includeEnd);
  return afterStart && beforeEnd;
}

function cleanInterval(interval) {
  return hasIntervalPoints(interval) ? interval : { empty: true };
}

function intervalIntersection(first, second) {
  const start = Math.max(first.start, second.start);
  const end = Math.min(first.end, second.end);

  return cleanInterval({
    start,
    end,
    includeStart: (start !== first.start || first.includeStart) && (start !== second.start || second.includeStart),
    includeEnd: (end !== first.end || first.includeEnd) && (end !== second.end || second.includeEnd),
  });
}

function sortedIntervals(first, second) {
  if (first.start !== second.start) return first.start < second.start ? [first, second] : [second, first];
  if (first.includeStart !== second.includeStart) return first.includeStart ? [first, second] : [second, first];
  return first.end <= second.end ? [first, second] : [second, first];
}

function intervalUnion(first, second) {
  const [left, right] = sortedIntervals(first, second);
  const separated = left.end < right.start || (left.end === right.start && !left.includeEnd && !right.includeStart);
  if (separated) return [left, right];

  const endFromLeft = left.end > right.end || (left.end === right.end && left.includeEnd);
  return [
    {
      start: left.start,
      end: endFromLeft ? left.end : right.end,
      includeStart: left.includeStart,
      includeEnd: endFromLeft ? left.includeEnd : right.includeEnd,
    },
  ];
}

function intervalDifference(first, second) {
  const intersection = intervalIntersection(first, second);
  if (!hasIntervalPoints(intersection)) return [first];

  const pieces = [
    cleanInterval({
      start: first.start,
      end: intersection.start,
      includeStart: first.includeStart,
      includeEnd: containsIntervalPoint(first, intersection.start) && !intersection.includeStart,
    }),
    cleanInterval({
      start: intersection.end,
      end: first.end,
      includeStart: containsIntervalPoint(first, intersection.end) && !intersection.includeEnd,
      includeEnd: first.includeEnd,
    }),
  ];

  return pieces.filter(hasIntervalPoints);
}

function formatInterval(interval) {
  if (!hasIntervalPoints(interval)) return '∅';
  if (interval.start === interval.end) return `{${formatNumber(interval.start)}}`;
  return `${interval.includeStart ? '[' : ']'}${formatNumber(interval.start)} ; ${formatNumber(interval.end)}${interval.includeEnd ? ']' : '['}`;
}

function formatIntervalCollection(intervals) {
  const visibleIntervals = intervals.filter(hasIntervalPoints);
  return visibleIntervals.length ? visibleIntervals.map(formatInterval).join(' ∪ ') : '∅';
}

function intervalModeLabel(mode) {
  const labels = {
    intersection: 'I ∩ J',
    union: 'I ∪ J',
    difference: 'I \\ J',
  };
  return labels[mode] || labels.intersection;
}

function intervalModeHint(mode) {
  const hints = {
    intersection: 'On garde uniquement ce qui appartient aux deux intervalles.',
    union: 'On garde tout ce qui appartient à au moins un des deux intervalles.',
    difference: 'On garde ce qui appartient à I mais pas à J.',
  };
  return hints[mode] || hints.intersection;
}

function intervalResultForMode(mode, intervalI, intervalJ) {
  if (mode === 'union') return intervalUnion(intervalI, intervalJ);
  if (mode === 'difference') return intervalDifference(intervalI, intervalJ);
  return [intervalIntersection(intervalI, intervalJ)];
}

function intervalSegmentSvg(interval, y, color) {
  if (!hasIntervalPoints(interval)) return '';
  const min = 0;
  const max = 8;
  const left = 64;
  const right = 510;
  const toX = (value) => left + ((value - min) / (max - min)) * (right - left);
  const startX = toX(interval.start);
  const endX = toX(interval.end);
  const startFill = interval.includeStart ? color : '#fff';
  const endFill = interval.includeEnd ? color : '#fff';

  if (interval.start === interval.end) {
    return `<circle class="interval-endpoint" cx="${startX}" cy="${y}" r="6" fill="${color}" stroke="${color}"></circle>`;
  }

  return `
    <line class="interval-segment" x1="${startX}" y1="${y}" x2="${endX}" y2="${y}" stroke="${color}"></line>
    <circle class="interval-endpoint" cx="${startX}" cy="${y}" r="5.5" fill="${startFill}" stroke="${color}"></circle>
    <circle class="interval-endpoint" cx="${endX}" cy="${y}" r="5.5" fill="${endFill}" stroke="${color}"></circle>
  `;
}

function renderIntervalSvg(intervalI, intervalJ, resultIntervals, mode) {
  const ticks = Array.from({ length: 9 }, (_, index) => index);
  const left = 64;
  const right = 510;
  const toX = (value) => left + (value / 8) * (right - left);
  const rows = [
    { label: 'I', y: 84, color: '#176b87', intervals: [intervalI] },
    { label: 'J', y: 124, color: '#d96c3f', intervals: [intervalJ] },
    { label: intervalModeLabel(mode), y: 164, color: '#1d7b53', intervals: resultIntervals },
  ];

  const rowSvg = rows
    .map((row) => {
      const segments = row.intervals.map((interval) => intervalSegmentSvg(interval, row.y, row.color)).join('');
      const empty = segments ? '' : `<text class="interval-empty" x="${(left + right) / 2}" y="${row.y + 5}">∅</text>`;
      return `
        <text class="interval-row-label" x="18" y="${row.y + 5}" fill="${row.color}">${escapeHtml(row.label)}</text>
        <line class="interval-row-axis" x1="${left}" y1="${row.y}" x2="${right}" y2="${row.y}"></line>
        ${segments}
        ${empty}
      `;
    })
    .join('');

  return `
    <svg class="interval-svg" viewBox="0 0 540 198" role="img" aria-label="Opérations sur deux intervalles">
      <line class="interval-main-axis" x1="${left}" y1="36" x2="${right}" y2="36"></line>
      <path class="interval-axis-arrow" d="M${right} 36 l-9 -6 v12 z"></path>
      ${ticks.map((tick) => `
        <line class="interval-tick" x1="${toX(tick)}" y1="30" x2="${toX(tick)}" y2="42"></line>
        <text class="interval-number" x="${toX(tick)}" y="60">${tick}</text>
      `).join('')}
      ${rowSvg}
    </svg>
  `;
}

function renderInterval() {
  const line = document.getElementById('interval-line');
  const result = document.getElementById('interval-result');
  const intervalI = intervalById(document.getElementById('interval-i-select')?.value);
  const intervalJ = intervalById(document.getElementById('interval-j-select')?.value);
  const resultIntervals = intervalResultForMode(activeIntervalMode, intervalI, intervalJ);
  const resultText = `${intervalModeLabel(activeIntervalMode)} = ${formatIntervalCollection(resultIntervals)}`;

  document.querySelectorAll('[data-interval]').forEach((button) => {
    const active = button.dataset.interval === activeIntervalMode;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  if (line) line.innerHTML = renderIntervalSvg(intervalI, intervalJ, resultIntervals, activeIntervalMode);
  if (result) result.innerHTML = `
    <strong>${escapeHtml(resultText)}</strong>
    <span>${escapeHtml(intervalModeHint(activeIntervalMode))}</span>
  `;
}

function setupIntervalControls() {
  const selectI = document.getElementById('interval-i-select');
  const selectJ = document.getElementById('interval-j-select');
  const options = intervalPresets
    .map((interval) => `<option value="${interval.id}">${escapeHtml(interval.label)}</option>`)
    .join('');
  if (selectI) {
    selectI.innerHTML = options;
    selectI.value = 'closed-1-5';
    selectI.addEventListener('change', renderInterval);
  }
  if (selectJ) {
    selectJ.innerHTML = options;
    selectJ.value = 'openleft-3-8';
    selectJ.addEventListener('change', renderInterval);
  }
  document.querySelectorAll('[data-interval]').forEach((button) => {
    button.addEventListener('click', () => {
      activeIntervalMode = button.dataset.interval;
      renderInterval();
    });
  });
}

['quad-a', 'quad-b', 'quad-c'].forEach((id) => document.getElementById(id)?.addEventListener('input', renderQuadratic));
document.getElementById('system-case')?.addEventListener('change', drawSystem);

setupEquationSolver();
renderQuadratic();
drawSystem();
setupIntervalControls();
renderInterval();

if (manimListNode) {
  equationsInequationsVideos.slice().sort((a, b) => a.order - b.order).forEach((video) => {
    const card = document.createElement('article');
    card.className = 'manim-card';
    const preview = document.createElement('div');
    preview.className = 'manim-preview';
    const player = document.createElement('video');
    player.src = video.videoPath;
    player.className = 'manim-player';
    player.controls = true;
    player.preload = 'metadata';
    preview.append(player);

    const content = document.createElement('div');
    content.className = 'manim-card-content';
    const chapter = document.createElement('p');
    chapter.className = 'section-kicker';
    chapter.textContent = 'Équations / Inéquations';
    const title = document.createElement('h3');
    title.textContent = video.title;
    const description = document.createElement('p');
    description.textContent = video.description;
    const links = document.createElement('div');
    links.className = 'card-links';
    links.innerHTML = `<a class="btn btn-primary" href="${video.videoPath}">Voir la vidéo</a><a class="btn btn-secondary" href="${video.sourcePath}">Code source</a>`;
    content.append(chapter, title, description, links);
    card.append(preview, content);
    manimListNode.append(card);
  });
}
