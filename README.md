# Gamefa Video.js Player

A browser extension for Firefox and Chrome that replaces the native `<video>` and `<audio>` players inside [Gamefa](https://gamefa.com) group activity pages with the modern custom elements from **Video.js 10**.

## Features

- **Targeted:** Runs only on `https://gamefa.com/groups/*`.
- **Self-Contained:** Bundles Video.js 10 directly — no external CDN, no remote code, and no external network requests.
- **Complete Replacement:** Upgrades both video and audio players:
  - `<video-player><video-skin><video …></video></video-skin></video-player>`
  - `<audio-player><audio-skin><audio …></audio></audio-skin></audio-player>`
- **Dynamic:** Automatically upgrades newly loaded posts (via `MutationObserver`).
- **Cross-Platform:** Works on desktop and Android versions of Firefox 128+ (and Chrome 111+).

## Repository Structure

This repository uses separate branches for each browser to keep the build environments clean:
- **`firefox` branch:** Contains the source code and Firefox `manifest.json`.
- **`chrome` branch:** Contains the source code and Chrome `manifest.chrome.json`.
- **`builds-firefox` branch:** Contains the auto-generated `.zip` ready for Mozilla Add-ons (AMO).
- **`builds-chrome` branch:** Contains the auto-generated `.zip` ready for the Chrome Web Store.

---

## Build Locally

To build the extension exactly as the GitHub Actions workflows do, first clone the repository and checkout the branch for your target browser.

### 1. Building for Firefox

```bash
# Clone the Firefox branch
git clone -b firefox https://github.com/loserbadbakht-wq/congenial-fiesta.git
cd congenial-fiesta

# Install dependencies
npm install

# Bundle the content script and Video.js
npm run build

# Prepare the dist folder
mkdir -p dist/icons
cp manifest.json dist/
cp icons/*.png dist/icons/
cp LICENSE dist/
cp NOTICE dist/

# Package the extension for Firefox
npm run package:ff 
# (Creates a .zip in web-ext-artifacts/ ready for AMO)
```

### 2. Building for Chrome

```bash
# Clone the Chrome branch
git clone -b chrome https://github.com/loserbadbakht-wq/congenial-fiesta.git
cd congenial-fiesta

# Install dependencies
npm install

# Bundle the content script and Video.js
npm run build

# Prepare the dist folder
mkdir -p dist/icons
cp manifest.json dist/manifest.json
cp icons/*.png dist/icons/
cp LICENSE dist/
cp NOTICE dist/

# Package the extension for Chrome
npm run package:chrome
# (Creates gamefa-videojs-chrome.zip in the root directory)
```

---

## Installation

### Firefox (Temporary)
1. Go to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on…** and select the built `.zip` file (or the `dist/manifest.json`).

### Chrome (Unpacked)
1. Go to `chrome://extensions`.
2. Enable **Developer mode** (toggle in the top right).
3. Click **Load unpacked** and select the `dist` folder.

---

## License

This extension is released under the **Apache License 2.0**. See the [`LICENSE`](LICENSE) file for details.

### Trademark & Affiliation Disclaimer
This product bundles [Video.js](https://videojs.com), which is licensed under the Apache License 2.0. “Video.js” is a registered trademark of Brightcove Inc. 

“Gamefa” and “gamefa.com” are the property of their respective owners. This browser extension is an independent, open-source project and is **not affiliated with, endorsed by, or sponsored by** Gamefa or its operators. 
