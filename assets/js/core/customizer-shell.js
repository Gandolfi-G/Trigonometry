import { buildSearchFromConfig, hasKnownQueryParams, parseConfigFromSearch } from './query-params.js';
import { loadFromStorage, removeFromStorage, saveToStorage } from './storage.js';
import { VERSION_LABEL } from './version.js';
import { unique } from './utils.js';

/**
 * Rend un customizer générique pour une notion.
 * @param {{
 *  notion: { id: string, title: string, description: string, pagePath: string },
 *  schema: Record<string, any>,
 *  defaults: Record<string, any>,
 *  storageKey: string
 * }} options
 */
export function bootCustomizerPage(options) {
  const { notion, schema, defaults, storageKey } = options;

  document.title = `Personnalisation - ${notion.title}`;

  const titleNode = document.getElementById('customizer-title');
  const descriptionNode = document.getElementById('customizer-description');
  const formNode = document.getElementById('customizer-form');
  const previewNode = document.getElementById('generated-url');
  const openButton = document.getElementById('open-page-btn');
  const copyButton = document.getElementById('copy-url-btn');
  const saveButton = document.getElementById('save-config-btn');
  const resetButton = document.getElementById('reset-config-btn');
  const versionNode = document.getElementById('site-version');

  if (titleNode) titleNode.textContent = `Personnaliser : ${notion.title}`;
  if (descriptionNode) descriptionNode.textContent = notion.description;
  if (versionNode) versionNode.textContent = VERSION_LABEL;

  const hasQuery = hasKnownQueryParams(schema);
  const { config: queryConfig } = parseConfigFromSearch(schema, defaults);
  const storedConfig = loadFromStorage(storageKey, null);

  const state = {
    config: hasQuery
      ? sanitizeConfig(schema, queryConfig, defaults)
      : sanitizeConfig(schema, storedConfig || structuredClone(defaults), defaults),
  };

  if (!formNode) {
    return;
  }

  const onChange = () => {
    state.config = readForm(formNode, schema, state.config);
    refreshPreview();
  };

  renderForm(formNode, schema, state.config, onChange);
  refreshPreview();

  openButton?.addEventListener('click', () => {
    window.open(previewNode?.textContent || '#', '_blank');
  });

  copyButton?.addEventListener('click', async () => {
    const text = previewNode?.textContent || '';
    try {
      await navigator.clipboard.writeText(text);
      copyButton.textContent = 'URL copiée';
      setTimeout(() => {
        copyButton.textContent = 'Copier l’URL';
      }, 1400);
    } catch {
      copyButton.textContent = 'Copie impossible';
      setTimeout(() => {
        copyButton.textContent = 'Copier l’URL';
      }, 1400);
    }
  });

  saveButton?.addEventListener('click', () => {
    saveToStorage(storageKey, state.config);
    saveButton.textContent = 'Configuration sauvegardée';
    setTimeout(() => {
      saveButton.textContent = 'Sauvegarder';
    }, 1400);
  });

  resetButton?.addEventListener('click', () => {
    state.config = structuredClone(defaults);
    removeFromStorage(storageKey);
    renderForm(formNode, schema, state.config, onChange);
    refreshPreview();
  });

  function refreshPreview() {
    const query = buildSearchFromConfig(schema, state.config);
    const pageUrl = new URL(notion.pagePath, window.location.href);
    pageUrl.search = query;
    if (previewNode) {
      previewNode.textContent = pageUrl.toString();
    }
    if (openButton) {
      openButton.setAttribute('data-target-url', pageUrl.toString());
    }
  }
}

function renderForm(formNode, schema, config, onChange) {
  formNode.innerHTML = '';

  Object.entries(schema).forEach(([key, field]) => {
    const row = document.createElement('div');
    row.className = 'customizer-row';

    const label = document.createElement('label');
    label.className = 'customizer-label';
    label.textContent = field.label || key;

    const help = document.createElement('p');
    help.className = 'customizer-help';
    help.textContent = field.description || '';

    row.append(label);

    if (field.type === 'boolean') {
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.name = key;
      input.checked = Boolean(config[key]);
      input.addEventListener('change', onChange);
      row.append(input);
    } else if (field.type === 'enum') {
      if (field.ui === 'switch' && field.values.length === 2) {
        const switchRoot = document.createElement('div');
        switchRoot.className = 'customizer-enum-switch';

        field.values.forEach((value, index) => {
          const switchLabel = document.createElement('label');
          switchLabel.className = 'customizer-enum-switch-option';

          const radio = document.createElement('input');
          radio.type = 'radio';
          radio.name = key;
          radio.value = value;
          radio.checked = config[key] === value;
          radio.addEventListener('change', onChange);

          const text = document.createElement('span');
          text.textContent = field.valueLabels?.[value] || value;

          if (index === 0) {
            switchLabel.classList.add('is-left');
          } else if (index === field.values.length - 1) {
            switchLabel.classList.add('is-right');
          }

          switchLabel.append(radio, text);
          switchRoot.append(switchLabel);
        });

        row.append(switchRoot);
      } else {
        const select = document.createElement('select');
        select.name = key;
        field.values.forEach((value) => {
          const option = document.createElement('option');
          option.value = value;
          option.textContent = field.valueLabels?.[value] || value;
          option.selected = config[key] === value;
          select.append(option);
        });
        select.addEventListener('change', onChange);
        row.append(select);
      }
    } else if (field.type === 'csv') {
      const list = document.createElement('div');
      list.className = 'customizer-checkbox-list';

      field.values.forEach((value) => {
        const subLabel = document.createElement('label');
        subLabel.className = 'customizer-subcheck';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = key;
        checkbox.value = value;
        checkbox.checked = Array.isArray(config[key]) && config[key].includes(value);
        checkbox.addEventListener('change', onChange);

        const text = document.createElement('span');
        text.textContent = field.valueLabels?.[value] || value;

        subLabel.append(checkbox, text);
        list.append(subLabel);
      });

      row.append(list);
    } else if (field.type === 'number') {
      const input = document.createElement('input');
      input.type = 'number';
      input.name = key;
      input.value = String(config[key]);
      if (typeof field.min === 'number') input.min = String(field.min);
      if (typeof field.max === 'number') input.max = String(field.max);
      if (typeof field.step === 'number') input.step = String(field.step);
      input.addEventListener('input', onChange);
      row.append(input);
    }

    row.append(help);
    formNode.append(row);
  });
}

function readForm(formNode, schema, fallbackConfig) {
  const next = structuredClone(fallbackConfig);

  Object.entries(schema).forEach(([key, field]) => {
    if (field.type === 'boolean') {
      const input = formNode.querySelector(`input[name="${key}"]`);
      next[key] = Boolean(input?.checked);
    }

    if (field.type === 'enum') {
      const selectInput = formNode.querySelector(`select[name="${key}"]`);
      if (selectInput) {
        next[key] = selectInput.value ?? field.default;
        return;
      }

      const radioInput = formNode.querySelector(`input[name="${key}"]:checked`);
      next[key] = radioInput?.value ?? field.default;
    }

    if (field.type === 'csv') {
      const inputs = Array.from(formNode.querySelectorAll(`input[name="${key}"]:checked`));
      next[key] = inputs.map((input) => input.value);
    }

    if (field.type === 'number') {
      const input = formNode.querySelector(`input[name="${key}"]`);
      const numeric = Number(input?.value);
      next[key] = Number.isFinite(numeric) ? numeric : field.default;
    }
  });

  return next;
}

function sanitizeConfig(schema, rawConfig, defaults) {
  const source = rawConfig && typeof rawConfig === 'object' ? rawConfig : {};
  const cleaned = {};

  Object.entries(schema).forEach(([key, field]) => {
    const fallback = defaults[key] ?? field.default;
    const value = source[key];

    if (field.type === 'boolean') {
      cleaned[key] = typeof value === 'boolean' ? value : Boolean(fallback);
      return;
    }

    if (field.type === 'enum') {
      cleaned[key] = field.values.includes(value) ? value : fallback;
      return;
    }

    if (field.type === 'csv') {
      const tokens = Array.isArray(value) ? value.filter((token) => field.values.includes(token)) : [];
      cleaned[key] = tokens.length > 0 ? unique(tokens) : [...fallback];
      return;
    }

    if (field.type === 'number') {
      const numeric = Number(value);
      if (!Number.isFinite(numeric)) {
        cleaned[key] = fallback;
        return;
      }
      if (typeof field.min === 'number' && numeric < field.min) {
        cleaned[key] = fallback;
        return;
      }
      if (typeof field.max === 'number' && numeric > field.max) {
        cleaned[key] = fallback;
        return;
      }
      cleaned[key] = numeric;
      return;
    }

    cleaned[key] = fallback;
  });

  return cleaned;
}
