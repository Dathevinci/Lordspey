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
  const tag = 'v1.1.1';
  const releaseName = 'Lord Spey v1.1.1 — Layout Resize & Tab Indentation Bug Fix';
  const releaseBody = `## Lord Spey v1.1.1 — Layout Resize & Tab Indentation Bug Fix

Minimal Obsidian-inspired author's workspace for drafts, lore, and worldbuilding.

### ✦ What's Fixed in v1.1.1
- **📐 Layout Overlap & Collision Fix on Window / Tab Resize**:
  - Resolved responsive flexbox compression where document header (`#editor-header`) and formatting toolbar overlapped with editor text and preview pane during viewport resizing, split view changes, or tablet/laptop dimension shifts.
  - Added `min-height: 42px`, `max-height: 42px`, `flex-wrap: nowrap`, and horizontal scrolling to `.format-bar` and `.editor-toolbar` so toolbars remain sleek and never vertically explode to 250px or crush the writing area.
  - Reset `.editor-scroll-container` flex basis to `0%` (`flex: 1 1 0%`) to ensure unconstrained, single-scroll vertical flow.
  - Upgraded split view to dynamic height scaling (`flex: 1 1 auto; height: 100%`) eliminating hardcoded viewport offset collisions.
  - Enhanced Focus Mode toolbar hover detection to calculate dynamic bounds across all window sizes.
- **⌨️ Customizable Editor Tab Indentation & 1-Click Toolbar Control**:
  - Added instant Tab Indentation cycle button (`Tab: 2 / 4 / 8`) directly on the formatting toolbar alongside line spacing.
  - Added configurable Tab Size setting in **Settings → Editor & Writing Preferences** with 2-space, 4-space, and 8-space presets with immediate persistence.
  - Integrated dynamic CSS variable (`--editor-tab-size`) syncing live to the drafting canvas.
  - Upgraded Tab key handling in the editor: supports single indentation with native undo (`Ctrl+Z`), multiline block indentation, and Shift+Tab unindentation.
- **🛡️ DOM Selector Compatibility & Class Aliasing**:
  - Full support for selector aliases (`#editor-header`, `#editor-toolbar-wrap`, `#editor-title`, `#editor-body`, `#preview-pane`, `.split-view`, `.focus-mode`).

### 📦 Windows Downloads
- **Lord Spey Setup 1.1.1.exe**: Complete Windows installer (NSIS) with desktop shortcuts & auto-update support.
- **Lord Spey 1.1.1.exe**: Portable standalone executable (no installation required).
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
    { file: 'Lord Spey Setup 1.1.1.exe', label: 'Lord Spey Setup 1.1.1.exe', contentType: 'application/x-msdos-program' },
    { file: 'Lord Spey 1.1.1.exe', label: 'Lord Spey 1.1.1.exe', contentType: 'application/x-msdos-program' }
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
