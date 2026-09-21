# ✦ Lord Spey — Author's Workspace

> A minimal, distraction-free workspace for authors. Draft prose, organize manuscript chapters, and interconnect living worldbuilding lore like Obsidian.

![Lord Spey Theme](https://img.shields.io/badge/theme-crimson%20%26%20black-ef4444?style=for-the-badge)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Web%20%7C%20Android-08080a?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-red?style=for-the-badge)

---

## ✨ Features

- **Obsidian-Style [[Wiki-Links]]**: Cross-reference characters, factions, and realms using `[[Note Title]]` or `[[Target|Custom Alias]]`. Click any link to jump directly or create the note instantly.
- **Living Galaxy Graph (`Ctrl+G`)**: Dynamic, interactive constellation starfield mapping your entire story universe. Visualizes category hubs (**Chapters**, **Lore**, **World Building**, **Drafts**), orbital sub-branches, and photon pulse connections.
- **Live Side-by-Side Split View (`Ctrl+\`)**: Write in Markdown on the left, watch beautifully formatted typography render live on the right.
- **Document & Scene Outline (`Alt+O`)**: Automatic table of contents generated from `# Headings` and narrative `* * *` scene breaks. Click any heading to jump directly to it.
- **Daily Word Goals & Writing Sprints**: Interactive progress meter tracking session targets (e.g. 500w) with a focused 20-minute sprint countdown timer.
- **In-Editor Find & Replace (`Ctrl+F` / `Ctrl+H`)**: Floating search bar with match counts, navigation, and safe replacement.
- **Manuscript Analytics**: Real-time stats on word counts, character counts, average sentence length, silent reading time, speaking time, and Flesch-Kincaid readability level.
- **Author Typography Controls**: Quick toggle between **Lora (Book Serif)**, **Inter (Clean Sans)**, **JetBrains Mono (Typewriter)**, and **Playfair Display**, with font sizing (`A-` / `A+`) and line height cycling (`1.5`, `1.8`, `2.1`).
- **100% Local & Private**: All drafts auto-save to local browser storage with one-click Markdown (`.md`) and JSON vault backups.

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

Pre-built binaries for **Windows (`.exe`)** and **Android (`.apk`)** can be downloaded directly from the **[Releases](https://github.com/Dathevinci/Lordspey/releases)** page:
- **`Lord.Spey.apk` / `app-debug.apk`**: Sideloadable Android package.
- **`Lord.Spey.Setup.1.0.0.exe`**: Windows NSIS installer.
- **`Lord.Spey.1.0.0.exe`**: Standalone portable Windows executable.

---

## 📜 License

MIT License. Crafted with minimal elegance for authors and storytellers.
