/*
 * Deconstructed Hero block
 * A large hero panel (heading + subhead + CTA) on the left, with a stacked
 * column of promo cards (tag + heading + arrow link, optional background image)
 * on the right.
 *
 * Content model (rows):
 *   Row 1            → hero panel: one cell with heading, subhead, CTA link
 *   Row 2 … N        → promo card: cell 1 = tag + heading + arrow link,
 *                      cell 2 (optional) = background image
 */

import { createOptimizedPicture } from '../../scripts/aem.js';

/** Detect an image in a cell whether wrapped in <picture> or a bare <p><img>. */
function findImage(cell) {
  return cell.querySelector('picture') || cell.querySelector(':scope > p > img');
}

/** Decorate the hero panel (first row). */
function decorateHeroPanel(row) {
  const panel = document.createElement('div');
  panel.className = 'deconstructed-hero-panel';

  const content = row.querySelector(':scope > div') || row;
  content.classList.add('deconstructed-hero-panel-content');

  // First paragraph with no link/image acts as the eyebrow tag pill
  const firstP = content.querySelector(':scope > p:first-child');
  if (firstP && !firstP.querySelector('a, img')) firstP.classList.add('tag-pill');

  panel.append(content);
  return panel;
}

/** Decorate a single promo card (rows 2+). */
function decorateCard(row) {
  const card = document.createElement('div');
  card.className = 'deconstructed-hero-card';

  const cells = [...row.children];
  let textCell = cells[0];
  let imageCell = null;

  // Identify which cell (if any) holds the image
  cells.forEach((cell) => {
    if (findImage(cell)) {
      imageCell = cell;
    } else {
      textCell = cell;
    }
  });

  // Background image
  if (imageCell) {
    card.classList.add('deconstructed-hero-card-media');
    const img = imageCell.querySelector('img');
    if (img) {
      const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const media = document.createElement('div');
      media.className = 'deconstructed-hero-card-image';
      media.append(optimized);
      card.append(media);
    }
  }

  // Text content
  const body = document.createElement('div');
  body.className = 'deconstructed-hero-card-body';
  while (textCell.firstElementChild) body.append(textCell.firstElementChild);

  // First paragraph (no link) is the tag pill
  const tag = body.querySelector(':scope > p:first-child');
  if (tag && !tag.querySelector('a, img')) tag.classList.add('tag-pill');

  // Last link becomes the arrow link; make the whole card clickable via overlay
  const link = body.querySelector('a');
  if (link) {
    link.classList.add('deconstructed-hero-card-link');
    const overlay = document.createElement('a');
    overlay.className = 'deconstructed-hero-card-overlay';
    overlay.href = link.href;
    overlay.setAttribute('aria-label', link.textContent.trim());
    card.append(overlay);
  }

  card.append(body);
  return card;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const panel = decorateHeroPanel(rows[0]);

  const cards = document.createElement('div');
  cards.className = 'deconstructed-hero-cards';
  rows.slice(1).forEach((row) => cards.append(decorateCard(row)));

  block.textContent = '';
  block.append(panel);
  if (cards.children.length) block.append(cards);
}
