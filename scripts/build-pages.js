const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const docsDir = path.join(rootDir, 'docs');
const docsAppDir = path.join(docsDir, 'app');
const docsAssetsDir = path.join(docsDir, 'assets');

// 1. Ensure directories exist
fs.mkdirSync(docsDir, { recursive: true });
fs.mkdirSync(docsAppDir, { recursive: true });
fs.mkdirSync(docsAssetsDir, { recursive: true });

// 2. Synchronize full Lord Spey web application to docs/app
fs.copyFileSync(path.join(rootDir, 'index.html'), path.join(docsAppDir, 'index.html'));

// Copy CSS, JS, and Assets to docs/app
fs.cpSync(path.join(rootDir, 'css'), path.join(docsAppDir, 'css'), { recursive: true });
fs.cpSync(path.join(rootDir, 'js'), path.join(docsAppDir, 'js'), { recursive: true });
if (fs.existsSync(path.join(rootDir, 'assets'))) {
  fs.cpSync(path.join(rootDir, 'assets'), path.join(docsAppDir, 'assets'), { recursive: true });
}

// 3. Copy shared brand assets to docs/assets for the landing page
if (fs.existsSync(path.join(rootDir, 'assets'))) {
  fs.cpSync(path.join(rootDir, 'assets'), docsAssetsDir, { recursive: true });
}

console.log('✓ Successfully synchronized GitHub Pages website and web application in docs/');
