import { fonctionsPolynomialesVideos } from './content/fonctions-polynomiales-videos.js';
import { VERSION_LABEL, RELEASE_DATE } from './core/version.js';

const versionNode = document.getElementById('site-version');
const releaseNode = document.getElementById('release-date');
const manimListNode = document.getElementById('manim-list');

if (versionNode) versionNode.textContent = VERSION_LABEL;
if (releaseNode) releaseNode.textContent = RELEASE_DATE;

function value(id) {
  return Number(document.getElementById(id)?.value || 0);
}

function drawAxes(ctx, w, h, scale = 32) {
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = '#d9e0d4';
  ctx.lineWidth = 1;
  for (let x = -8; x <= 8; x++) {
    ctx.beginPath(); ctx.moveTo(w / 2 + x * scale, 0); ctx.lineTo(w / 2 + x * scale, h); ctx.stroke();
  }
  for (let y = -5; y <= 5; y++) {
    ctx.beginPath(); ctx.moveTo(0, h / 2 - y * scale); ctx.lineTo(w, h / 2 - y * scale); ctx.stroke();
  }
  ctx.strokeStyle = '#54606e';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke();
}

function plot(canvas, fn, color = '#176b87', scale = 32) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  drawAxes(ctx, w, h, scale);
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  let first = true;
  for (let px = 0; px <= w; px++) {
    const x = (px - w / 2) / scale;
    const y = fn(x);
    const py = h / 2 - y * scale;
    if (first) {
      ctx.moveTo(px, py);
      first = false;
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();
}

function renderPolynomial() {
  let a = value('poly-a');
  if (a === 0) a = 1;
  const b = value('poly-b');
  const c = value('poly-c');
  document.getElementById('poly-expression').textContent = `f(x) = ${a}x² ${b >= 0 ? '+' : '-'} ${Math.abs(b)}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)}`;
  plot(document.getElementById('poly-canvas'), (x) => a * x * x + b * x + c, '#176b87', 28);
}

function renderImagePreimage() {
  const x0 = value('image-x');
  const yLevel = value('preimage-y');
  const fn = (x) => x * x - 4;
  const y0 = fn(x0);
  document.getElementById('image-result').textContent = `f(${x0}) = ${y0}. Les préimages de ${yLevel} vérifient x² - 4 = ${yLevel}.`;
  const canvas = document.getElementById('image-canvas');
  plot(canvas, fn, '#d96c3f', 28);
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const scale = 28;
  const toX = (x) => w / 2 + x * scale;
  const toY = (y) => h / 2 - y * scale;
  ctx.strokeStyle = '#1d7b53';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, toY(yLevel)); ctx.lineTo(w, toY(yLevel)); ctx.stroke();
  ctx.fillStyle = '#176b87';
  ctx.beginPath(); ctx.arc(toX(x0), toY(y0), 7, 0, Math.PI * 2); ctx.fill();
}

function renderLine() {
  const a = value('line-a');
  const b = value('line-b');
  document.getElementById('line-result').textContent = `f(x) = ${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)} ; pente = ${a}, ordonnée à l’origine = ${b}`;
  plot(document.getElementById('line-canvas'), (x) => a * x + b, '#3f7d58', 30);
}

function renderOptimisation() {
  const canvas = document.getElementById('optim-canvas');
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  drawAxes(ctx, w, h, 14);
  const fn = (x) => (450 - 15 * x) * (1000 + 100 * x) / 100000;
  ctx.strokeStyle = '#d96c3f';
  ctx.lineWidth = 4;
  ctx.beginPath();
  for (let x = 0; x <= 30; x += 0.2) {
    const px = 45 + x * 14;
    const py = h - 35 - fn(x) * 38;
    if (x === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.fillStyle = '#1d7b53';
  const sx = 45 + 10 * 14;
  const sy = h - 35 - fn(10) * 38;
  ctx.beginPath(); ctx.arc(sx, sy, 7, 0, Math.PI * 2); ctx.fill();
  ctx.fillText('maximum x = 10', sx + 10, sy - 10);
}

['poly-a', 'poly-b', 'poly-c'].forEach((id) => document.getElementById(id)?.addEventListener('input', renderPolynomial));
['image-x', 'preimage-y'].forEach((id) => document.getElementById(id)?.addEventListener('input', renderImagePreimage));
['line-a', 'line-b'].forEach((id) => document.getElementById(id)?.addEventListener('input', renderLine));

renderPolynomial();
renderImagePreimage();
renderLine();
renderOptimisation();

if (manimListNode) {
  fonctionsPolynomialesVideos.slice().sort((a, b) => a.order - b.order).forEach((video) => {
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
    chapter.textContent = 'Fonctions polynomiales';
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
