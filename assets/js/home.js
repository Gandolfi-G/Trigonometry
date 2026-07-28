import { chapters } from './content/chapters.js';
import { VERSION_LABEL, RELEASE_DATE } from './core/version.js';

const versionNode = document.getElementById('site-version');
const releaseNode = document.getElementById('release-date');
const chapterListNode = document.getElementById('chapter-list');

if (versionNode) {
  versionNode.textContent = VERSION_LABEL;
}

if (releaseNode) {
  releaseNode.textContent = RELEASE_DATE;
}

if (chapterListNode) {
  const sortedChapters = [...chapters].sort((a, b) => a.order - b.order);

  sortedChapters.forEach((chapter) => {
    const card = document.createElement('a');
    card.className = 'chapter-card chapter-link-card';
    card.href = chapter.path;

    const index = document.createElement('span');
    index.className = 'chapter-number';
    index.textContent = `Chapitre ${chapter.order}`;

    const header = document.createElement('div');
    header.className = 'chapter-card-header';
    header.append(index);
    if (chapter.status === 'À préparer') {
      const status = document.createElement('span');
      status.className = 'status-pill';
      status.textContent = chapter.status;
      header.append(status);
    }

    const title = document.createElement('h3');
    title.textContent = chapter.title;

    const description = document.createElement('p');
    description.textContent = chapter.description;

    const meta = document.createElement('p');
    meta.className = 'chapter-meta';
    meta.textContent = chapter.jsCount || chapter.manimCount
      ? `${chapter.jsCount || 0} animations JavaScript + ${chapter.manimCount || 0} vidéos Manim`
      : 'Espace prêt pour les animations JavaScript et Manim';

    card.append(header, title, description, meta);
    chapterListNode.append(card);
  });
}
