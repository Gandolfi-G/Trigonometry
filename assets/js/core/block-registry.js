import { createElement } from './utils.js';

/**
 * Rend une liste de blocs déclaratifs et renvoie une fonction de nettoyage.
 * @param {HTMLElement} container
 * @param {Array<{id: string, title?: string, description?: string, enabled?: boolean, render: (target: HTMLElement) => (void|(() => void))}>} blocks
 * @returns {() => void}
 */
export function renderBlocks(container, blocks) {
  container.innerHTML = '';
  const cleanups = [];

  blocks
    .filter((block) => block.enabled !== false)
    .forEach((block) => {
      const section = createElement('section', {
        className: `content-block block-${block.id}`,
      });

      if (block.title) {
        section.append(createElement('h2', { text: block.title }));
      }

      if (block.description) {
        section.append(createElement('p', { className: 'block-description', text: block.description }));
      }

      const body = createElement('div', { className: 'block-body' });
      section.append(body);
      container.append(section);

      const cleanup = block.render(body);
      if (typeof cleanup === 'function') {
        cleanups.push(cleanup);
      }
    });

  return () => {
    cleanups.forEach((cleanup) => cleanup());
    container.innerHTML = '';
  };
}
