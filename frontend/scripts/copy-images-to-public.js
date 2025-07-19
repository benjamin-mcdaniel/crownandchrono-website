const fs = require('fs');
const path = require('path');

// Directory paths
const sourceDir = path.join(__dirname, '../src/images/watches');
const targetDir = path.join(__dirname, '../public/images/watches');

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`Created directory: ${targetDir}`);
}

// Get all files from source directory
try {
  const files = fs.readdirSync(sourceDir);
  console.log(`Found ${files.length} images to copy`);

  // Copy each file to the target directory
  let copyCount = 0;
  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);

    // Skip if not a file
    if (!fs.lstatSync(sourcePath).isFile()) {
      continue;
    }

    // Copy the file
    fs.copyFileSync(sourcePath, targetPath);
    copyCount++;
    console.log(`Copied: ${file}`);
  }

  console.log(`Successfully copied ${copyCount} images to public directory`);
} catch (error) {
  console.error(`Error copying images: ${error.message}`);
}
