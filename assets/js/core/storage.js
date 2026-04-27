const NAMESPACE = 'trigo-site';

function buildKey(key) {
  return `${NAMESPACE}:${key}`;
}

/**
 * Lit une valeur JSON depuis localStorage.
 * @template T
 * @param {string} key
 * @param {T | null} [fallback]
 * @returns {T | null}
 */
export function loadFromStorage(key, fallback = null) {
  try {
    const raw = localStorage.getItem(buildKey(key));
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/**
 * Écrit une valeur JSON en localStorage.
 * @param {string} key
 * @param {unknown} value
 */
export function saveToStorage(key, value) {
  try {
    localStorage.setItem(buildKey(key), JSON.stringify(value));
  } catch {
    // Ignoré volontairement : stockage facultatif.
  }
}

/**
 * Supprime une clé locale.
 * @param {string} key
 */
export function removeFromStorage(key) {
  try {
    localStorage.removeItem(buildKey(key));
  } catch {
    // Ignoré volontairement : stockage facultatif.
  }
}
