const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const wwwDir = path.join(rootDir, 'www');

if (fs.existsSync(wwwDir)) {
  fs.rmSync(wwwDir, { recursive: true, force: true });
}
fs.mkdirSync(wwwDir, { recursive: true });

fs.copyFileSync(path.join(rootDir, 'index.html'), path.join(wwwDir, 'index.html'));
fs.cpSync(path.join(rootDir, 'css'), path.join(wwwDir, 'css'), { recursive: true });
fs.cpSync(path.join(rootDir, 'js'), path.join(wwwDir, 'js'), { recursive: true });
if (fs.existsSync(path.join(rootDir, 'assets'))) {
  fs.cpSync(path.join(rootDir, 'assets'), path.join(wwwDir, 'assets'), { recursive: true });
}

console.log('✓ Successfully prepared www directory for mobile web assets.');
