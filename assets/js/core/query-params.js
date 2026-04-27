import { unique } from './utils.js';

const BOOL_TRUE = new Set(['1', 'true', 'yes', 'on']);
const BOOL_FALSE = new Set(['0', 'false', 'no', 'off']);

/**
 * @typedef {Object} ConfigIssue
 * @property {string} key
 * @property {string} message
 * @property {string} rawValue
 */

/**
 * @typedef {Object} BaseFieldSchema
 * @property {'boolean'|'enum'|'csv'|'number'} type
 * @property {any} default
 * @property {string} [label]
 * @property {string} [description]
 */

/**
 * Normalise la configuration depuis une query string.
 * @param {Record<string, BaseFieldSchema>} schema
 * @param {Record<string, any>} defaults
 * @param {string} [search]
 * @returns {{ config: Record<string, any>, issues: ConfigIssue[] }}
 */
export function parseConfigFromSearch(schema, defaults, search = window.location.search) {
  const params = new URLSearchParams(search);
  const config = {};
  const issues = [];

  Object.entries(schema).forEach(([key, field]) => {
    const fallback = defaults[key] ?? field.default;

    if (!params.has(key)) {
      config[key] = cloneValue(fallback);
      return;
    }

    const rawValue = params.get(key);
    const parsed = parseField(field, rawValue);

    if (parsed.valid) {
      config[key] = parsed.value;
    } else {
      config[key] = cloneValue(fallback);
      issues.push({
        key,
        rawValue: rawValue ?? '',
        message: parsed.message || `Paramètre invalide: ${key}`,
      });
    }
  });

  return { config, issues };
}

/**
 * Génère une query string normalisée à partir d'une config.
 * @param {Record<string, BaseFieldSchema>} schema
 * @param {Record<string, any>} config
 * @returns {string}
 */
export function buildSearchFromConfig(schema, config) {
  const params = new URLSearchParams();

  Object.entries(schema).forEach(([key, field]) => {
    params.set(key, stringifyField(field, config[key]));
  });

  return params.toString();
}

/**
 * Renvoie vrai si la query string contient au moins un paramètre attendu.
 * @param {Record<string, BaseFieldSchema>} schema
 * @param {string} [search]
 * @returns {boolean}
 */
export function hasKnownQueryParams(schema, search = window.location.search) {
  const params = new URLSearchParams(search);
  return Object.keys(schema).some((key) => params.has(key));
}

function parseField(field, rawValue) {
  if (rawValue === null) {
    return { valid: false, message: 'Valeur manquante', value: undefined };
  }

  switch (field.type) {
    case 'boolean':
      return parseBoolean(rawValue);
    case 'enum':
      return parseEnum(field, rawValue);
    case 'csv':
      return parseCsv(field, rawValue);
    case 'number':
      return parseNumber(field, rawValue);
    default:
      return { valid: false, message: `Type non supporté: ${field.type}`, value: undefined };
  }
}

function parseBoolean(rawValue) {
  const normalized = rawValue.trim().toLowerCase();
  if (BOOL_TRUE.has(normalized)) {
    return { valid: true, value: true };
  }
  if (BOOL_FALSE.has(normalized)) {
    return { valid: true, value: false };
  }
  return { valid: false, message: 'Attendu: 1 ou 0', value: undefined };
}

function parseEnum(field, rawValue) {
  if (!field.values || !Array.isArray(field.values)) {
    return { valid: false, message: 'Schéma enum invalide', value: undefined };
  }
  if (field.values.includes(rawValue)) {
    return { valid: true, value: rawValue };
  }
  return {
    valid: false,
    message: `Valeur invalide pour ${field.label || 'enum'}`,
    value: undefined,
  };
}

function parseCsv(field, rawValue) {
  if (!field.values || !Array.isArray(field.values)) {
    return { valid: false, message: 'Schéma csv invalide', value: undefined };
  }

  const tokens = rawValue
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (tokens.length === 0) {
    return { valid: true, value: [] };
  }

  const invalid = tokens.filter((token) => !field.values.includes(token));
  if (invalid.length > 0) {
    return { valid: false, message: `Valeurs non reconnues: ${invalid.join(', ')}`, value: undefined };
  }

  return { valid: true, value: unique(tokens) };
}

function parseNumber(field, rawValue) {
  const value = Number(rawValue);
  if (!Number.isFinite(value)) {
    return { valid: false, message: 'Nombre invalide', value: undefined };
  }

  if (typeof field.min === 'number' && value < field.min) {
    return { valid: false, message: `Valeur < ${field.min}`, value: undefined };
  }

  if (typeof field.max === 'number' && value > field.max) {
    return { valid: false, message: `Valeur > ${field.max}`, value: undefined };
  }

  return { valid: true, value };
}

function stringifyField(field, value) {
  switch (field.type) {
    case 'boolean':
      return value ? '1' : '0';
    case 'csv':
      return Array.isArray(value) ? value.join(',') : '';
    default:
      return String(value);
  }
}

function cloneValue(value) {
  if (Array.isArray(value)) {
    return [...value];
  }
  if (value && typeof value === 'object') {
    return { ...value };
  }
  return value;
}
