import '@videojs/html/video/player';
import '@videojs/html/video/skin';
import '@videojs/html/audio/player';
import '@videojs/html/audio/skin';

console.log('[Gamefa Video.js] Custom elements registered.');

const MEDIA_SELECTOR = 'video, audio';
const PLAYER_TAGS = new Set(['VIDEO-PLAYER', 'AUDIO-PLAYER']);

/**
 * Replace a native <video> or <audio> element with the corresponding
 * Video.js 10 custom element structure.
 */
function replaceMediaElement(el) {
  // Skip if already inside a Video.js player
  if (el.closest('video-player, audio-player')) return;
  // Skip if the parent is already a player (safety)
  if (PLAYER_TAGS.has(el.parentElement?.tagName)) return;

  const isVideo = el.tagName === 'VIDEO';
  const playerTag = isVideo ? 'video-player' : 'audio-player';
  const skinTag = isVideo ? 'video-skin' : 'audio-skin';
  const mediaTag = isVideo ? 'video' : 'audio';

  const player = document.createElement(playerTag);
  const skin = document.createElement(skinTag);
  const media = document.createElement(mediaTag);

  // Copy attributes that make sense for the new media element
  const attrsToCopy = ['poster', 'preload', 'width', 'height', 'controls', 'autoplay', 'muted', 'loop'];
  attrsToCopy.forEach(attr => {
    if (el.hasAttribute(attr)) {
      media.setAttribute(attr, el.getAttribute(attr));
    }
  });

  const src = el.getAttribute('src');
  const sources = el.querySelectorAll('source');

  if (sources.length > 0) {
    sources.forEach(source => {
      media.appendChild(source.cloneNode(true));
    });
  } else if (src) {
    const absoluteSrc = new URL(src, location.href).href;
    media.setAttribute('src', absoluteSrc);
  } else {
    return; // nothing to play — leave it alone
  }

  skin.appendChild(media);
  player.appendChild(skin);
  el.replaceWith(player);

  console.log(`[Gamefa Video.js] Replaced ${el.tagName} with ${playerTag}`);
}

/**
 * Process a DOM node and its descendants for media elements.
 */
function processNode(node) {
  if (node.nodeType !== Node.ELEMENT_NODE) return;

  if (node.matches?.(MEDIA_SELECTOR)) {
    replaceMediaElement(node);
  }
  node.querySelectorAll?.(MEDIA_SELECTOR).forEach(replaceMediaElement);
}

/**
 * Initialise the extension: process existing media and observe for new ones.
 */
function init() {
  const container = document.querySelector('#activity-stream') || document.body;

  container.querySelectorAll(MEDIA_SELECTOR).forEach(replaceMediaElement);

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        processNode(node);
      }
    }
  });

  observer.observe(container, {
    childList: true,
    subtree: true,
  });

  console.log('[Gamefa Video.js] Observer started on', container);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
      }
