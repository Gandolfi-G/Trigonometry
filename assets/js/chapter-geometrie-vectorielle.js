import { geometrieVectorielleVideos } from './content/geometrie-vectorielle-videos.js';
import { VERSION_LABEL, RELEASE_DATE } from './core/version.js';

const versionNode = document.getElementById('site-version');
const releaseNode = document.getElementById('release-date');
const manimListNode = document.getElementById('manim-list');

if (versionNode) versionNode.textContent = VERSION_LABEL;
if (releaseNode) releaseNode.textContent = RELEASE_DATE;

function value(id) {
  return Number(document.getElementById(id)?.value || 0);
}

function setup(canvas, range = 6) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const s = Math.min(w, h) / (2 * range);
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = '#d9e0d4';
  ctx.lineWidth = 1;
  for (let x = -range; x <= range; x += 1) {
    ctx.beginPath(); ctx.moveTo(w / 2 + x * s, 0); ctx.lineTo(w / 2 + x * s, h); ctx.stroke();
  }
  for (let y = -range; y <= range; y += 1) {
    ctx.beginPath(); ctx.moveTo(0, h / 2 - y * s); ctx.lineTo(w, h / 2 - y * s); ctx.stroke();
  }
  ctx.strokeStyle = '#54606e';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke();
  return {
    ctx, w, h, s,
    x: (n) => w / 2 + n * s,
    y: (n) => h / 2 - n * s,
  };
}

function arrow(env, x1, y1, x2, y2, color = '#176b87', width = 4) {
  const { ctx } = env;
  const ax = env.x(x1);
  const ay = env.y(y1);
  const bx = env.x(x2);
  const by = env.y(y2);
  const angle = Math.atan2(by - ay, bx - ax);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(bx, by);
  ctx.lineTo(bx - 13 * Math.cos(angle - Math.PI / 6), by - 13 * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(bx - 13 * Math.cos(angle + Math.PI / 6), by - 13 * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
}

function dot(env, x, y, color = '#1d7b53') {
  env.ctx.fillStyle = color;
  env.ctx.beginPath();
  env.ctx.arc(env.x(x), env.y(y), 6, 0, Math.PI * 2);
  env.ctx.fill();
}

function label(env, text, x, y, color = '#1b2430') {
  env.ctx.fillStyle = color;
  env.ctx.font = '700 14px Segoe UI';
  env.ctx.fillText(text, env.x(x), env.y(y));
}

function renderVector() {
  const vx = value('vec-x');
  const vy = value('vec-y');
  const env = setup(document.getElementById('vec-canvas'));
  arrow(env, 0, 0, vx, vy);
  arrow(env, -4, -2, -4 + vx, -2 + vy, '#d96c3f');
  arrow(env, 1, -4, 1 + vx, -4 + vy, '#3f7d58');
  label(env, 'même vecteur, plusieurs représentants', -5.6, 5.3);
  document.getElementById('vec-result').textContent = `v = (${vx}; ${vy}), norme = √(${vx * vx + vy * vy}) ≈ ${Math.hypot(vx, vy).toFixed(2)}`;
}

function renderSum() {
  const ux = value('u-x');
  const uy = value('u-y');
  const vx = value('v-x');
  const vy = value('v-y');
  const env = setup(document.getElementById('sum-canvas'));
  arrow(env, 0, 0, ux, uy, '#176b87');
  arrow(env, ux, uy, ux + vx, uy + vy, '#d96c3f');
  arrow(env, 0, 0, ux + vx, uy + vy, '#1d7b53', 5);
  dot(env, ux + vx, uy + vy);
  document.getElementById('sum-result').textContent = `u + v = (${ux}; ${uy}) + (${vx}; ${vy}) = (${ux + vx}; ${uy + vy})`;
}

function renderColinear() {
  const k = value('col-k');
  const base = [2, 1];
  const env = setup(document.getElementById('col-canvas'));
  arrow(env, 0, 0, base[0], base[1], '#176b87');
  arrow(env, 0, 0, k * base[0], k * base[1], k < 0 ? '#d96c3f' : '#1d7b53', 5);
  document.getElementById('col-result').textContent = `w = ${k.toFixed(1)}v : les deux vecteurs sont colinéaires.`;
}

function renderDot() {
  const deg = value('dot-angle');
  const theta = deg * Math.PI / 180;
  const u = [3, 0];
  const v = [3 * Math.cos(theta), 3 * Math.sin(theta)];
  const scalar = u[0] * v[0] + u[1] * v[1];
  const env = setup(document.getElementById('dot-canvas'));
  arrow(env, 0, 0, u[0], u[1], '#176b87');
  arrow(env, 0, 0, v[0], v[1], '#d96c3f');
  env.ctx.strokeStyle = '#1d7b53';
  env.ctx.lineWidth = 3;
  env.ctx.beginPath();
  env.ctx.arc(env.x(0), env.y(0), 42, -theta, 0, true);
  env.ctx.stroke();
  document.getElementById('dot-result').textContent = `u · v = ||u|| ||v|| cos(θ) = ${scalar.toFixed(2)} pour θ = ${deg}°`;
}

function renderLineParam() {
  const l = value('line-lambda');
  const a = [-2, -1];
  const d = [2, 1];
  const p = [a[0] + l * d[0], a[1] + l * d[1]];
  const env = setup(document.getElementById('line-param-canvas'));
  arrow(env, a[0] - 4 * d[0], a[1] - 4 * d[1], a[0] + 4 * d[0], a[1] + 4 * d[1], '#176b87', 3);
  dot(env, a[0], a[1], '#d96c3f');
  dot(env, p[0], p[1], '#1d7b53');
  label(env, 'A', a[0] + 0.2, a[1] - 0.2, '#d96c3f');
  label(env, 'P(λ)', p[0] + 0.2, p[1] + 0.4, '#1d7b53');
  document.getElementById('line-param-result').textContent = `P = A + λd = (-2; -1) + ${l.toFixed(1)}(2; 1) = (${p[0].toFixed(1)}; ${p[1].toFixed(1)})`;
}

function renderCircle() {
  const deg = value('circle-theta');
  const theta = deg * Math.PI / 180;
  const c = [1, -1];
  const r = 3;
  const p = [c[0] + r * Math.cos(theta), c[1] + r * Math.sin(theta)];
  const env = setup(document.getElementById('circle-canvas'));
  env.ctx.strokeStyle = '#176b87';
  env.ctx.lineWidth = 4;
  env.ctx.beginPath();
  env.ctx.arc(env.x(c[0]), env.y(c[1]), r * env.s, 0, Math.PI * 2);
  env.ctx.stroke();
  arrow(env, c[0], c[1], p[0], p[1], '#d96c3f');
  const nx = Math.cos(theta);
  const ny = Math.sin(theta);
  const tx = -ny;
  const ty = nx;
  arrow(env, p[0] - 2 * tx, p[1] - 2 * ty, p[0] + 2 * tx, p[1] + 2 * ty, '#1d7b53', 3);
  dot(env, c[0], c[1], '#176b87');
  dot(env, p[0], p[1], '#d96c3f');
  document.getElementById('circle-result').textContent = `P(θ)=(${p[0].toFixed(2)}; ${p[1].toFixed(2)}). La tangente est perpendiculaire au rayon.`;
}

['vec-x', 'vec-y'].forEach((id) => document.getElementById(id)?.addEventListener('input', renderVector));
['u-x', 'u-y', 'v-x', 'v-y'].forEach((id) => document.getElementById(id)?.addEventListener('input', renderSum));
document.getElementById('col-k')?.addEventListener('input', renderColinear);
document.getElementById('dot-angle')?.addEventListener('input', renderDot);
document.getElementById('line-lambda')?.addEventListener('input', renderLineParam);
document.getElementById('circle-theta')?.addEventListener('input', renderCircle);

renderVector();
renderSum();
renderColinear();
renderDot();
renderLineParam();
renderCircle();

if (manimListNode) {
  geometrieVectorielleVideos.slice().sort((a, b) => a.order - b.order).forEach((video) => {
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
    chapter.textContent = 'Géométrie vectorielle';
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
