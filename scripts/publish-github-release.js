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
  const tag = 'v1.1.2';
  const releaseName = 'Lord Spey v1.1.2 — New Note Button & Dropdown Action Fix';
  const releaseBody = `## Lord Spey v1.1.2 — New Note Button & Dropdown Action Fix

Minimal Obsidian-inspired author's workspace for drafts, lore, and worldbuilding.

### ✦ What's Fixed in v1.1.2
- **⚡ Resolved New Note Button & Dropdown Action Conflict**:
  - Fixed duplicate listener trigger where pressing the "+ New Note" button simultaneously opened both the "Create New Document" modal and the dropdown menu, resulting in the modal backdrop obscuring the dropdown menu beneath it.
  - Added dedicated dropdown toggle button (\`#btn-new-note-dropdown\`) forming a clean, unified split button (\`[ + New Note | ▾ ]\`) in the sidebar footer.
  - Clicking "+ New Note" now immediately opens the document creation modal without opening the dropdown menu.
  - Clicking the dropdown chevron (\`▾\`) toggles the document type menu (Chapter, Character Note, Worldbuilding, Draft) cleanly without opening the modal.
- **🛡️ Dropdown Occlusion, Dismissal & Keyboard Navigation**:
  - Implemented proper event isolation (\`e.stopPropagation()\`) preventing double triggers and event bubbling.
  - Added Escape key dismissal to immediately close the dropdown menu without impacting other views.
  - Added document click-outside dismissal and cleared active toggle button state.
  - Enhanced upward slide animation and alignment within the sidebar footer.

### 📦 Windows Downloads
- **Lord Spey Setup 1.1.2.exe**: Complete Windows installer (NSIS) with desktop shortcuts & auto-update support.
- **Lord Spey 1.1.2.exe**: Portable standalone executable (no installation required).
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
    { file: 'Lord Spey Setup 1.1.2.exe', label: 'Lord Spey Setup 1.1.2.exe', contentType: 'application/x-msdos-program' },
    { file: 'Lord Spey 1.1.2.exe', label: 'Lord Spey 1.1.2.exe', contentType: 'application/x-msdos-program' }
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
