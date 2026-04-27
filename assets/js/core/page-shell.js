import { renderBlocks } from './block-registry.js';
import { parseConfigFromSearch } from './query-params.js';
import { VERSION_LABEL } from './version.js';

/**
 * Point d'entrée générique pour une page notion.
 * @param {{
 *  notion: { id: string, title: string, subtitle?: string, description: string, customizerPath: string },
 *  schema: Record<string, any>,
 *  defaults: Record<string, any>,
 *  buildBlocks: (ctx: { config: Record<string, any> }) => Array<any>
 * }} options
 */
export function bootNotionPage(options) {
  const { notion, schema, defaults, buildBlocks } = options;

  document.title = `${notion.title} | Trigonométrie programmable`;

  const titleNode = document.getElementById('page-title');
  const subtitleNode = document.getElementById('page-subtitle');
  const descriptionNode = document.getElementById('page-description');
  const heroNode = document.querySelector('.hero');
  const warningNode = document.getElementById('page-warning');
  const linksNode = document.getElementById('page-links');
  const blocksNode = document.getElementById('blocks-root');
  const versionNode = document.getElementById('site-version');

  const { config, issues } = parseConfigFromSearch(schema, defaults);

  if (titleNode) titleNode.textContent = notion.title;
  if (subtitleNode) subtitleNode.textContent = notion.subtitle || '';
  if (descriptionNode) descriptionNode.textContent = notion.description;
  if (heroNode && typeof config.showHero === 'boolean') {
    heroNode.hidden = !config.showHero;
  }

  if (warningNode) {
    if (issues.length > 0) {
      warningNode.innerHTML = `Paramètres corrigés automatiquement: ${issues
        .map((issue) => `<code>${issue.key}</code>`)
        .join(', ')}.`;
      warningNode.hidden = false;
    } else {
      warningNode.hidden = true;
    }
  }

  if (linksNode) {
    linksNode.innerHTML = '';
    const customizerLink = document.createElement('a');
    customizerLink.href = notion.customizerPath;
    customizerLink.className = 'btn btn-secondary';
    customizerLink.textContent = 'Personnaliser cette page';

    const homeLink = document.createElement('a');
    homeLink.href = '/Trigonometry/index.html';
    homeLink.className = 'btn btn-ghost';
    homeLink.textContent = 'Retour à l’accueil';

    linksNode.append(customizerLink, homeLink);
  }

  if (versionNode) {
    versionNode.textContent = VERSION_LABEL;
  }

  if (!blocksNode) {
    return;
  }

  const blocks = buildBlocks({ config });
  const cleanup = renderBlocks(blocksNode, blocks);

  window.addEventListener('beforeunload', cleanup, { once: true });
}
