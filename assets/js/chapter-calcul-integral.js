import { calculIntegralVideos } from './content/calcul-integral-videos.js';
import { VERSION_LABEL, RELEASE_DATE } from './core/version.js';

const versionNode = document.getElementById('site-version');
const releaseNode = document.getElementById('release-date');
const manimListNode = document.getElementById('manim-list');

if (versionNode) versionNode.textContent = VERSION_LABEL;
if (releaseNode) releaseNode.textContent = RELEASE_DATE;

const COLORS = {
  curve: '#176b87',
  accent: '#d96c3f',
  green: '#1d7b53',
  grid: '#d9e0d4',
  axis: '#54606e',
  positive: 'rgba(29, 123, 83, 0.35)',
  negative: 'rgba(217, 108, 63, 0.35)',
  upper: 'rgba(217, 108, 63, 0.28)',
  lower: 'rgba(23, 107, 135, 0.28)',
};

function byId(id) {
  return document.getElementById(id);
}

function value(id) {
  return Number(byId(id)?.value || 0);
}

function setup(canvas, rangeX = 5, rangeY = 5) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const sx = w / (2 * rangeX);
  const sy = h / (2 * rangeY);
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 1;
  for (let x = -rangeX; x <= rangeX; x += 0.5) {
    ctx.beginPath();
    ctx.moveTo(w / 2 + x * sx, 0);
    ctx.lineTo(w / 2 + x * sx, h);
    ctx.stroke();
  }
  for (let y = -rangeY; y <= rangeY; y += 0.5) {
    ctx.beginPath();
    ctx.moveTo(0, h / 2 - y * sy);
    ctx.lineTo(w, h / 2 - y * sy);
    ctx.stroke();
  }
  ctx.strokeStyle = COLORS.axis;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(w / 2, 0);
  ctx.lineTo(w / 2, h);
  ctx.stroke();
  return {
    ctx, w, h, sx, sy,
    x: (n) => w / 2 + n * sx,
    y: (n) => h / 2 - n * sy,
  };
}

function plot(env, fn, xMin, xMax, color = COLORS.curve, width = 4) {
  env.ctx.strokeStyle = color;
  env.ctx.lineWidth = width;
  env.ctx.beginPath();
  let started = false;
  const steps = 420;
  for (let i = 0; i <= steps; i += 1) {
    const x = xMin + (i / steps) * (xMax - xMin);
    const y = fn(x);
    if (!Number.isFinite(y)) {
      started = false;
      continue;
    }
    if (!started) {
      env.ctx.moveTo(env.x(x), env.y(y));
      started = true;
    } else {
      env.ctx.lineTo(env.x(x), env.y(y));
    }
  }
  env.ctx.stroke();
}

function dot(env, x, y, color = COLORS.accent) {
  env.ctx.fillStyle = color;
  env.ctx.beginPath();
  env.ctx.arc(env.x(x), env.y(y), 6, 0, Math.PI * 2);
  env.ctx.fill();
}

function line(env, x1, y1, x2, y2, color = COLORS.accent, dashed = false) {
  env.ctx.save();
  env.ctx.strokeStyle = color;
  env.ctx.lineWidth = 2;
  if (dashed) env.ctx.setLineDash([8, 6]);
  env.ctx.beginPath();
  env.ctx.moveTo(env.x(x1), env.y(y1));
  env.ctx.lineTo(env.x(x2), env.y(y2));
  env.ctx.stroke();
  env.ctx.restore();
}

function fillArea(env, fn, a, b, fillStyle = COLORS.positive) {
  env.ctx.fillStyle = fillStyle;
  env.ctx.beginPath();
  env.ctx.moveTo(env.x(a), env.y(0));
  const steps = 180;
  for (let i = 0; i <= steps; i += 1) {
    const x = a + (i / steps) * (b - a);
    env.ctx.lineTo(env.x(x), env.y(fn(x)));
  }
  env.ctx.lineTo(env.x(b), env.y(0));
  env.ctx.closePath();
  env.ctx.fill();
}

function renderPrimitiveFamily() {
  const c = value('primitive-c');
  const env = setup(byId('primitive-canvas'), 3.5, 5);
  [-2, -1, 0, 1, 2].forEach((shift) => {
    plot(env, (x) => x * x + shift, -2.2, 2.2, shift === c ? COLORS.accent : '#9fb0ba', shift === c ? 5 : 2);
  });
  plot(env, (x) => 2 * x, -2.2, 2.2, COLORS.green, 3);
  dot(env, 1, 1 + c);
  byId('primitive-result').textContent = `F(x)=x² ${c >= 0 ? '+' : '-'} ${Math.abs(c).toFixed(1)} vérifie toujours F'(x)=2x. La constante C ne change pas la dérivée.`;
}

function renderPowerRule() {
  const n = value('power-n');
  const env = setup(byId('power-canvas'), 3.5, 4.5);
  const primitive = (x) => x ** (n + 1) / (n + 1);
  fillArea(env, (x) => Math.max(0, x ** n), 0, 1.7, COLORS.lower);
  plot(env, (x) => x ** n, -2, 2, COLORS.curve, 4);
  plot(env, primitive, -2, 2, COLORS.accent, 4);
  dot(env, 1, 1);
  byId('power-result').textContent = `Pour n=${n} : ∫x^${n} dx = x^${n + 1}/${n + 1} + C. La courbe orange est une primitive.`;
}

function renderAreaCurve() {
  const b = value('area-b');
  const env = setup(byId('area-canvas'), 3, 4);
  const fn = (x) => x * x;
  fillArea(env, fn, 0, b, COLORS.positive);
  plot(env, fn, -0.2, 2.25, COLORS.curve, 5);
  line(env, b, 0, b, fn(b), COLORS.accent, true);
  dot(env, b, fn(b));
  byId('area-result').textContent = `Aire de 0 à ${b.toFixed(1)} : ∫₀^${b.toFixed(1)} x² dx = ${((b ** 3) / 3).toFixed(3)}.`;
}

function renderRiemann() {
  const n = value('riemann-n');
  const mode = byId('riemann-mode')?.value || 'lower';
  const env = setup(byId('riemann-canvas'), 3, 6);
  const fn = (x) => x * x + 1;
  const a = 0;
  const b = 2;
  const dx = (b - a) / n;
  let sum = 0;
  env.ctx.strokeStyle = mode === 'upper' ? COLORS.accent : COLORS.curve;
  env.ctx.fillStyle = mode === 'upper' ? COLORS.upper : COLORS.lower;
  for (let i = 0; i < n; i += 1) {
    const left = a + i * dx;
    const right = left + dx;
    const sample = mode === 'upper' ? right : mode === 'middle' ? (left + right) / 2 : left;
    const height = fn(sample);
    sum += height * dx;
    const x = env.x(left);
    const y = env.y(height);
    const w = env.x(right) - env.x(left);
    const h = env.y(0) - env.y(height);
    env.ctx.fillRect(x, y, w, h);
    env.ctx.strokeRect(x, y, w, h);
  }
  plot(env, fn, -0.2, 2.2, COLORS.green, 5);
  const exact = 14 / 3;
  byId('riemann-result').textContent = `${n} rectangles ${mode === 'upper' ? 'majorants' : mode === 'middle' ? 'au milieu' : 'minorants'} : somme ≈ ${sum.toFixed(3)}. Valeur exacte : 14/3 ≈ ${exact.toFixed(3)}.`;
}

function renderSignedArea() {
  const env = setup(byId('signed-canvas'), 4, 4);
  const fn = (x) => x * x * x - 3 * x;
  fillArea(env, fn, -Math.sqrt(3), 0, COLORS.positive);
  fillArea(env, fn, 0, Math.sqrt(3), COLORS.negative);
  plot(env, fn, -2.2, 2.2, COLORS.curve, 5);
  line(env, -Math.sqrt(3), 0, Math.sqrt(3), 0, COLORS.axis);
  byId('signed-result').textContent = 'Les zones au-dessus de l’axe comptent positivement, celles en dessous négativement : l’intégrale est une aire algébrique.';
}

function renderFundamental() {
  const a = value('tfci-a');
  const b = value('tfci-b');
  const left = Math.min(a, b);
  const right = Math.max(a, b);
  const env = setup(byId('tfci-canvas'), 3, 6);
  const f = (x) => x * x + 1;
  const F = (x) => (x ** 3) / 3 + x;
  fillArea(env, f, left, right, COLORS.positive);
  plot(env, f, -0.5, 2.4, COLORS.curve, 5);
  line(env, left, 0, left, f(left), COLORS.accent, true);
  line(env, right, 0, right, f(right), COLORS.accent, true);
  const integral = F(b) - F(a);
  byId('tfci-result').textContent = `Avec F(x)=x³/3+x : ∫_${a.toFixed(1)}^${b.toFixed(1)} (x²+1)dx = F(b)-F(a) ≈ ${integral.toFixed(3)}.`;
}

function renderVideos() {
  if (!manimListNode) return;
  calculIntegralVideos.slice().sort((a, b) => a.order - b.order).forEach((video) => {
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
    chapter.textContent = 'Calcul intégral';
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

byId('primitive-c')?.addEventListener('input', renderPrimitiveFamily);
byId('power-n')?.addEventListener('input', renderPowerRule);
byId('area-b')?.addEventListener('input', renderAreaCurve);
byId('riemann-n')?.addEventListener('input', renderRiemann);
byId('riemann-mode')?.addEventListener('change', renderRiemann);
byId('tfci-a')?.addEventListener('input', renderFundamental);
byId('tfci-b')?.addEventListener('input', renderFundamental);

renderPrimitiveFamily();
renderPowerRule();
renderAreaCurve();
renderRiemann();
renderSignedArea();
renderFundamental();
renderVideos();
