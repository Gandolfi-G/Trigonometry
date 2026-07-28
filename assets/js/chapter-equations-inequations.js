import { equationsInequationsVideos } from './content/equations-inequations-videos.js';
import { VERSION_LABEL, RELEASE_DATE } from './core/version.js';

const versionNode = document.getElementById('site-version');
const releaseNode = document.getElementById('release-date');
const manimListNode = document.getElementById('manim-list');

if (versionNode) versionNode.textContent = VERSION_LABEL;
if (releaseNode) releaseNode.textContent = RELEASE_DATE;

const balanceStates = {
  add: ['6x - 7 + 7', '2x + 5 + 7', '6x = 2x + 12'],
  subtract: ['6x - 2x', '2x + 12 - 2x', '4x = 12'],
  divide: ['4x ÷ 4', '12 ÷ 4', 'x = 3'],
};

function renderBalance() {
  const op = document.getElementById('balance-op')?.value || 'add';
  const [left, right, result] = balanceStates[op];
  document.getElementById('balance-left').textContent = left;
  document.getElementById('balance-right').textContent = right;
  document.getElementById('balance-result').textContent = result;
}

function renderQuadratic() {
  const a = Number(document.getElementById('quad-a')?.value || 1);
  const b = Number(document.getElementById('quad-b')?.value || 0);
  const c = Number(document.getElementById('quad-c')?.value || 0);
  const delta = b * b - 4 * a * c;
  const result = document.getElementById('quad-result');
  const board = document.getElementById('parabola-board');
  let message = `Δ = ${delta}`;

  if (delta > 0) message += ' : deux solutions réelles';
  if (delta === 0) message += ' : une solution réelle double';
  if (delta < 0) message += ' : aucune solution réelle';
  result.textContent = message;

  board.innerHTML = '';
  const badge = document.createElement('div');
  badge.className = `delta-badge ${delta > 0 ? 'delta-positive' : delta === 0 ? 'delta-zero' : 'delta-negative'}`;
  badge.textContent = delta > 0 ? '2 intersections' : delta === 0 ? 'tangence' : 'pas d’intersection';
  board.append(badge);
}

function drawSystem() {
  const canvas = document.getElementById('system-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const toX = (x) => w / 2 + x * 45;
  const toY = (y) => h / 2 - y * 35;

  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = '#d9e0d4';
  ctx.lineWidth = 1;
  for (let x = -5; x <= 5; x += 1) {
    ctx.beginPath(); ctx.moveTo(toX(x), 0); ctx.lineTo(toX(x), h); ctx.stroke();
  }
  for (let y = -4; y <= 4; y += 1) {
    ctx.beginPath(); ctx.moveTo(0, toY(y)); ctx.lineTo(w, toY(y)); ctx.stroke();
  }
  ctx.strokeStyle = '#54606e';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, toY(0)); ctx.lineTo(w, toY(0)); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(toX(0), 0); ctx.lineTo(toX(0), h); ctx.stroke();

  drawLine(ctx, toX, toY, (x) => 4 - 2 * x, '#176b87');
  drawLine(ctx, toX, toY, (x) => (7 - 3 * x) / 2, '#d96c3f');
  ctx.fillStyle = '#1d7b53';
  ctx.beginPath(); ctx.arc(toX(1), toY(2), 7, 0, Math.PI * 2); ctx.fill();
  ctx.fillText('S(1;2)', toX(1) + 10, toY(2) - 8);
}

function drawLine(ctx, toX, toY, fn, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  for (let i = -6; i <= 6; i += 0.25) {
    const px = toX(i);
    const py = toY(fn(i));
    if (i === -6) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
}

function renderInterval(mode = 'intersection') {
  const line = document.getElementById('interval-line');
  const result = document.getElementById('interval-result');
  const labels = {
    intersection: 'I ∩ J = ]5;6]',
    union: 'I ∪ J = [4;8[',
    difference: 'I \\ J = [4;5]',
  };
  line.dataset.mode = mode;
  line.innerHTML = '<span>4</span><span>5</span><span>6</span><span>8</span><div class="interval interval-i"></div><div class="interval interval-j"></div><div class="interval interval-result"></div>';
  result.textContent = labels[mode];
}

document.getElementById('balance-op')?.addEventListener('change', renderBalance);
['quad-a', 'quad-b', 'quad-c'].forEach((id) => document.getElementById(id)?.addEventListener('input', renderQuadratic));
document.querySelectorAll('[data-interval]').forEach((button) => {
  button.addEventListener('click', () => renderInterval(button.dataset.interval));
});

renderBalance();
renderQuadratic();
drawSystem();
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
