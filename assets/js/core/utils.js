/**
 * Crée un élément DOM avec options usuelles.
 * @param {string} tag
 * @param {Record<string, any>} [options]
 * @param {(Node|string)[]} [children]
 * @returns {HTMLElement}
 */
export function createElement(tag, options = {}, children = []) {
  const element = document.createElement(tag);

  if (options.className) {
    element.className = options.className;
  }

  if (options.text) {
    element.textContent = options.text;
  }

  if (options.html) {
    element.innerHTML = options.html;
  }

  if (options.attrs) {
    Object.entries(options.attrs).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        element.setAttribute(key, String(value));
      }
    });
  }

  if (options.dataset) {
    Object.entries(options.dataset).forEach(([key, value]) => {
      element.dataset[key] = String(value);
    });
  }

  children.forEach((child) => {
    if (typeof child === 'string') {
      element.append(document.createTextNode(child));
    } else if (child) {
      element.append(child);
    }
  });

  return element;
}

/**
 * Formate un nombre pour affichage pédagogique.
 * @param {number} value
 * @param {number} [digits]
 * @returns {string}
 */
export function formatNumber(value, digits = 3) {
  if (!Number.isFinite(value)) {
    return '—';
  }
  return Number(value.toFixed(digits)).toString();
}

/**
 * Limite une valeur numérique entre deux bornes.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Supprime les doublons en conservant l'ordre.
 * @template T
 * @param {T[]} values
 * @returns {T[]}
 */
export function unique(values) {
  return [...new Set(values)];
}
