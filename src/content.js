// src/content.js
//
// Runs in the page's MAIN world (manifest: "world": "MAIN") so that
// customElements.define() registers the players in the same registry
// the page DOM uses.

import * as videoPlayerModule from '@videojs/html/video/player';
import * as videoSkinModule   from '@videojs/html/video/skin';
import * as audioPlayerModule from '@videojs/html/audio/player';
import * as audioSkinModule   from '@videojs/html/audio/skin';

window.__vjsModulesLoaded =
  !!(videoPlayerModule && videoSkinModule && audioPlayerModule && audioSkinModule);

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
/* Sizing                                                             */
/* ------------------------------------------------------------------ */
function injectSizeStyles() {
  if (document.getElementById('gft-vjs-styles')) return;
  const style = document.createElement('style');
  style.id = 'gft-vjs-styles';
  style.textContent = `
    video-player, audio-player { display: block; max-width: 100%; }
    video-player > video-skin,
    audio-player > audio-skin { display: block; max-width: 100%; }
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

  if (el.className)   player.className = el.className;
  const inlineStyle = el.getAttribute('style');
  if (inlineStyle)    player.setAttribute('style', inlineStyle);

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
    return;
  }

  skin.appendChild(media);
  player.appendChild(skin);

  // Replace the outermost MediaElement.js wrapper (if any) so the old
  // controls, timeline, and play overlay disappear with it.
  const oldWrapper =
       el.closest('.mejs-container')
    || el.closest('.wp-video')
    || el;

  oldWrapper.replaceWith(player);

  console.log(
    `[Gamefa Video.js] Replaced <${el.tagName.toLowerCase()}> ` +
    `(wrapper: <${oldWrapper.tagName.toLowerCase()}${
      oldWrapper.className ? '.' + oldWrapper.className.split(' ').join('.') : ''
    }>)`
  );
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
