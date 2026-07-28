import { notions } from './content/notions.js';
import { manimVideos } from './content/manim-videos.js';
import { VERSION_LABEL, RELEASE_DATE } from './core/version.js';

const versionNode = document.getElementById('site-version');
const releaseNode = document.getElementById('release-date');
const notionListNode = document.getElementById('notion-list');
const manimListNode = document.getElementById('manim-list');

if (versionNode) {
  versionNode.textContent = VERSION_LABEL;
}

if (releaseNode) {
  releaseNode.textContent = RELEASE_DATE;
}

if (notionListNode) {
  const sortedNotions = [...notions].sort((a, b) => a.order - b.order);

  sortedNotions.forEach((notion) => {
    const card = document.createElement('article');
    card.className = 'notion-card notion-card-rich';

    if (Array.isArray(notion.cardColors) && notion.cardColors.length === 2) {
      card.style.setProperty('--card-c1', notion.cardColors[0]);
      card.style.setProperty('--card-c2', notion.cardColors[1]);
    }

    const mediaLink = document.createElement('a');
    mediaLink.href = notion.pagePath;
    mediaLink.className = 'notion-media-link';
    mediaLink.setAttribute('aria-label', `Ouvrir la notion ${notion.title}`);

    const media = document.createElement('div');
    media.className = 'notion-media';

    const indexTag = document.createElement('span');
    indexTag.className = 'notion-index';
    indexTag.textContent = String(notion.order).padStart(2, '0');

    const formulaTag = document.createElement('span');
    formulaTag.className = 'notion-formula';
    formulaTag.textContent = notion.cardFormula;

    media.append(indexTag, formulaTag);
    mediaLink.append(media);

    const content = document.createElement('div');
    content.className = 'notion-card-content';

    const title = document.createElement('h3');
    title.className = 'notion-card-title';
    title.textContent = `${String(notion.order).padStart(2, '0')}. ${notion.title}`;

    const subtitle = document.createElement('p');
    subtitle.className = 'notion-card-subtitle';
    subtitle.textContent = notion.subtitle;

    const description = document.createElement('p');
    description.className = 'notion-card-description';
    description.textContent = notion.description;

    const links = document.createElement('div');
    links.className = 'card-links';

    const openLink = document.createElement('a');
    openLink.href = notion.pagePath;
    openLink.className = 'btn btn-primary';
    openLink.textContent = 'Voir la notion';

    const customizeLink = document.createElement('a');
    customizeLink.href = notion.customizerPath;
    customizeLink.className = 'btn btn-secondary';
    customizeLink.textContent = 'Personnaliser';

    links.append(openLink, customizeLink);
    content.append(title, subtitle, description, links);
    card.append(mediaLink, content);
    notionListNode.append(card);
  });
}

if (manimListNode) {
  const sortedVideos = [...manimVideos].sort((a, b) => a.order - b.order);

  sortedVideos.forEach((video) => {
    const card = document.createElement('article');
    card.className = 'manim-card';

    const preview = document.createElement('div');
    preview.className = 'manim-preview';


    if (video.videoPath) {
      const player = document.createElement('video');
      player.src = video.videoPath;
      player.className = 'manim-player';
      player.controls = true;
      player.preload = 'metadata';
      preview.append(player);
    } else {
      const playMark = document.createElement('span');
      playMark.className = 'manim-play-mark';
      playMark.textContent = '▶';
      preview.append(playMark);
    }


    const content = document.createElement('div');
    content.className = 'manim-card-content';

    const chapter = document.createElement('p');
    chapter.className = 'section-kicker';
    chapter.textContent = video.chapter;

    const title = document.createElement('h3');
    title.textContent = video.title;

    const description = document.createElement('p');
    description.textContent = video.description;

    const meta = document.createElement('p');
    meta.className = 'chapter-meta';
    meta.textContent = video.duration;

    const links = document.createElement('div');
    links.className = 'card-links';

    if (video.videoPath) {
      const videoLink = document.createElement('a');
      videoLink.href = video.videoPath;
      videoLink.className = 'btn btn-primary';
      videoLink.textContent = 'Voir la vidéo';
      links.append(videoLink);
    }

    const sourceLink = document.createElement('a');
    sourceLink.href = video.sourcePath;
    sourceLink.className = 'btn btn-secondary';
    sourceLink.textContent = 'Code source';
    links.append(sourceLink);

    content.append(chapter, title, description, meta, links);
    card.append(preview, content);
    manimListNode.append(card);
  });
}
