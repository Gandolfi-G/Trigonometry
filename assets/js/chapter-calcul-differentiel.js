import { calculDifferentielVideos } from './content/calcul-differentiel-videos.js';
import { VERSION_LABEL, RELEASE_DATE } from './core/version.js';

const versionNode = document.getElementById('site-version');
const releaseNode = document.getElementById('release-date');
const manimListNode = document.getElementById('manim-list');

if (versionNode) versionNode.textContent = VERSION_LABEL;
if (releaseNode) releaseNode.textContent = RELEASE_DATE;

function inputValue(id) {
  return Number(document.getElementById(id)?.value || 0);
}

function setupCanvas(canvas, rangeX = 5, rangeY = 6) {
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
  const env = setupCanvas(canvas, options.rangeX || 5, options.rangeY || 6);
  const { ctx, w, xToPx, yToPx } = env;
  const rangeX = options.rangeX || 5;
  const rangeY = options.rangeY || 6;
  ctx.strokeStyle = options.color || '#176b87';
  ctx.lineWidth = 4;
  ctx.beginPath();
  let started = false;
  for (let px = 0; px <= w; px++) {
    const x = (px - w / 2) / env.sx;
    if (x < -rangeX || x > rangeX) continue;
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
  return { ...env, xToPx, yToPx };
}

function drawLine(env, m, p, color = '#d96c3f') {
  const x1 = -20;
  const x2 = 20;
  env.ctx.strokeStyle = color;
  env.ctx.lineWidth = 3;
  env.ctx.beginPath();
  env.ctx.moveTo(env.xToPx(x1), env.yToPx(m * x1 + p));
  env.ctx.lineTo(env.xToPx(x2), env.yToPx(m * x2 + p));
  env.ctx.stroke();
}

function point(env, x, y, color = '#1d7b53') {
  env.ctx.fillStyle = color;
  env.ctx.beginPath();
  env.ctx.arc(env.xToPx(x), env.yToPx(y), 7, 0, Math.PI * 2);
  env.ctx.fill();
}

function renderSecant() {
  let a = inputValue('secant-a');
  let b = inputValue('secant-b');
  if (Math.abs(a - b) < 0.2) b = a + 0.2;
  const fn = (x) => 0.5 * x * x + 1;
  const fa = fn(a);
  const fb = fn(b);
  const slope = (fb - fa) / (b - a);
  const intercept = fa - slope * a;
  const env = drawCurve(document.getElementById('secant-canvas'), fn, { rangeX: 5, rangeY: 7 });
  drawLine(env, slope, intercept);
  point(env, a, fa);
  point(env, b, fb);
  document.getElementById('secant-result').textContent = `pente moyenne = Δy / Δx = ${slope.toFixed(2)}`;
}

function renderTangentLimit() {
  const h = inputValue('tangent-h');
  const x0 = 1;
  const fn = (x) => x * x;
  const x = x0 + h;
  const slope = (fn(x) - fn(x0)) / h;
  const env = drawCurve(document.getElementById('tangent-canvas'), fn, { rangeX: 5, rangeY: 7 });
  drawLine(env, slope, fn(x0) - slope * x0, '#d96c3f');
  drawLine(env, 2 * x0, fn(x0) - 2 * x0 * x0, '#1d7b53');
  point(env, x0, fn(x0), '#176b87');
  point(env, x, fn(x), '#d96c3f');
  document.getElementById('tangent-result').textContent = `h = ${h.toFixed(2)} ; pente de la sécante = ${slope.toFixed(2)} ; pente tangentielle = 2`;
}

function renderDerivativeAtPoint() {
  const x0 = inputValue('derivative-x0');
  const fn = (x) => x * x;
  const slope = 2 * x0;
  const env = drawCurve(document.getElementById('derivative-canvas'), fn, { rangeX: 5, rangeY: 8 });
  drawLine(env, slope, fn(x0) - slope * x0, '#1d7b53');
  point(env, x0, fn(x0));
  document.getElementById('derivative-result').textContent = `Pour f(x)=x² : f’(${x0.toFixed(1)}) = 2x0 = ${slope.toFixed(1)}`;
}

function renderDerivedFunction() {
  const canvas = document.getElementById('derived-function-canvas');
  const env = drawCurve(canvas, (x) => x * x, { rangeX: 5, rangeY: 8, color: '#176b87' });
  env.ctx.strokeStyle = '#d96c3f';
  env.ctx.lineWidth = 4;
  env.ctx.beginPath();
  let started = false;
  for (let px = 0; px <= env.w; px++) {
    const x = (px - env.w / 2) / env.sx;
    const y = 2 * x;
    const py = env.yToPx(y);
    if (!started) {
      env.ctx.moveTo(px, py);
      started = true;
    } else {
      env.ctx.lineTo(px, py);
    }
  }
  env.ctx.stroke();
  env.ctx.fillStyle = '#176b87';
  env.ctx.fillText('f(x)=x²', env.xToPx(-4.5), env.yToPx(6.5));
  env.ctx.fillStyle = '#d96c3f';
  env.ctx.fillText("f’(x)=2x", env.xToPx(1.2), env.yToPx(4.6));
}

function renderAbsolute() {
  const env = drawCurve(document.getElementById('absolute-canvas'), (x) => Math.abs(x), { rangeX: 5, rangeY: 5, color: '#176b87' });
  drawLine(env, -1, 0, '#d96c3f');
  drawLine(env, 1, 0, '#1d7b53');
  point(env, 0, 0, '#176b87');
}

function renderRule() {
  const examples = {
    sum: "(3x² - 5x + 7)’ = 6x - 5",
    product: "((x⁴ + 1)(x² - 1))’ = (4x³)(x² - 1) + (x⁴ + 1)(2x)",
    quotient: "(x² / (2x + 1))’ = (2x(2x + 1) - 2x²) / (2x + 1)²",
    chain: "((4x + 3)⁶)’ = 6(4x + 3)⁵ · 4",
  };
  const key = document.getElementById('rule-select')?.value || 'sum';
  document.getElementById('rule-result').textContent = examples[key];
}

['secant-a', 'secant-b'].forEach((id) => document.getElementById(id)?.addEventListener('input', renderSecant));
document.getElementById('tangent-h')?.addEventListener('input', renderTangentLimit);
document.getElementById('derivative-x0')?.addEventListener('input', renderDerivativeAtPoint);
document.getElementById('rule-select')?.addEventListener('change', renderRule);

renderSecant();
renderTangentLimit();
renderDerivativeAtPoint();
renderDerivedFunction();
renderAbsolute();
renderRule();

if (manimListNode) {
  calculDifferentielVideos.slice().sort((a, b) => a.order - b.order).forEach((video) => {
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
    chapter.textContent = 'Calcul différentiel';
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
