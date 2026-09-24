const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Retrieve GitHub token from git credentials
function getGitHubToken() {
  try {
    const creds = execSync('git credential fill', {
      input: 'protocol=https\nhost=github.com\n',
      encoding: 'utf8'
    });
    const match = creds.match(/password=(.*)/);
    return match ? match[1].trim() : null;
  } catch (err) {
    console.warn('Could not extract git credential token:', err.message);
    return null;
  }
}

async function main() {
  const token = getGitHubToken();
  if (!token) {
    console.error('GitHub token not found.');
    process.exit(1);
  }

  const repo = 'Dathevinci/Lordspey';
  const tag = 'v1.1.0';
  const releaseName = 'Lord Spey v1.1.0 — Raven Brand & Feature Expansion';
  const releaseBody = `## Lord Spey v1.1.0 — Raven Brand & Feature Expansion

Minimal Obsidian-inspired author's workspace for drafts, lore, and worldbuilding.

### ✦ What's New in v1.1.0
- **🦅 Official Raven Brand Logo**:
  - Celestial raven emblem with butterfly silhouette accents in top navigation, header, and dashboard watermark.
  - Native multi-resolution Windows icon (\`.ico\`) configured for installers, taskbar, and desktop launcher shortcuts.
- **🎨 App Themes & Custom Accent Picker**:
  - Velvet Dark, Ivory Light, and Parchment Sepia authorial reading themes.
  - Custom Accent Color Picker with live CSS variable updates and accessible border contrast.
- **✍️ Writing Focus Mode**:
  - Auto-hiding formatting toolbar while typing for zero-clutter composition.
  - Smooth fade-in on mouse hover or pause.
- **🗺️ World Map Shapes & Region Drawing**:
  - 16:9 Landscape, 1:1 Square, 9:16 Realm, and Oval cartographic canvas aspect ratios.
  - Interactive territory polygon drawing with fill colors, opacity controls, and linked lore markers.
- **📁 Multi-Section Folders & Note Dropdown**:
  - Multi-act and multi-volume chapter folder hierarchies.
  - Dedicated \`+ New Note\` dropdown for Chapters, Lore, Characters, and Codex documents.
- **🌌 Expanded Galaxy Graph**:
  - 0-collision force simulation physics with spacious distribution and legible typography.
  - Manual entity creation for Themes, Plot Arcs, and Factions with custom directional relationship links.
- **👤 Character Codex Portraits**:
  - Direct portrait image upload and drag-and-drop for concept art & avatars.
  - Aspect-ratio preserved dossier cards with zoom previews.
- **📦 Standalone Modules**:
  - In-module inspection and editing for Characters, Maps, and Timelines without forced note redirects.
- **🔄 In-App Auto-Updater**:
  - Automated background release detector connected to GitHub Releases API.
  - "What's New in v1.1.0" changelog viewer and update notification preview tester in Settings.
  - Automated safety snapshot backup before updates guaranteeing 100% preservation of drafts, lore, and maps.

### 📦 Windows Downloads
- **Lord Spey Setup 1.1.0.exe**: Complete Windows installer (NSIS) with desktop shortcuts & auto-update support.
- **Lord Spey 1.1.0.exe**: Portable standalone executable (no installation required).
`;

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Lord-Spey-Release-Tool'
  };

  // Check if release already exists
  let release = null;
  try {
    const getRes = await fetch(`https://api.github.com/repos/${repo}/releases/tags/${tag}`, { headers });
    if (getRes.ok) {
      release = await getRes.json();
      console.log(`Found existing release id: ${release.id}`);
    }
  } catch (e) {
    console.log('Release does not exist yet:', e.message);
  }

  if (release) {
    console.log(`Updating existing release ${release.id}...`);
    try {
      const updateRes = await fetch(`https://api.github.com/repos/${repo}/releases/${release.id}`, {
        method: 'PATCH',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: releaseName,
          body: releaseBody
        })
      });
      if (updateRes.ok) {
        release = await updateRes.json();
        console.log(`✓ Updated release notes on ${release.name}`);
      } else {
        console.warn(`Could not update release notes: ${updateRes.status}`);
      }
    } catch (patchErr) {
      console.warn('Failed to patch release:', patchErr.message);
    }
  } else {
    console.log(`Creating new release for ${tag}...`);
    const createRes = await fetch(`https://api.github.com/repos/${repo}/releases`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tag_name: tag,
        name: releaseName,
        body: releaseBody,
        draft: false,
        prerelease: false
      })
    });
    if (!createRes.ok) {
      const errText = await createRes.text();
      console.error(`Failed to create release: ${createRes.status} ${errText}`);
      process.exit(1);
    }
    release = await createRes.json();
    console.log(`Created release ${release.name} (id: ${release.id})`);
  }

  const uploadUrlTemplate = release.upload_url; // e.g. https://uploads.github.com/repos/Dathevinci/Lordspey/releases/123/assets{?name,label}
  const cleanUploadUrl = uploadUrlTemplate.replace(/\{.*?\}$/, '');

  const assetsToUpload = [
    { file: 'Lord Spey Setup 1.1.0.exe', label: 'Lord Spey Setup 1.1.0.exe', contentType: 'application/x-msdos-program' },
    { file: 'Lord Spey 1.1.0.exe', label: 'Lord Spey 1.1.0.exe', contentType: 'application/x-msdos-program' }
  ];

  const distDir = path.join(__dirname, '..', 'dist');

  for (const asset of assetsToUpload) {
    const filePath = path.join(distDir, asset.file);
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      continue;
    }

    // Check if asset already exists in release (normalized to handle dot vs space naming)
    const norm = n => (n || '').toLowerCase().replace(/[\s.]+/g, '.');
    const existingAsset = (release.assets || []).find(a => norm(a.name) === norm(asset.file));
    if (existingAsset) {
      console.log(`Asset ${asset.file} already exists (id: ${existingAsset.id}), deleting old asset to replace...`);
      await fetch(`https://api.github.com/repos/${repo}/releases/assets/${existingAsset.id}`, {
        method: 'DELETE',
        headers
      });
      console.log(`Deleted old asset ${existingAsset.id}`);
    }

    console.log(`Uploading ${asset.file} (${fs.statSync(filePath).size} bytes)...`);
    const fileBuffer = fs.readFileSync(filePath);

    const uploadRes = await fetch(`${cleanUploadUrl}?name=${encodeURIComponent(asset.file)}&label=${encodeURIComponent(asset.label)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': asset.contentType,
        'Content-Length': fileBuffer.length,
        'User-Agent': 'Lord-Spey-Release-Tool'
      },
      body: fileBuffer
    });

    if (uploadRes.ok) {
      const uploaded = await uploadRes.json();
      console.log(`✓ Successfully uploaded ${asset.file} (id: ${uploaded.id})`);
    } else {
      const errText = await uploadRes.text();
      console.error(`Failed to upload ${asset.file}: ${uploadRes.status} ${errText}`);
    }
  }

  console.log('✓ Release publication and asset attachments finished successfully!');
}

main().catch(err => {
  console.error('Fatal error in publish-github-release:', err);
  process.exit(1);
});
