import { limitesContinuiteVideos } from './content/limites-continuite-videos.js';
import { VERSION_LABEL, RELEASE_DATE } from './core/version.js';

const versionNode = document.getElementById('site-version');
const releaseNode = document.getElementById('release-date');
const manimListNode = document.getElementById('manim-list');

if (versionNode) versionNode.textContent = VERSION_LABEL;
if (releaseNode) releaseNode.textContent = RELEASE_DATE;

function inputValue(id) {
  return Number(document.getElementById(id)?.value || 0);
}

function setupCanvas(canvas, rangeX = 6, rangeY = 5) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const sx = w / (2 * rangeX);
  const sy = h / (2 * rangeY);
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = '#d9e0d4';
  ctx.lineWidth = 1;
  for (let x = -rangeX; x <= rangeX; x += 1) {
    const px = w / 2 + x * sx;
    ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, h); ctx.stroke();
  }
  for (let y = -rangeY; y <= rangeY; y += 1) {
    const py = h / 2 - y * sy;
    ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(w, py); ctx.stroke();
  }
  ctx.strokeStyle = '#54606e';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke();
  return {
    ctx, w, h, sx, sy,
    xToPx: (x) => w / 2 + x * sx,
    yToPx: (y) => h / 2 - y * sy,
  };
}

function drawCurve(canvas, fn, options = {}) {
  const rangeX = options.rangeX || 6;
  const rangeY = options.rangeY || 5;
  const env = setupCanvas(canvas, rangeX, rangeY);
  const { ctx, w, xToPx, yToPx } = env;
  ctx.strokeStyle = options.color || '#176b87';
  ctx.lineWidth = 4;
  ctx.beginPath();
  let started = false;
  for (let px = 0; px <= w; px++) {
    const x = (px - w / 2) / env.sx;
    const y = fn(x);
    if (!Number.isFinite(y) || Math.abs(y) > rangeY * 3) {
      started = false;
      continue;
    }
    const py = yToPx(y);
    if (!started) {
      ctx.moveTo(px, py);
      started = true;
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();
  return env;
}

function markPoint(env, x, y, color = '#d96c3f', radius = 7) {
  const { ctx, xToPx, yToPx } = env;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(xToPx(x), yToPx(y), radius, 0, Math.PI * 2);
  ctx.fill();
}

function markOpenPoint(env, x, y, color = '#d96c3f') {
  const { ctx, xToPx, yToPx } = env;
  ctx.fillStyle = '#f7faf5';
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(xToPx(x), yToPx(y), 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawDashedLine(env, fromX, fromY, toX, toY, color = '#1d7b53') {
  const { ctx, xToPx, yToPx } = env;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(xToPx(fromX), yToPx(fromY));
  ctx.lineTo(xToPx(toX), yToPx(toY));
  ctx.stroke();
  ctx.restore();
}

function renderHole() {
  const offset = inputValue('hole-x');
  const x = 2 + offset;
  const fn = (t) => t + 3;
  const env = drawCurve(document.getElementById('hole-canvas'), fn, { rangeX: 5, rangeY: 6, color: '#176b87' });
  markOpenPoint(env, 2, 5);
  markPoint(env, x, fn(x), '#1d7b53');
  drawDashedLine(env, x, 0, x, fn(x));
  document.getElementById('hole-result').textContent = `x = ${x.toFixed(2)} ; f(x) se rapproche de 5 quand x tend vers 2.`;
}

function renderSides() {
  const x = inputValue('side-x');
  const fn = (t) => (t < 0 ? -1 : 1);
  const env = drawCurve(document.getElementById('side-canvas'), fn, { rangeX: 4, rangeY: 3, color: '#d96c3f' });
  markOpenPoint(env, 0, -1);
  markOpenPoint(env, 0, 1);
  markPoint(env, x, fn(x), '#176b87');
  document.getElementById('side-result').textContent = x < 0
    ? `Par la gauche, f(x) se rapproche de -1.`
    : `Par la droite, f(x) se rapproche de 1. La limite en 0 n’existe pas.`;
}

function renderVerticalAsymptote() {
  const offset = inputValue('vertical-x');
  const x = 1 + offset;
  const fn = (t) => 1 / (t - 1);
  const env = drawCurve(document.getElementById('vertical-canvas'), fn, { rangeX: 5, rangeY: 5, color: '#176b87' });
  drawDashedLine(env, 1, -5, 1, 5, '#d96c3f');
  if (Math.abs(x - 1) > 0.04) markPoint(env, x, Math.max(-5, Math.min(5, fn(x))), '#1d7b53');
  document.getElementById('vertical-result').textContent = x < 1
    ? `x approche 1 par la gauche : f(x) descend vers -∞.`
    : `x approche 1 par la droite : f(x) monte vers +∞.`;
}

function renderInfinity() {
  const range = inputValue('infinity-zoom');
  const fn = (x) => (2 * x - 5) / (x - 1);
  const env = drawCurve(document.getElementById('infinity-canvas'), fn, { rangeX: range, rangeY: 6, color: '#176b87' });
  drawDashedLine(env, -range, 2, range, 2, '#d96c3f');
  drawDashedLine(env, 1, -6, 1, 6, '#54606e');
}

function renderFactorisation() {
  const fn = (x) => x + 7;
  const env = drawCurve(document.getElementById('factor-canvas'), fn, { rangeX: 8, rangeY: 12, color: '#3f7d58' });
  markOpenPoint(env, 3, 10);
  document.getElementById('factor-result').textContent = '(x² + 4x - 21) / (x - 3) = x + 7 pour x ≠ 3 ; la limite vaut 10.';
}

function renderContinuity() {
  const chosen = inputValue('continuity-value');
  const fn = (x) => x + 1;
  const env = drawCurve(document.getElementById('continuity-canvas'), fn, { rangeX: 5, rangeY: 5, color: '#176b87' });
  markOpenPoint(env, 1, 2);
  markPoint(env, 1, chosen, chosen === 2 ? '#1d7b53' : '#d96c3f');
  document.getElementById('continuity-result').textContent = chosen === 2
    ? 'lim f(x) = f(1) = 2 : la fonction est continue en 1.'
    : `lim f(x) = 2 mais f(1) = ${chosen} : la fonction est discontinue en 1.`;
}

['hole-x'].forEach((id) => document.getElementById(id)?.addEventListener('input', renderHole));
['side-x'].forEach((id) => document.getElementById(id)?.addEventListener('input', renderSides));
['vertical-x'].forEach((id) => document.getElementById(id)?.addEventListener('input', renderVerticalAsymptote));
['infinity-zoom'].forEach((id) => document.getElementById(id)?.addEventListener('input', renderInfinity));
['continuity-value'].forEach((id) => document.getElementById(id)?.addEventListener('input', renderContinuity));

renderHole();
renderSides();
renderVerticalAsymptote();
renderInfinity();
renderFactorisation();
renderContinuity();

if (manimListNode) {
  limitesContinuiteVideos.slice().sort((a, b) => a.order - b.order).forEach((video) => {
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
    chapter.textContent = 'Limites et continuité';
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
