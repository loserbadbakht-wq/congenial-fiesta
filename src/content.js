// src/content.js
//
// Runs in the page's MAIN world (manifest: "world": "MAIN") so that
// customElements.define() calls from @videojs/html register the players
// in the registry the actual page DOM uses.
//
// Two safeguards beyond the standard import pattern:
//   1. Explicit module references + a window assignment prevent esbuild
//      from tree-shaking the side-effect imports.
//   2. A "whenDefined" guard waits for registration before replacing
//      any DOM element, and logs loudly if registration failed.

import * as videoPlayerModule from '@videojs/html/video/player';
import * as videoSkinModule   from '@videojs/html/video/skin';
import * as audioPlayerModule from '@videojs/html/audio/player';
import * as audioSkinModule   from '@videojs/html/audio/skin';

// Keep the four modules reachable at runtime. Assigning the truthiness
// of all four to a window property is an observable side effect, so
// esbuild's tree-shaker keeps the imports and their register calls.
window.__vjsModulesLoaded = !!(videoPlayerModule && videoSkinModule && audioPlayerModule && audioSkinModule);

// Loud check — if anything went wrong upstream, we see it in the console.
(function verifyRegistration() {
  const tags = ['video-player', 'video-skin', 'audio-player', 'audio-skin'];
  for (const tag of tags) {
    if (!customElements.get(tag)) {
      console.error(`[Gamefa Video.js] <${tag}> was NOT registered.`);
    }
  }
  console.log('[Gamefa Video.js] Custom elements registered:', tags.join(', '));
})();

/* ------------------------------------------------------------------ */
/* Sizing — keep the player from stretching to full container width.  */
/* ------------------------------------------------------------------ */
function injectSizeStyles() {
  if (document.getElementById('gft-vjs-styles')) return;
  const style = document.createElement('style');
  style.id = 'gft-vjs-styles';
  style.textContent = `
    video-player, audio-player {
      display: block;
      max-width: 100%;
      width: auto;
    }
    video-player > video-skin,
    audio-player > audio-skin {
      display: block;
      max-width: 100%;
    }
    video-player > video-skin > video {
      max-width: 100%;
      height: auto;
      display: block;
    }
  `;
  document.head.appendChild(style);
}

/* ------------------------------------------------------------------ */
/* Replacement                                                        */
/* ------------------------------------------------------------------ */
const ATTRS_TO_COPY = ['poster', 'preload', 'width', 'height', 'autoplay', 'muted', 'loop'];

function replaceMediaElement(el) {
  if (!el || !el.parentNode) return;
  if (el.closest('video-player, audio-player')) return;
  if (el.parentElement && /^(VIDEO|AUDIO)-PLAYER$/.test(el.parentElement.tagName)) return;

  const isVideo = el.tagName === 'VIDEO';
  const player  = document.createElement(isVideo ? 'video-player' : 'audio-player');
  const skin    = document.createElement(isVideo ? 'video-skin'   : 'audio-skin');
  const media   = document.createElement(isVideo ? 'video'        : 'audio');

  // Carry over classes / inline styles so the page's own rules keep
  // matching — this is what stops the player from blowing up in size.
  if (el.className)   player.className = el.className;
  const inlineStyle = el.getAttribute('style');
  if (inlineStyle)    player.setAttribute('style', inlineStyle);
  if (el.className)   media.className = el.className;

  for (const attr of ATTRS_TO_COPY) {
    if (el.hasAttribute(attr)) media.setAttribute(attr, el.getAttribute(attr));
  }
  media.setAttribute('controls', '');

  const sources = el.querySelectorAll('source');
  if (sources.length > 0) {
    sources.forEach(s => media.appendChild(s.cloneNode(true)));
  } else if (el.getAttribute('src')) {
    media.setAttribute('src', el.getAttribute('src'));
  } else {
    return; // nothing to play — leave it alone
  }

  skin.appendChild(media);
  player.appendChild(skin);
  el.replaceWith(player);

  console.log(`[Gamefa Video.js] Replaced <${el.tagName.toLowerCase()}> with <${player.tagName.toLowerCase()}>`);
}

function processNode(node) {
  if (node.nodeType !== Node.ELEMENT_NODE) return;
  if (node.matches?.('video, audio')) replaceMediaElement(node);
  node.querySelectorAll?.('video, audio').forEach(replaceMediaElement);
}

/* ------------------------------------------------------------------ */
/* Init                                                               */
/* ------------------------------------------------------------------ */
async function init() {
  injectSizeStyles();

  // Wait for Video.js to finish registering its custom elements.
  await Promise.all([
    customElements.whenDefined('video-player'),
    customElements.whenDefined('video-skin'),
    customElements.whenDefined('audio-player'),
    customElements.whenDefined('audio-skin'),
  ]);
  console.log('[Gamefa Video.js] Custom elements ready.');

  const container = document.querySelector('#activity-stream') || document.body;
  container.querySelectorAll('video, audio').forEach(replaceMediaElement);

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) processNode(node);
    }
  });
  observer.observe(container, { childList: true, subtree: true });

  console.log('[Gamefa Video.js] Observer started on', container);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
      }
