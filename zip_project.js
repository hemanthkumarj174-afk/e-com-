const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sourceDir = 'e:\\ecom';
const destDir = path.join(sourceDir, 'dist_zip');
const zipFile = path.join(sourceDir, 'ecom_project.zip');

// Remove existing zip and temp dir
if (fs.existsSync(zipFile)) {
  fs.unlinkSync(zipFile);
}
if (fs.existsSync(destDir)) {
  fs.rmSync(destDir, { recursive: true, force: true });
}

fs.mkdirSync(destDir);

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  if (!exists) return;
  
  const stats = fs.statSync(src);
  const isDirectory = stats.isDirectory();
  const base = path.basename(src);
  
  // Exclude node_modules, build outputs, local sqlite DB, etc.
  if (
    base === 'node_modules' || 
    base === '.git' || 
    base === 'dist_zip' || 
    base === 'dist' || 
    base === 'database.sqlite' ||
    base === 'ecom_project.zip' ||
    base === 'zip_project.js'
  ) {
    return;
  }

  if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Copy everything
fs.readdirSync(sourceDir).forEach((item) => {
  copyRecursiveSync(path.join(sourceDir, item), path.join(destDir, item));
});

console.log('Staging area created successfully.');

// Compress it using PowerShell
try {
  console.log('Compressing to ZIP...');
  execSync(`powershell -Command "Compress-Archive -Path '${destDir}\\*' -DestinationPath '${zipFile}' -Force"`);
  console.log('ZIP created successfully!');
} catch (err) {
  console.error('Error during compression:', err);
} finally {
  // Clean up
  fs.rmSync(destDir, { recursive: true, force: true });
  console.log('Cleaned up staging folder.');
}
