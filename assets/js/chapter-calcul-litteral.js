import { calculLitteralVideos } from './content/calcul-litteral-videos.js';
import { VERSION_LABEL, RELEASE_DATE } from './core/version.js';

const versionNode = document.getElementById('site-version');
const releaseNode = document.getElementById('release-date');
const manimListNode = document.getElementById('manim-list');

if (versionNode) versionNode.textContent = VERSION_LABEL;
if (releaseNode) releaseNode.textContent = RELEASE_DATE;

function rangeValue(id) {
  return Number(document.getElementById(id)?.value || 0);
}

function setText(id, text) {
  const node = document.getElementById(id);
  if (node) node.textContent = text;
}

function renderDistribution() {
  const a = rangeValue('dist-a');
  const b = rangeValue('dist-b');
  const k = rangeValue('dist-k');
  const board = document.getElementById('dist-board');

  setText('dist-a-value', `${a}x`);
  setText('dist-b-value', `${b}`);
  setText('dist-k-value', `${k}`);
  setText('dist-formula', 'k(ax + b) = k · ax + k · b');
  setText('dist-expression', `${k}(${a}x + ${b}) = ${k} · ${a}x + ${k} · ${b} = ${k * a}x + ${k * b}`);

  board.innerHTML = '';
  board.className = 'distribution-board';
  board.style.setProperty('--left-width', `${a}fr`);
  board.style.setProperty('--right-width', `${b}fr`);
  board.append(
    dimensionLabel('', 'corner-label'),
    dimensionLabel(`a·x = ${a}x`, 'top-label param-blue'),
    dimensionLabel(`b = ${b}`, 'top-label top-label-right param-red'),
    dimensionLabel(`k = ${k}`, 'side-label param-green'),
    block(`${k} · ${a}x`, 'term-blue', `${k * a}x`),
    block(`${k} · ${b}`, 'term-red', `${k * b}`),
  );
}

function renderSquareIdentity() {
  const a = rangeValue('square-a');
  const b = rangeValue('square-b');
  const board = document.getElementById('square-board');

  setText('square-a-value', `${a}`);
  setText('square-b-value', `${b}`);
  setText('square-formula', '(a + b)² = a² + ab + ba + b² = a² + 2ab + b²');
  setText('square-expression', `(${a} + ${b})² = ${a ** 2} + ${a} · ${b} + ${b} · ${a} + ${b ** 2} = ${(a + b) ** 2}`);

  board.innerHTML = '';
  board.className = 'square-board dimensioned-square-board';
  board.style.setProperty('--a-size', `${a}fr`);
  board.style.setProperty('--b-size', `${b}fr`);
  board.append(
    dimensionLabel('', 'corner-label'),
    dimensionLabel(`a = ${a}`, 'top-label param-blue'),
    dimensionLabel(`b = ${b}`, 'top-label top-label-right param-orange'),
    dimensionLabel(`a = ${a}`, 'side-label param-blue'),
    dimensionLabel(`b = ${b}`, 'side-label side-label-bottom param-orange'),
    block('a²', 'term-blue square-piece-a2'),
    block('ab', 'term-mixed square-piece-ab-top'),
    block('ba', 'term-mixed square-piece-ab-bottom'),
    block('b²', 'term-orange square-piece-b2'),
  );
}

function renderFactorisation() {
  const board = document.querySelector('.factor-flow');
  if (!board) return;
  board.className = 'factor-flow factor-color-flow';
  board.innerHTML = `
    <div class="factor-row">
      <span class="term-source term-source-blue">6x</span>
      <span>+</span>
      <span class="term-source term-source-orange">9</span>
    </div>
    <span class="flow-arrow">→</span>
    <div class="factor-row">
      <span class="factor-token">3</span>
      <span>·</span>
      <span class="inside-token term-source-blue">2x</span>
      <span>+</span>
      <span class="factor-token">3</span>
      <span>·</span>
      <span class="inside-token term-source-orange">3</span>
    </div>
    <span class="flow-arrow">→</span>
    <div class="factor-result">
      <span class="factor-token">3</span><strong>(<span class="inside-token term-source-blue">2x</span> + <span class="inside-token term-source-orange">3</span>)</strong>
    </div>
    <div class="factor-legend">
      <span><i class="legend-dot factor-dot"></i>facteur commun</span>
      <span><i class="legend-dot blue-dot"></i>reste de 6x</span>
      <span><i class="legend-dot orange-dot"></i>reste de 9</span>
    </div>
  `;
}

const divisionSteps = [
  {
    active: 'start',
    quotient: '',
    rows: [],
    caption: 'On pose la division euclidienne : x² + 5x + 6 est divisé par x + 2.',
  },
  {
    active: 'xterm',
    quotient: 'x',
    rows: [],
    caption: 'On regarde le premier terme : pour obtenir x² avec x, il faut multiplier par x.',
  },
  {
    active: 'first-product',
    quotient: 'x',
    rows: [{ type: 'subtract', text: '- (x² + 2x)' }],
    caption: 'On calcule x · (x + 2) = x² + 2x, puis on va le soustraire.',
  },
  {
    active: 'first-remainder',
    quotient: 'x',
    rows: [
      { type: 'subtract', text: '- (x² + 2x)' },
      { type: 'result', text: '3x + 6' },
    ],
    caption: 'La soustraction donne : x² + 5x + 6 - (x² + 2x) = 3x + 6.',
  },
  {
    active: 'constant',
    quotient: 'x + 3',
    rows: [
      { type: 'subtract', text: '- (x² + 2x)' },
      { type: 'result', text: '3x + 6' },
    ],
    caption: 'On recommence avec 3x : pour obtenir 3x avec x, il faut multiplier par 3.',
  },
  {
    active: 'second-product',
    quotient: 'x + 3',
    rows: [
      { type: 'subtract', text: '- (x² + 2x)' },
      { type: 'result', text: '3x + 6' },
      { type: 'subtract', text: '- (3x + 6)' },
    ],
    caption: 'On calcule 3 · (x + 2) = 3x + 6, puis on soustrait une deuxième fois.',
  },
  {
    active: 'done',
    quotient: 'x + 3',
    rows: [
      { type: 'subtract', text: '- (x² + 2x)' },
      { type: 'result', text: '3x + 6' },
      { type: 'subtract', text: '- (3x + 6)' },
      { type: 'remainder', text: '0' },
    ],
    caption: 'Le reste vaut 0, donc x² + 5x + 6 = (x + 2) · (x + 3).',
  },
];

let divisionStepIndex = 0;

function renderPolynomialDivision() {
  const board = document.querySelector('.division-board');
  if (!board) return;

  const legacyCaption = board.nextElementSibling;
  if (legacyCaption?.classList.contains('chapter-meta')) {
    legacyCaption.hidden = true;
  }

  const step = divisionSteps[divisionStepIndex];
  board.className = 'division-board polynomial-division';
  board.innerHTML = `
    <div class="division-stage">
      <div class="division-left">
        <div class="division-dividend ${step.active === 'start' ? 'is-active' : ''}">x² + 5x + 6</div>
        <div class="division-work">
          ${step.rows.map((row) => `<div class="division-row ${row.type}">${row.text}</div>`).join('')}
        </div>
      </div>
      <div class="division-right">
        <div class="division-divisor">x + 2</div>
        <div class="division-quotient ${step.quotient ? 'is-filled' : ''}">${step.quotient || '?'}</div>
      </div>
    </div>
    <div class="division-focus ${step.active}">
      <span class="focus-pill focus-blue">x² ÷ x = x</span>
      <span class="focus-pill focus-purple">x · (x + 2)</span>
      <span class="focus-pill focus-orange">3x ÷ x = 3</span>
    </div>
    <p class="division-caption">${step.caption}</p>
    <div class="division-controls">
      <button class="btn btn-secondary" type="button" data-division-action="prev">Précédent</button>
      <button class="btn btn-primary" type="button" data-division-action="next">${divisionStepIndex === divisionSteps.length - 1 ? 'Rejouer' : 'Étape suivante'}</button>
    </div>
  `;

  board.querySelector('[data-division-action="prev"]')?.toggleAttribute('disabled', divisionStepIndex === 0);
  board.querySelector('[data-division-action="prev"]')?.addEventListener('click', () => {
    divisionStepIndex = Math.max(0, divisionStepIndex - 1);
    renderPolynomialDivision();
  });
  board.querySelector('[data-division-action="next"]')?.addEventListener('click', () => {
    divisionStepIndex = divisionStepIndex === divisionSteps.length - 1 ? 0 : divisionStepIndex + 1;
    renderPolynomialDivision();
  });
}

function block(text, className, result = '') {
  const node = document.createElement('div');
  node.className = `area-piece ${className}`;
  if (result) {
    const product = document.createElement('span');
    product.className = 'area-product';
    product.textContent = text;
    const value = document.createElement('strong');
    value.textContent = result;
    node.append(product, value);
  } else {
    node.textContent = text;
  }
  return node;
}

function dimensionLabel(text, className) {
  const node = document.createElement('div');
  node.className = `area-dimension ${className}`;
  node.textContent = text;
  return node;
}

['dist-a', 'dist-b', 'dist-k'].forEach((id) => {
  document.getElementById(id)?.addEventListener('input', renderDistribution);
});

['square-a', 'square-b'].forEach((id) => {
  document.getElementById(id)?.addEventListener('input', renderSquareIdentity);
});

renderDistribution();
renderSquareIdentity();
renderFactorisation();
renderPolynomialDivision();

if (manimListNode) {
  calculLitteralVideos
    .slice()
    .sort((a, b) => a.order - b.order)
    .forEach((video) => {
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
      chapter.textContent = 'Calcul littéral';

      const title = document.createElement('h3');
      title.textContent = video.title;

      const description = document.createElement('p');
      description.textContent = video.description;

      const links = document.createElement('div');
      links.className = 'card-links';

      const videoLink = document.createElement('a');
      videoLink.href = video.videoPath;
      videoLink.className = 'btn btn-primary';
      videoLink.textContent = 'Voir la vidéo';

      const sourceLink = document.createElement('a');
      sourceLink.href = video.sourcePath;
      sourceLink.className = 'btn btn-secondary';
      sourceLink.textContent = 'Code source';

      links.append(videoLink, sourceLink);
      content.append(chapter, title, description, links);
      card.append(preview, content);
      manimListNode.append(card);
    });
}
