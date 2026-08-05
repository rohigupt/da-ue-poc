/*
 * Deconstructed hero block: a large hero panel followed by a stack of smaller
 * "bento" cards. Row 1 is the hero (image cell + content cell, styled like
 * blocks/hero's `unify` variant); each subsequent row is a card (an optional
 * image cell + a content cell) reusing the badge/heading/link authoring
 * pattern from blocks/cards. A card carrying an image is tagged `.feature` so
 * it can render the image as a full-bleed background instead of an inline cell.
 */
export default function init(el) {
  const [main, ...cards] = [...el.children];

  main.classList.add('hero-deconstructed-main');
  [...main.children].forEach((div) => {
    div.className = div.querySelector(':scope > picture')
      ? 'hero-deconstructed-image'
      : 'hero-deconstructed-content';
  });
  if (!main.querySelector('picture')) main.classList.add('no-image');

  cards.forEach((row) => {
    row.classList.add('hero-deconstructed-card');
    let hasImage = false;
    [...row.children].forEach((div) => {
      if (div.querySelector(':scope > picture')) {
        div.className = 'hero-deconstructed-card-image';
        hasImage = true;
      } else {
        div.className = 'hero-deconstructed-card-body';
      }
    });
    if (hasImage) row.classList.add('feature');
  });
}
