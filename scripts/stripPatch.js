const fs = require('fs');
const path = require('path');

const packagePath = path.resolve(__dirname, '../package.json');
const indexHtmlPath = path.resolve(__dirname, '../public/index.html');

function incrementVersion() {
  // Read package.json
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

  // Get the current version (e.g., "1.2.3")
  const version = packageJson.version.split('.');

  // Increment the minor version and reset patch
  version[1] = parseInt(version[1], 10) + 1; // Increment minor
  // version[2] = 0; // Reset patch

  const newVersion = version.join('.');

  // Update package.json version
  packageJson.version = newVersion;
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2), 'utf8');

  // Update index.html with the new version
  const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
  const updatedHtmlContent = indexHtmlContent.replace(
    /<meta name="version" content=".*?" \/>/,
    `<meta name="version" content="${newVersion}" />`
  );
  fs.writeFileSync(indexHtmlPath, updatedHtmlContent, 'utf8');
}

// Execute the function to update the version
incrementVersion();
