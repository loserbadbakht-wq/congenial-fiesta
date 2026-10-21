# Gamefa Video.js Player

A Firefox extension that replaces the native `<video>` and `<audio>` players
inside [Gamefa](https://gamefa.com) group activity pages with the custom
elements from **Video.js 10**.

## Features

- Runs only on `https://gamefa.com/groups/*`.
- Bundles Video.js 10 directly — no external CDN or network request.
- Replaces both video and audio players:
  - `<video-player><video-skin><video …></video></video-skin></video-player>`
  - `<audio-player><audio-skin><audio …></audio></audio-skin></audio-player>`
- Automatically upgrades newly loaded posts (via `MutationObserver`).
- Works on desktop and Android versions of Firefox 128+.

## Build locally

```bash
npm install
npm run build
cp manifest.json dist/
mkdir -p dist/icons && cp -r icons/. dist/icons/
npm run package
