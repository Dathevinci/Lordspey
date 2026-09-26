# ✦ Lord Spey — Author's Workspace

> A minimal, distraction-free workspace for authors. Draft prose, organize manuscript chapters, and interconnect living worldbuilding lore like Obsidian.

[![Website](https://img.shields.io/badge/website-dathevinci.github.io%2FLordspey-111116?style=for-the-badge&logo=github)](https://dathevinci.github.io/Lordspey/)
[![Launch Web App](https://img.shields.io/badge/launch-web%20app-ef4444?style=for-the-badge)](https://dathevinci.github.io/Lordspey/app/)
[![Release](https://img.shields.io/badge/release-v1.2.0-111116?style=for-the-badge)](https://github.com/Dathevinci/Lordspey/releases/tag/v1.2.0)
[![License](https://img.shields.io/badge/license-MIT-111116?style=for-the-badge)](LICENSE)

---

## 🌐 Official Website & Web App

- **Landing Page**: [dathevinci.github.io/Lordspey](https://dathevinci.github.io/Lordspey/)
- **Live Web App**: [dathevinci.github.io/Lordspey/app](https://dathevinci.github.io/Lordspey/app/)
- **GitHub Repository**: [github.com/Dathevinci/Lordspey](https://github.com/Dathevinci/Lordspey)

---

## ✨ Features

- **Obsidian-Style [[Wiki-Links]]**: Cross-reference characters, factions, and realms using `[[Note Title]]` or `[[Target|Custom Alias]]`. Click any link to jump directly or create the note instantly.
- **Living Galaxy Graph (`Ctrl+G`)**: Dynamic, interactive constellation starfield mapping your entire story universe. Visualizes category hubs (**Chapters**, **Lore**, **World Building**, **Drafts**), orbital sub-branches, and photon pulse connections.
- **Universe Atlas & Multi-Scale Cartography**: Map entire universes across nested tiers: **Galaxies / Sectors**, **Star Systems** (with radial celestial cores and concentric orbital guide rings), **World Maps** (continents & biomes), and **Station/Vessel Deckplans**. Jump seamlessly between realms using interactive breadcrumbs and one-click pin drill-downs (`[ 🪐 Enter Star System ]` / `[ 🗺️ View World Map ]`).
- **Interactive Map Studio**: Full creative freedom to craft custom maps. Set custom canvas dimensions (16:9, 4:3, 1:1, custom px), paint coastlines with fractal terrain brushes, draw glowing interstellar hyperlanes, manage drawing layers, undo/redo, place celestial lore pins, and export high-res PNGs isolated to the active realm.
- **Ambient Animated Themes**: Subtle, calm atmospheric backdrops in Settings designed for author immersion without distraction: **Cosmic Starfield** (gentle twinkling stars), **Ethereal Nebula** (slow-drifting celestial clouds), **Cozy Fireflies / Embers** (warm twilight glow), and **Midnight Rain & Mist** (peaceful rain streaks), with zero battery drain and complete `prefers-reduced-motion` support.
- **Chronicle Timelines & Codex**: Organize historical story eras, character timelines, and deep codex dossiers with linked markdown notes.
- **Live Side-by-Side Split View (`Ctrl+\`)**: Write in Markdown on the left, watch beautifully formatted typography render live on the right.
- **Document & Scene Outline (`Alt+O`)**: Automatic table of contents generated from `# Headings` and narrative `* * *` scene breaks. Click any heading to jump directly to it.
- **Daily Word Goals & Writing Sprints**: Interactive progress meter tracking session targets (e.g. 500w) with a focused 20-minute sprint countdown timer.
- **In-Editor Find & Replace (`Ctrl+F` / `Ctrl+H`)**: Floating search bar with match counts, navigation, and safe replacement.
- **Manuscript Analytics**: Real-time stats on word counts, character counts, average sentence length, silent reading time, speaking time, and Flesch-Kincaid readability level.
- **Author Typography Controls**: Quick toggle between **Lora (Book Serif)**, **Inter (Clean Sans)**, **JetBrains Mono (Typewriter)**, and **Playfair Display**, with font sizing (`A-` / `A+`) and line height cycling (`1.5`, `1.8`, `2.1`).
- **100% Local & Private**: All drafts auto-save to local storage with one-click `.spey` project packages, Markdown (`.md`), and JSON vault backups.
- **Sample Vault Safeguard**: Seamless exploration of tutorial vaults with non-destructive temporary preview mode and one-click instant rollback.

---

## 🚀 Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/Dathevinci/Lordspey.git
cd Lordspey

# 2. Run the local static server
node server.js
```
Open **`http://localhost:8095`** in your browser.

---

## 🧪 Testing

All automated tests are organized cleanly in the `tests/` directory:

```bash
# Run all 23 automated test suites (markdown, graph, timeline, map studio, universe atlas, etc.)
npm test
```

---

## 🖥️ Building Desktop App (`.exe`)

```bash
# Install dependencies
npm install

# Build standalone Windows installer & portable .exe
npm run build:exe
```
The compiled `.exe` files will be in the **`dist/`** directory.

---

## 🤖 Building Android App (`.apk`)

```bash
# Install dependencies
npm install

# Sync web assets to Capacitor Android project
npm run cap:sync

# Build Android debug APK
cd android && ./gradlew assembleDebug
```
The compiled `.apk` will be in **`android/app/build/outputs/apk/debug/app-debug.apk`**.

---

## 📱 Releases & Downloads

Pre-built binaries for **Windows (`.exe`)** and **Android (`.apk`)** are available on the **[Releases](https://github.com/Dathevinci/Lordspey/releases)** page:
- **[`Lord.Spey.Setup.1.2.0.exe`](https://github.com/Dathevinci/Lordspey/releases/download/v1.2.0/Lord.Spey.Setup.1.2.0.exe)**: Windows NSIS installer.
- **[`Lord.Spey.1.2.0.exe`](https://github.com/Dathevinci/Lordspey/releases/download/v1.2.0/Lord.Spey.1.2.0.exe)**: Standalone portable Windows executable.
- **[`Lord.Spey.apk`](https://github.com/Dathevinci/Lordspey/releases/download/v1.2.0/Lord.Spey.apk)**: Sideloadable Android package.

---

## 📜 License

MIT License. Crafted with minimal elegance for authors and storytellers.
