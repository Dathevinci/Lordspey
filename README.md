# ✦ Lord Spey — Author's Workspace

> A minimal, distraction-free workspace for authors. Draft prose, organize manuscript chapters, and interconnect living worldbuilding lore like Obsidian.

[![Website](https://img.shields.io/badge/website-dathevinci.github.io%2FLordspey-111116?style=for-the-badge&logo=github)](https://dathevinci.github.io/Lordspey/)
[![Launch Web App](https://img.shields.io/badge/launch-web%20app-ef4444?style=for-the-badge)](https://dathevinci.github.io/Lordspey/app/)
[![Release](https://img.shields.io/badge/release-v2.2.0-111116?style=for-the-badge)](https://github.com/Dathevinci/Lordspey/releases/tag/v2.2.0)
[![License](https://img.shields.io/badge/license-MIT-111116?style=for-the-badge)](LICENSE)

---

## 🌐 Official Website & Web App

- **Landing Page**: [dathevinci.github.io/Lordspey](https://dathevinci.github.io/Lordspey/)
- **Live Web App**: [dathevinci.github.io/Lordspey/app](https://dathevinci.github.io/Lordspey/app/)
- **GitHub Repository**: [github.com/Dathevinci/Lordspey](https://github.com/Dathevinci/Lordspey)

---

## ✨ Features

- **Native Rust & Tauri v2 Core Engine (`src-tauri/` & `window.RustBridge`)**: Pure Rust manuscript analytics (`compute_manuscript_metrics`), Flesch-Kincaid readability scoring, code-aware `[[Wiki-Link]]` and `# Heading` / `* * *` outline indexing, and validated `.spey` project bundle I/O with seamless Web/Electron fallback.
- **Obsidian-Style Interface, Activity Ribbon & Writing Pulse**: Authentic left activity ribbon providing 1-click access to Vault File Tree, Search, Galaxy Graph, Universe Starcharts, Timelines, Codex, and Settings, paired with a live Dashboard Writing Pulse telemetry strip (`#dashboard-writing-pulse`).
- **Workspace Document Tabs & Status Bar**: Clean tabbed workspace with active document title synchronization, quick close (`Esc`), and live status bar tracking word count, characters, reading time, and backlinks.
- **Obsidian-Style [[Wiki-Links]]**: Cross-reference characters, factions, and realms using `[[Note Title]]` or `[[Target|Custom Alias]]`. Click any link to jump directly or create the note instantly.
- **Universe Atlas, Floating HUD Docks & Semantic Jewel Pins**: Map entire universes across nested tiers (**Galaxies / Sectors**, **Star Systems**, **World Maps**, and **Station/Vessel Deckplans**) with frosted-glass floating filter and coordinate telemetry docks and 12 bespoke vector landmark icons (`MAP_PIN_GLYPHS`).
- **Interactive Map Studio**: Full creative freedom to craft custom maps. Set custom canvas dimensions (16:9, 4:3, 1:1, custom px), paint coastlines with fractal terrain brushes, draw glowing interstellar hyperlanes, manage drawing layers, undo/redo, place celestial lore pins, and export high-res PNGs isolated to the active realm.
- **3D Luminescent Galaxy Graph (`Ctrl+G`) & Codex Web**: Dynamic constellation starfield and character relationship web rendered with 3D sphere lighting, specular highlights, and atmospheric corona halos.
- **Bento Settings, Instant Filter Search & Ambient Themes**: Real-time settings search filter (`#settings-search-input`), interactive live typography preview card (`#settings-typography-preview`), and calm atmospheric backdrops (**Cosmic Starfield**, **Ethereal Nebula**, **Cozy Fireflies / Embers**, **Midnight Rain & Mist**).
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
# Run all 25 automated test suites (markdown, graph, timeline, map studio, universe atlas, obsidian ui, rust architecture, etc.)
npm test
```

---

## 🖥️ Building Desktop App (`.exe`)

### Option A — Native Rust & Tauri v2 (`src-tauri/`)

Lord Spey includes a native **Rust Core Engine** (`src-tauri/src/core.rs`) and **Tauri v2** desktop shell (`src-tauri/src/lib.rs`) for lightweight (~5 MB) native binaries, instant manuscript analytics, `[[Wiki-Link]]` graph indexing, and `.spey` project vault I/O:

```bash
# Run Rust unit tests for the manuscript & vault core engine
npm run rust:test

# Build native Rust desktop binary via Tauri v2
npm run tauri:build
```

### Option B — Electron Builder

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
- **[`Lord.Spey.Setup.2.2.0.exe`](https://github.com/Dathevinci/Lordspey/releases/download/v2.2.0/Lord.Spey.Setup.2.2.0.exe)**: Windows NSIS installer.
- **[`Lord.Spey.2.2.0.exe`](https://github.com/Dathevinci/Lordspey/releases/download/v2.2.0/Lord.Spey.2.2.0.exe)**: Standalone portable Windows executable.
- **[`Lord.Spey.apk`](https://github.com/Dathevinci/Lordspey/releases/download/v2.2.0/Lord.Spey.apk)**: Sideloadable Android package.

---

## 📜 License

MIT License. Crafted with minimal elegance for authors and storytellers.
