(function(){
  if(window.__TRIGO_CUSTOMIZER__) return;
  window.__TRIGO_CUSTOMIZER__ = true;

  const defaults = {
    primary: '#35478c',
    bg: '#f5f6fa',
    text: '#1f2937',
    scale: 1,
    maxw: 1100,
    radius: 12,
    hideHeader: false,
    hideFooter: false
  };

  const LS_KEY = 'trigo.customizer.global.v1';

  function clamp(n, min, max){
    return Math.max(min, Math.min(max, n));
  }

  function parseNum(value, fallback, min, max){
    const n = Number(value);
    if(!Number.isFinite(n)) return fallback;
    return clamp(n, min, max);
  }

  function readUrlPatch(){
    const p = new URLSearchParams(window.location.search);
    const patch = {};
    if(p.get('c_primary')) patch.primary = p.get('c_primary');
    if(p.get('c_bg')) patch.bg = p.get('c_bg');
    if(p.get('c_text')) patch.text = p.get('c_text');
    if(p.get('c_scale')) patch.scale = parseNum(p.get('c_scale'), defaults.scale, 0.8, 1.35);
    if(p.get('c_maxw')) patch.maxw = parseNum(p.get('c_maxw'), defaults.maxw, 860, 1600);
    if(p.get('c_radius')) patch.radius = parseNum(p.get('c_radius'), defaults.radius, 0, 28);
    if(p.get('c_hideHeader') === '1') patch.hideHeader = true;
    if(p.get('c_hideHeader') === '0') patch.hideHeader = false;
    if(p.get('c_hideFooter') === '1') patch.hideFooter = true;
    if(p.get('c_hideFooter') === '0') patch.hideFooter = false;
    return patch;
  }

  function readStorage(){
    try{
      const raw = localStorage.getItem(LS_KEY);
      if(!raw) return {};
      const obj = JSON.parse(raw);
      return obj && typeof obj === 'object' ? obj : {};
    } catch(_e){
      return {};
    }
  }

  let state = Object.assign({}, defaults, readStorage(), readUrlPatch());

  function apply(){
    const root = document.documentElement;
    root.style.setProperty('--cst-primary', state.primary);
    root.style.setProperty('--cst-bg', state.bg);
    root.style.setProperty('--cst-text', state.text);
    root.style.setProperty('--cst-scale', String(state.scale));
    root.style.setProperty('--cst-maxw', `${state.maxw}px`);
    root.style.setProperty('--cst-radius', `${state.radius}px`);

    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    if(header) header.style.display = state.hideHeader ? 'none' : '';
    if(footer) footer.style.display = state.hideFooter ? 'none' : '';
  }

  function persist(){
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }

  function syncUrl(){
    const url = new URL(window.location.href);
    const p = url.searchParams;
    p.set('c_primary', state.primary);
    p.set('c_bg', state.bg);
    p.set('c_text', state.text);
    p.set('c_scale', String(state.scale));
    p.set('c_maxw', String(state.maxw));
    p.set('c_radius', String(state.radius));
    p.set('c_hideHeader', state.hideHeader ? '1' : '0');
    p.set('c_hideFooter', state.hideFooter ? '1' : '0');
    history.replaceState(null, '', url.toString());
  }

  function copyUrl(){
    const value = window.location.href;
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(value).catch(() => {});
      return;
    }
    const ta = document.createElement('textarea');
    ta.value = value;
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }

  function reset(){
    state = Object.assign({}, defaults);
    apply();
    persist();
    syncUrl();
    hydrateInputs();
  }

  function update(patch){
    state = Object.assign({}, state, patch);
    apply();
    persist();
    syncUrl();
  }

  const root = document.createElement('div');
  root.className = 'cst-root';
  root.innerHTML = `
    <button class="cst-toggle" type="button">Personnaliser</button>
    <section class="cst-panel" aria-label="Panneau de personnalisation">
      <h3>Personnalisation globale</h3>
      <div class="cst-grid">
        <label for="cst_primary">Couleur principale</label><input id="cst_primary" type="color">
        <label for="cst_bg">Fond</label><input id="cst_bg" type="color">
        <label for="cst_text">Texte</label><input id="cst_text" type="color">
        <label for="cst_scale">Taille du texte</label><input id="cst_scale" type="range" min="0.8" max="1.35" step="0.01">
        <label for="cst_maxw">Largeur max</label><input id="cst_maxw" type="number" min="860" max="1600" step="10">
        <label for="cst_radius">Rayon des cartes</label><input id="cst_radius" type="range" min="0" max="28" step="1">
        <label for="cst_hideHeader">Masquer header</label><input id="cst_hideHeader" type="checkbox">
        <label for="cst_hideFooter">Masquer footer</label><input id="cst_hideFooter" type="checkbox">
      </div>
      <div class="cst-actions">
        <button class="cst-btn primary" id="cst_copy" type="button">Copier URL</button>
        <button class="cst-btn" id="cst_reset" type="button">Réinitialiser</button>
        <a class="cst-btn" href="customizer-studio.html">Studio</a>
      </div>
      <p class="cst-note">Les réglages sont persistés (localStorage) et ajoutés à l'URL.</p>
    </section>
  `;
  document.body.appendChild(root);

  const panel = root.querySelector('.cst-panel');
  const toggle = root.querySelector('.cst-toggle');

  function byId(id){ return root.querySelector(`#${id}`); }

  function hydrateInputs(){
    byId('cst_primary').value = state.primary;
    byId('cst_bg').value = state.bg;
    byId('cst_text').value = state.text;
    byId('cst_scale').value = String(state.scale);
    byId('cst_maxw').value = String(state.maxw);
    byId('cst_radius').value = String(state.radius);
    byId('cst_hideHeader').checked = !!state.hideHeader;
    byId('cst_hideFooter').checked = !!state.hideFooter;
  }

  toggle.addEventListener('click', () => panel.classList.toggle('open'));

  byId('cst_primary').addEventListener('input', (e) => update({primary: e.target.value}));
  byId('cst_bg').addEventListener('input', (e) => update({bg: e.target.value}));
  byId('cst_text').addEventListener('input', (e) => update({text: e.target.value}));
  byId('cst_scale').addEventListener('input', (e) => update({scale: parseNum(e.target.value, state.scale, 0.8, 1.35)}));
  byId('cst_maxw').addEventListener('input', (e) => update({maxw: parseNum(e.target.value, state.maxw, 860, 1600)}));
  byId('cst_radius').addEventListener('input', (e) => update({radius: parseNum(e.target.value, state.radius, 0, 28)}));
  byId('cst_hideHeader').addEventListener('change', (e) => update({hideHeader: !!e.target.checked}));
  byId('cst_hideFooter').addEventListener('change', (e) => update({hideFooter: !!e.target.checked}));

  byId('cst_copy').addEventListener('click', copyUrl);
  byId('cst_reset').addEventListener('click', reset);

  apply();
  persist();
  syncUrl();
  hydrateInputs();
})();
