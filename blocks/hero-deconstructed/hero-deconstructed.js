import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../ue/scripts/ue-utils.js';

export default function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row, index) => {
    const hasMedia = !!row.querySelector('picture, img');
    if (index === 0) {
      row.classList.add('hero-deconstructed-main');
    } else {
      row.classList.add('hero-deconstructed-feature');
      row.classList.add(hasMedia
        ? 'hero-deconstructed-feature-media'
        : 'hero-deconstructed-feature-solid');
    }

    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture, img')) {
        cell.classList.add('hero-deconstructed-media');
      } else if (cell.textContent.trim() === '') {
        cell.classList.add('hero-deconstructed-spacer');
      } else {
        cell.classList.add('hero-deconstructed-content');
      }
    });
  });

  // replace images with optimized versions, preserving Universal Editor
  // instrumentation so edits aren't lost when the node is swapped out
  block.querySelectorAll('img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimized.querySelector('img'));
    const target = img.closest('picture') || img;
    target.replaceWith(optimized);
  });
}
