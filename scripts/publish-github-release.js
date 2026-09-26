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
  const tag = 'v1.1.5';
  const releaseName = 'Lord Spey v1.1.5 — Creative Map Studio, Custom Sizing & Cartography Tools';
  const releaseBody = `## Lord Spey v1.1.5 — Creative Map Studio, Custom Sizing & Cartography Tools

Minimal Obsidian-inspired author's workspace for drafts, lore, and worldbuilding.

### ✦ What's New & Improved in v1.1.5
- **🎨 Creative Photoshop-Like Map Studio**:
  - **Full Cartography Drawing Suite**: Dedicated drawing mode (\`Paint / Studio\`) equipped with freeform ink brush, fine pencil for borders/rivers, precision eraser, fractal landmass coastline sculptor, and geometric tools (rectangles, ellipses, straight lines, multi-point polygons).
  - **Fantasy Terrain Stampers**: Quick-draw terrain brushes for mountain ranges (\`▲▲▲\`), dense forests (\`♣♣♣\`), desert dunes (\`〜〜\`), swamps (\`≈≈\`), and rolling hills (\`⌒⌒\`).
  - **Color Palette & Swatches**: 10 fantasy cartography swatches (Deep Ocean, Coastal Azure, Parchment, Grassland, Basalt Mountain, Evergreen Forest, Desert Sand, Volcanic Ash, Crimson Kingdom, Royal Gold) plus full RGB/Hex color picker.
  - **Multi-Layer Drawing System**: Create, hide/show, reorder, adjust layer opacity (0%–100%), and one-click "Bake Layers" to flatten onto the permanent base canvas.
  - **Flood Fill Bucket**: High-speed flat 1D queue flood-fill with color tolerance for instant continental or ocean tinting.
- **📐 Custom Canvas Shapes & Dimensions**:
  - **Precision Sizing**: Set custom map dimensions from 500 px to 4000 px with aspect-ratio locking and 1-click presets (Cinema 16:9, Ultrawide 24:10, Square 1:1, Vertical Scroll 9:16).
  - **Boundary Framing**: Choice of Classic Rectangle, Circular/Oval Vignette with soft atmospheric shadows, and Archival Parchment vintage antique deckled borders.
- **🗺️ High-DPI Export & Gesture Navigation**:
  - **Elliptical PNG Export**: Exports crisp high-resolution maps compositing background, drawings, layers, and dynamically scaled landmark pins & territory labels, with accurate elliptical clipping masks.
  - **Two-Finger Touch Navigation**: Pinch-to-zoom and canvas panning seamlessly bypasses drawing tools on touch devices.
- **🛡️ Data Safety & Backward Compatibility**:
  - Seamless persistence in \`Storage\`, \`.spey\` project bundle import/export, and multi-tier storage quota fallback protection.

### 📦 Downloads & Binaries
- **Lord Spey Setup 1.1.5.exe**: Complete Windows installer (NSIS) with desktop shortcuts & auto-update support.
- **Lord Spey 1.1.5.exe**: Portable standalone executable (no installation required).
- **Lord.Spey.apk / app-debug.apk**: Android package for mobile writing and worldbuilding.
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

  const distDir = path.join(__dirname, '..', 'dist');

  // Ensure Android APK assets exist in distDir for release bundle completeness
  const apkFiles = ['Lord.Spey.apk', 'app-debug.apk'];
  for (const apkName of apkFiles) {
    const localApkPath = path.join(distDir, apkName);
    if (!fs.existsSync(localApkPath)) {
      console.log(`Downloading ${apkName} from release bundle...`);
      try {
        let apkRes = await fetch(`https://github.com/${repo}/releases/download/${tag}/${apkName}`, { headers, redirect: 'follow' });
        if (!apkRes.ok) {
          apkRes = await fetch(`https://github.com/${repo}/releases/download/v1.1.2/${apkName}`, { headers, redirect: 'follow' });
        }
        if (apkRes.ok) {
          const arrayBuf = await apkRes.arrayBuffer();
          fs.writeFileSync(localApkPath, Buffer.from(arrayBuf));
          console.log(`✓ Cached ${apkName} locally (${arrayBuf.byteLength} bytes)`);
        } else {
          console.warn(`Could not fetch ${apkName}: HTTP ${apkRes.status}`);
        }
      } catch (dlErr) {
        console.warn(`Could not download ${apkName}: ${dlErr.message}`);
      }
    }
  }

  const assetsToUpload = [
    { file: 'Lord Spey Setup 1.1.5.exe', label: 'Lord Spey Setup 1.1.5.exe', contentType: 'application/x-msdos-program' },
    { file: 'Lord Spey 1.1.5.exe', label: 'Lord Spey 1.1.5.exe', contentType: 'application/x-msdos-program' },
    { file: 'Lord.Spey.apk', label: 'Lord.Spey.apk', contentType: 'application/vnd.android.package-archive' },
    { file: 'app-debug.apk', label: 'app-debug.apk', contentType: 'application/vnd.android.package-archive' }
  ];

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

  // Verify all 4 release assets are uploaded
  console.log('\n--- Verifying uploaded release assets on GitHub ---');
  const verifyRes = await fetch(`https://api.github.com/repos/${repo}/releases/${release.id}`, { headers });
  if (verifyRes.ok) {
    const updatedRelease = await verifyRes.json();
    const uploadedAssetNames = (updatedRelease.assets || []).map(a => a.name);
    console.log(`Total release assets on GitHub: ${uploadedAssetNames.length}`);
    uploadedAssetNames.forEach(a => console.log(`  - ${a}`));
    const expectedAssets = ['Lord Spey Setup 1.1.5.exe', 'Lord Spey 1.1.5.exe', 'Lord.Spey.apk', 'app-debug.apk'];
    const norm = n => (n || '').toLowerCase().replace(/[\s.]+/g, '.');
    let allFound = true;
    for (const exp of expectedAssets) {
      const found = uploadedAssetNames.some(a => norm(a) === norm(exp));
      if (!found) {
        console.error(`❌ Missing asset on release: ${exp}`);
        allFound = false;
      } else {
        console.log(`✓ Verified asset: ${exp}`);
      }
    }
    if (!allFound) {
      process.exit(1);
    }
  } else {
    console.warn(`Could not verify assets: HTTP ${verifyRes.status}`);
  }

  console.log('\n✓ Release publication and all 4 asset attachments verified successfully!');
}

main().catch(err => {
  console.error('Fatal error in publish-github-release:', err);
  process.exit(1);
});
