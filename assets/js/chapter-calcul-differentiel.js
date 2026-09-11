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
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, h);
    ctx.stroke();
  }
  for (let y = -rangeY; y <= rangeY; y += 1) {
    const py = h / 2 - y * sy;
    ctx.beginPath();
    ctx.moveTo(0, py);
    ctx.lineTo(w, py);
    ctx.stroke();
  }
  ctx.strokeStyle = '#54606e';
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
    ctx,
    w,
    h,
    sx,
    sy,
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
  for (let px = 0; px <= w; px += 1) {
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

function drawLine(env, m, p, color = '#d96c3f', options = {}) {
  const x1 = -20;
  const x2 = 20;
  env.ctx.save();
  env.ctx.globalAlpha = options.alpha ?? 1;
  env.ctx.strokeStyle = color;
  env.ctx.lineWidth = options.width ?? 3;
  env.ctx.setLineDash(options.dash || []);
  env.ctx.beginPath();
  env.ctx.moveTo(env.xToPx(x1), env.yToPx(m * x1 + p));
  env.ctx.lineTo(env.xToPx(x2), env.yToPx(m * x2 + p));
  env.ctx.stroke();
  env.ctx.restore();
}

function point(env, x, y, color = '#1d7b53') {
  env.ctx.fillStyle = color;
  env.ctx.beginPath();
  env.ctx.arc(env.xToPx(x), env.yToPx(y), 7, 0, Math.PI * 2);
  env.ctx.fill();
}

function labelPoint(env, x, y, label, color = '#111827', dx = 10, dy = -12) {
  const px = env.xToPx(x);
  const py = env.yToPx(y);
  env.ctx.save();
  env.ctx.font = '800 18px Inter, system-ui, sans-serif';
  env.ctx.lineWidth = 4;
  env.ctx.strokeStyle = 'rgba(248, 250, 248, 0.92)';
  env.ctx.fillStyle = color;
  env.ctx.strokeText(label, px + dx, py + dy);
  env.ctx.fillText(label, px + dx, py + dy);
  env.ctx.restore();
}

function drawDeltaGuide(env, x0, y0, x1, y1, labelX, labelY = 'Δy') {
  env.ctx.save();
  env.ctx.strokeStyle = '#6f5cc2';
  env.ctx.fillStyle = '#6f5cc2';
  env.ctx.lineWidth = 2;
  env.ctx.setLineDash([6, 5]);
  env.ctx.beginPath();
  env.ctx.moveTo(env.xToPx(x0), env.yToPx(y0));
  env.ctx.lineTo(env.xToPx(x1), env.yToPx(y0));
  env.ctx.lineTo(env.xToPx(x1), env.yToPx(y1));
  env.ctx.stroke();
  env.ctx.font = '800 15px Inter, system-ui, sans-serif';
  env.ctx.fillText(labelX, (env.xToPx(x0) + env.xToPx(x1)) / 2 - 7, env.yToPx(y0) + 18);
  env.ctx.fillText(labelY, env.xToPx(x1) + 8, (env.yToPx(y0) + env.yToPx(y1)) / 2);
  env.ctx.restore();
}

function drawSlopeSector(env, x, y, slope, options = {}) {
  const px = env.xToPx(x);
  const py = env.yToPx(y);
  const angle = Math.atan2(-slope * env.sy, env.sx);
  const radius = 46;
  const segment = 64;
  const color = options.color || '#3f7d58';
  const fillColor = options.fillColor || 'rgba(63, 125, 88, 0.18)';
  const labelColor = options.labelColor || color;
  const label = options.label || `pente = ${slope.toFixed(1)}`;

  env.ctx.save();
  env.ctx.fillStyle = fillColor;
  env.ctx.strokeStyle = color;
  env.ctx.lineWidth = 3;
  env.ctx.beginPath();
  env.ctx.moveTo(px, py);
  for (let i = 0; i <= 20; i += 1) {
    const theta = (angle * i) / 20;
    env.ctx.lineTo(px + radius * Math.cos(theta), py + radius * Math.sin(theta));
  }
  env.ctx.closePath();
  env.ctx.fill();
  env.ctx.stroke();

  env.ctx.setLineDash([7, 5]);
  env.ctx.strokeStyle = '#54606e';
  env.ctx.beginPath();
  env.ctx.moveTo(px, py);
  env.ctx.lineTo(px + segment, py);
  env.ctx.stroke();

  env.ctx.setLineDash([]);
  env.ctx.strokeStyle = color;
  env.ctx.beginPath();
  env.ctx.moveTo(px, py);
  env.ctx.lineTo(px + segment * Math.cos(angle), py + segment * Math.sin(angle));
  env.ctx.stroke();

  env.ctx.font = '800 15px Inter, system-ui, sans-serif';
  env.ctx.lineWidth = 4;
  env.ctx.strokeStyle = 'rgba(248, 250, 248, 0.94)';
  env.ctx.fillStyle = labelColor;
  const labelX = px + 16;
  const labelY = py + (slope >= 0 ? -54 : 56);
  env.ctx.strokeText(label, labelX, labelY);
  env.ctx.fillText(label, labelX, labelY);
  env.ctx.restore();
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
  labelPoint(env, a, fa, 'A', '#1d7b53', -22, -12);
  labelPoint(env, b, fb, 'B', '#1d7b53', 10, -12);
  drawDeltaGuide(env, a, fa, b, fb, 'Δx');
  document.getElementById('secant-result').textContent =
    `A(${a.toFixed(1)} ; ${fa.toFixed(1)}) et B(${b.toFixed(1)} ; ${fb.toFixed(1)}) | pente moyenne = Δy / Δx = ${slope.toFixed(2)}`;
}

function renderTangentLimit() {
  const h = inputValue('tangent-h');
  const x0 = 1;
  const fn = (x) => x * x;
  const x = x0 + h;
  const slope = (fn(x) - fn(x0)) / h;
  const tangentSlope = 2 * x0;
  const env = drawCurve(document.getElementById('tangent-canvas'), fn, { rangeX: 5, rangeY: 10 });
  drawLine(env, tangentSlope, fn(x0) - tangentSlope * x0, '#1d7b53', { dash: [10, 8], alpha: 0.5, width: 3 });
  drawLine(env, slope, fn(x0) - slope * x0, '#d96c3f', { width: 4 });
  point(env, x0, fn(x0), '#176b87');
  labelPoint(env, x0, fn(x0), 'A', '#176b87', -24, -12);
  point(env, x, fn(x), '#d96c3f');
  labelPoint(env, x, fn(x), 'H', '#d96c3f', 10, 18);
  drawDeltaGuide(env, x0, fn(x0), x, fn(x), 'h', '');
  env.ctx.save();
  env.ctx.font = '800 15px Inter, system-ui, sans-serif';
  env.ctx.fillStyle = '#1d7b53';
  env.ctx.fillText('tangente', env.xToPx(-3.6), env.yToPx(-5.7));
  env.ctx.fillStyle = '#d96c3f';
  env.ctx.fillText('sécante AH', env.xToPx(1.7), env.yToPx(6.3));
  env.ctx.restore();
  document.getElementById('tangent-result').textContent =
    `h = ${h.toFixed(2)} ; H se rapproche de A ; pente de la sécante AH = ${slope.toFixed(2)} ; pente de la tangente = 2`;
}

function renderDerivativeAtPoint() {
  const x0 = inputValue('derivative-x0');
  const fn = (x) => x * x;
  const slope = 2 * x0;
  const env = drawCurve(document.getElementById('derivative-canvas'), fn, { rangeX: 5, rangeY: 8 });
  drawLine(env, slope, fn(x0) - slope * x0, '#1d7b53');
  drawSlopeSector(env, x0, fn(x0), slope);
  point(env, x0, fn(x0));
  labelPoint(env, x0, fn(x0), 'x₀', '#1d7b53', 10, -14);
  document.getElementById('derivative-result').textContent = `Au point x₀ = ${x0.toFixed(1)}, la tangente a pour pente f’(x₀) = 2x₀ = ${slope.toFixed(1)}`;
}

function renderDerivedFunction() {
  const canvas = document.getElementById('derived-function-canvas');
  const sourceCanvas = document.getElementById('derived-source-canvas');
  if (sourceCanvas) {
    const derivativeCanvas = canvas;
    const x0 = inputValue('derived-x0');
    const fn = (x) => x * x;
    const slope = 2 * x0;
    const orange = '#d96c3f';

    const sourceEnv = drawCurve(sourceCanvas, fn, { rangeX: 5, rangeY: 8, color: '#176b87' });
    drawLine(sourceEnv, slope, fn(x0) - slope * x0, orange, { width: 4 });
    drawSlopeSector(sourceEnv, x0, fn(x0), slope, {
      color: orange,
      fillColor: 'rgba(217, 108, 63, 0.18)',
      labelColor: '#b84d24',
    });
    point(sourceEnv, x0, fn(x0), orange);
    labelPoint(sourceEnv, x0, fn(x0), 'x₀', orange, 10, -14);
    sourceEnv.ctx.save();
    sourceEnv.ctx.font = '800 15px Inter, system-ui, sans-serif';
    sourceEnv.ctx.fillStyle = '#176b87';
    sourceEnv.ctx.fillText('f(x)=x²', sourceEnv.xToPx(-4.6), sourceEnv.yToPx(6.6));
    sourceEnv.ctx.restore();

    const derivativeEnv = setupCanvas(derivativeCanvas, 5, 7);
    derivativeEnv.ctx.save();
    derivativeEnv.ctx.strokeStyle = 'rgba(217, 108, 63, 0.32)';
    derivativeEnv.ctx.lineWidth = 3;
    derivativeEnv.ctx.setLineDash([8, 7]);
    derivativeEnv.ctx.beginPath();
    derivativeEnv.ctx.moveTo(derivativeEnv.xToPx(-3.3), derivativeEnv.yToPx(-6.6));
    derivativeEnv.ctx.lineTo(derivativeEnv.xToPx(3.3), derivativeEnv.yToPx(6.6));
    derivativeEnv.ctx.stroke();
    derivativeEnv.ctx.setLineDash([]);

    derivativeEnv.ctx.strokeStyle = orange;
    derivativeEnv.ctx.lineWidth = 4;
    derivativeEnv.ctx.beginPath();
    let traceStarted = false;
    const traceStart = -3;
    const traceEnd = Math.max(traceStart, x0);
    for (let x = traceStart; x <= traceEnd; x += 0.04) {
      const y = 2 * x;
      if (!traceStarted) {
        derivativeEnv.ctx.moveTo(derivativeEnv.xToPx(x), derivativeEnv.yToPx(y));
        traceStarted = true;
      } else {
        derivativeEnv.ctx.lineTo(derivativeEnv.xToPx(x), derivativeEnv.yToPx(y));
      }
    }
    derivativeEnv.ctx.stroke();

    derivativeEnv.ctx.strokeStyle = 'rgba(217, 108, 63, 0.5)';
    derivativeEnv.ctx.lineWidth = 2;
    derivativeEnv.ctx.setLineDash([5, 5]);
    derivativeEnv.ctx.beginPath();
    derivativeEnv.ctx.moveTo(derivativeEnv.xToPx(x0), derivativeEnv.yToPx(0));
    derivativeEnv.ctx.lineTo(derivativeEnv.xToPx(x0), derivativeEnv.yToPx(slope));
    derivativeEnv.ctx.lineTo(derivativeEnv.xToPx(0), derivativeEnv.yToPx(slope));
    derivativeEnv.ctx.stroke();
    derivativeEnv.ctx.restore();

    point(derivativeEnv, x0, slope, orange);
    labelPoint(derivativeEnv, x0, slope, `(${x0.toFixed(1)} ; ${slope.toFixed(1)})`, orange, 10, slope >= 0 ? -12 : 24);
    derivativeEnv.ctx.save();
    derivativeEnv.ctx.font = '800 15px Inter, system-ui, sans-serif';
    derivativeEnv.ctx.fillStyle = orange;
    derivativeEnv.ctx.fillText('f’(x)=2x', derivativeEnv.xToPx(1.1), derivativeEnv.yToPx(5.2));
    derivativeEnv.ctx.fillText('valeur de la pente', derivativeEnv.xToPx(-4.7), derivativeEnv.yToPx(6.0));
    derivativeEnv.ctx.restore();

    document.getElementById('derived-function-result').textContent =
      `x₀ = ${x0.toFixed(1)} ; pente sur f = ${slope.toFixed(1)} ; on place donc le point (x₀ ; ${slope.toFixed(1)}) sur f’`;
    return;
  }

  const env = drawCurve(canvas, (x) => x * x, { rangeX: 5, rangeY: 8, color: '#176b87' });
  env.ctx.strokeStyle = '#d96c3f';
  env.ctx.lineWidth = 4;
  env.ctx.beginPath();
  let started = false;
  for (let px = 0; px <= env.w; px += 1) {
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
  env.ctx.fillText('f’(x)=2x', env.xToPx(1.2), env.yToPx(4.6));
}

function renderAbsolute() {
  const env = drawCurve(document.getElementById('absolute-canvas'), (x) => Math.abs(x), { rangeX: 5, rangeY: 5, color: '#176b87' });
  drawLine(env, -1, 0, '#d96c3f');
  drawLine(env, 1, 0, '#1d7b53');
  point(env, 0, 0, '#176b87');
}

function renderRule() {
  const examples = {
    sum: '(3x² - 5x + 7)’ = 6x - 5',
    product: '((x⁴ + 1)(x² - 1))’ = (4x³)(x² - 1) + (x⁴ + 1)(2x)',
    quotient: '(x² / (2x + 1))’ = (2x(2x + 1) - 2x²) / (2x + 1)²',
    chain: '((4x + 3)⁶)’ = 6(4x + 3)⁵ · 4',
  };
  const key = document.getElementById('rule-select')?.value || 'sum';
  document.getElementById('rule-result').textContent = examples[key];
}

['secant-a', 'secant-b'].forEach((id) => document.getElementById(id)?.addEventListener('input', renderSecant));
document.getElementById('tangent-h')?.addEventListener('input', renderTangentLimit);
document.getElementById('derivative-x0')?.addEventListener('input', renderDerivativeAtPoint);
document.getElementById('derived-x0')?.addEventListener('input', renderDerivedFunction);
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
