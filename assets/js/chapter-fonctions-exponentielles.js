import { fonctionsExponentiellesVideos } from './content/fonctions-exponentielles-videos.js';
import { VERSION_LABEL, RELEASE_DATE } from './core/version.js';

const versionNode = document.getElementById('site-version');
const releaseNode = document.getElementById('release-date');
const manimListNode = document.getElementById('manim-list');

if (versionNode) versionNode.textContent = VERSION_LABEL;
if (releaseNode) releaseNode.textContent = RELEASE_DATE;

function value(id) {
  return Number(document.getElementById(id)?.value || 0);
}

function setup(canvas, rangeX = 6, rangeY = 6) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const sx = w / (2 * rangeX);
  const sy = h / (2 * rangeY);
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = '#d9e0d4';
  ctx.lineWidth = 1;
  for (let x = -rangeX; x <= rangeX; x += 1) {
    ctx.beginPath(); ctx.moveTo(w / 2 + x * sx, 0); ctx.lineTo(w / 2 + x * sx, h); ctx.stroke();
  }
  for (let y = -rangeY; y <= rangeY; y += 1) {
    ctx.beginPath(); ctx.moveTo(0, h / 2 - y * sy); ctx.lineTo(w, h / 2 - y * sy); ctx.stroke();
  }
  ctx.strokeStyle = '#54606e';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke();
  return {
    ctx, w, h, sx, sy,
    x: (n) => w / 2 + n * sx,
    y: (n) => h / 2 - n * sy,
  };
}

function plot(canvas, fn, options = {}) {
  const rangeX = options.rangeX || 6;
  const rangeY = options.rangeY || 6;
  const env = setup(canvas, rangeX, rangeY);
  env.ctx.strokeStyle = options.color || '#176b87';
  env.ctx.lineWidth = 4;
  env.ctx.beginPath();
  let started = false;
  for (let px = 0; px <= env.w; px++) {
    const x = (px - env.w / 2) / env.sx;
    const y = fn(x);
    if (!Number.isFinite(y) || y < -rangeY * 2 || y > rangeY * 2) {
      started = false;
      continue;
    }
    const py = env.y(y);
    if (!started) {
      env.ctx.moveTo(px, py);
      started = true;
    } else {
      env.ctx.lineTo(px, py);
    }
  }
  env.ctx.stroke();
  return env;
}

function dot(env, x, y, color = '#d96c3f') {
  env.ctx.fillStyle = color;
  env.ctx.beginPath();
  env.ctx.arc(env.x(x), env.y(y), 6, 0, Math.PI * 2);
  env.ctx.fill();
}

function dashed(env, x1, y1, x2, y2, color = '#1d7b53') {
  env.ctx.save();
  env.ctx.strokeStyle = color;
  env.ctx.lineWidth = 2;
  env.ctx.setLineDash([8, 6]);
  env.ctx.beginPath();
  env.ctx.moveTo(env.x(x1), env.y(y1));
  env.ctx.lineTo(env.x(x2), env.y(y2));
  env.ctx.stroke();
  env.ctx.restore();
}

function renderChess() {
  const n = value('chess-square');
  const grains = 2 ** (n - 1);
  const env = setup(document.getElementById('chess-canvas'), 64, 10);
  env.ctx.fillStyle = '#176b87';
  for (let i = 1; i <= 64; i++) {
    const h = Math.log2(2 ** (i - 1) || 1) / 7;
    const x = env.x(i - 32);
    const y = env.h - 25;
    env.ctx.fillRect(x - 2, y - h * 28, 4, h * 28);
  }
  env.ctx.fillStyle = '#d96c3f';
  env.ctx.fillRect(env.x(n - 32) - 4, env.h - 25 - ((n - 1) / 7) * 28, 8, ((n - 1) / 7) * 28);
  document.getElementById('chess-result').textContent = `Case ${n} : 2^${n - 1} = ${grains.toLocaleString('fr-FR')} grains.`;
}

function renderCapital() {
  const years = value('capital-years');
  const rate = value('capital-rate') / 100;
  const capital = 1000 * (1 + rate) ** years;
  const env = setup(document.getElementById('capital-canvas'), 30, 7);
  env.ctx.strokeStyle = '#176b87';
  env.ctx.lineWidth = 4;
  env.ctx.beginPath();
  for (let t = 0; t <= 30; t += 0.25) {
    const c = 1000 * (1 + rate) ** t / 1000;
    const px = env.x(t - 15);
    const py = env.y(c - 1);
    if (t === 0) env.ctx.moveTo(px, py);
    else env.ctx.lineTo(px, py);
  }
  env.ctx.stroke();
  dot(env, years - 15, capital / 1000 - 1);
  document.getElementById('capital-result').textContent = `C = 1000(1 + ${Math.round(rate * 1000) / 10}%)^${years} ≈ CHF ${Math.round(capital).toLocaleString('fr-FR')}.`;
}

function renderExponential() {
  let a = value('exp-base');
  if (Math.abs(a - 1) < 0.05) a = 1.1;
  const env = plot(document.getElementById('exp-canvas'), (x) => a ** x, { rangeX: 5, rangeY: 6 });
  dashed(env, -5, 0, 5, 0, '#d96c3f');
  dot(env, 0, 1, '#1d7b53');
  dot(env, 1, a, '#d96c3f');
  const sens = a > 1 ? 'croissante' : 'décroissante';
  document.getElementById('exp-result').textContent = `f(x) = ${a.toFixed(1)}^x : positive, f(0)=1, fonction ${sens}.`;
}

function renderEuler() {
  const n = value('e-periods');
  const approx = (1 + 1 / n) ** n;
  const env = setup(document.getElementById('e-canvas'), 120, 3);
  env.ctx.strokeStyle = '#176b87';
  env.ctx.lineWidth = 4;
  env.ctx.beginPath();
  for (let k = 1; k <= 120; k++) {
    const y = (1 + 1 / k) ** k;
    const px = env.x(k - 60);
    const py = env.y(y - 1);
    if (k === 1) env.ctx.moveTo(px, py);
    else env.ctx.lineTo(px, py);
  }
  env.ctx.stroke();
  dashed(env, -60, Math.E - 1, 60, Math.E - 1, '#d96c3f');
  dot(env, n - 60, approx - 1);
  document.getElementById('e-result').textContent = `(1 + 1/${n})^${n} ≈ ${approx.toFixed(5)}, proche de e ≈ ${Math.E.toFixed(5)}.`;
}

function renderLog() {
  const yTarget = value('log-target');
  const xTarget = Math.log2(yTarget);
  const env = plot(document.getElementById('log-canvas'), (x) => 2 ** x, { rangeX: 9, rangeY: 8, color: '#176b87' });
  env.ctx.strokeStyle = '#d96c3f';
  env.ctx.lineWidth = 4;
  env.ctx.beginPath();
  let started = false;
  for (let px = env.x(0.15); px <= env.w; px++) {
    const x = (px - env.w / 2) / env.sx;
    const yy = Math.log2(x);
    if (!Number.isFinite(yy) || yy < -8 || yy > 8) continue;
    if (!started) {
      env.ctx.moveTo(px, env.y(yy));
      started = true;
    } else {
      env.ctx.lineTo(px, env.y(yy));
    }
  }
  env.ctx.stroke();
  dashed(env, -1, -1, 8, 8, '#54606e');
  dot(env, xTarget, yTarget, '#176b87');
  dot(env, yTarget, xTarget, '#d96c3f');
  document.getElementById('log-result').textContent = `2^${xTarget.toFixed(2)} ≈ ${yTarget.toFixed(2)}, donc log₂(${yTarget.toFixed(2)}) ≈ ${xTarget.toFixed(2)}.`;
}

function renderLogRule() {
  const rules = {
    product: 'logₐ(xy) = logₐ(x) + logₐ(y)',
    quotient: 'logₐ(x/y) = logₐ(x) - logₐ(y)',
    power: 'logₐ(xⁿ) = n logₐ(x)',
    change: 'logₐ(x) = log_b(x) / log_b(a)',
  };
  const key = document.getElementById('log-rule')?.value || 'product';
  document.getElementById('log-rule-result').textContent = rules[key];
}

document.getElementById('chess-square')?.addEventListener('input', renderChess);
['capital-years', 'capital-rate'].forEach((id) => document.getElementById(id)?.addEventListener('input', renderCapital));
document.getElementById('exp-base')?.addEventListener('input', renderExponential);
document.getElementById('e-periods')?.addEventListener('input', renderEuler);
document.getElementById('log-target')?.addEventListener('input', renderLog);
document.getElementById('log-rule')?.addEventListener('change', renderLogRule);

renderChess();
renderCapital();
renderExponential();
renderEuler();
renderLog();
renderLogRule();

if (manimListNode) {
  fonctionsExponentiellesVideos.slice().sort((a, b) => a.order - b.order).forEach((video) => {
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
    chapter.textContent = 'Fonctions exponentielles';
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
