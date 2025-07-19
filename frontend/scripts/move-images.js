const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const https = require('https');
const http = require('http');

// Directory paths
const contentDir = path.join(__dirname, '../content/blog');
const imageDir = path.join(__dirname, '../src/images/watches');

// Create images directory if it doesn't exist
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
  console.log(`Created directory: ${imageDir}`);
}

// Function to download an image
function downloadImage(url, imageName) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadImage(response.headers.location, imageName)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }
      
      const imagePath = path.join(imageDir, imageName);
      const fileStream = fs.createWriteStream(imagePath);
      
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded: ${imageName} to ${imagePath}`);
        resolve(imageName);
      });
      
      fileStream.on('error', (err) => {
        fs.unlink(imagePath, () => {}); // Delete the file if there's an error
        reject(err);
      });
      
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Function to extract filename from URL
function extractFilename(url) {
  // Try to extract just the filename from the last segment of the URL
  const segments = url.split('/');
  let filename = segments[segments.length - 1];
  
  // Remove query parameters if any
  if (filename.includes('?')) {
    filename = filename.split('?')[0];
  }
  
  return filename;
}

// Function to process a markdown file
async function processFile(file) {
  const filePath = path.join(contentDir, file);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  // Parse frontmatter
  const { data, content } = matter(fileContent);
  
  if (!data.image) {
    console.log(`No image found in: ${file}`);
    return { file, status: 'no_image' };
  }
  
  console.log(`\nProcessing file: ${file}`);
  console.log(`Original image URL: ${data.image}`);
  
  try {
    const imageUrl = data.image.trim();
    
    // Check if the image URL is already using our local path
    if (imageUrl.startsWith('/images/watches/')) {
      console.log(`Image already migrated: ${imageUrl}`);
      return { file, status: 'skipped', reason: 'already_migrated', path: imageUrl };
    }
    
    // Validate URL
    if (!imageUrl.startsWith('http')) {
      console.log(`Invalid URL format: ${imageUrl} - Skipping`);
      return { file, status: 'skipped', reason: 'invalid_url', url: imageUrl };
    }
    
    const imageName = extractFilename(imageUrl);
    
    // Download the image
    await downloadImage(imageUrl, imageName);
    
    // Update the image path in the frontmatter
    const newPath = `/images/watches/${imageName}`;
    data.image = newPath;
    
    // Write the updated file
    const newFileContent = matter.stringify(content, data);
    fs.writeFileSync(filePath, newFileContent);
    
    console.log(`Updated: ${file} with new image path: ${data.image}`);
    return { file, status: 'updated', oldUrl: imageUrl, newPath };
  } catch (error) {
    console.error(`Error processing ${file}: ${error.message}`);
    return { file, status: 'error', error: error.message };
  }
}

// Get all markdown files
const files = fs.readdirSync(contentDir)
  .filter(file => file.endsWith('.md'));

console.log(`Found ${files.length} markdown files`);

// Process all files
async function processAllFiles() {
  let processed = 0;
  let skipped = 0;
  let errors = 0;
  let results = [];
  
  for (const file of files) {
    try {
      const result = await processFile(file);
      if (result) {
        results.push(result);
        if (result.status === 'updated') processed++;
        else if (result.status === 'skipped') skipped++;
      }
    } catch (err) {
      errors++;
      results.push({ file, status: 'error', message: err.message });
    }
  }
  
  // Write summary to file
  const summary = {
    total: files.length,
    processed,
    skipped,
    errors,
    results
  };
  
  fs.writeFileSync(
    path.join(__dirname, 'image-migration-summary.json'), 
    JSON.stringify(summary, null, 2)
  );
  
  console.log(`\nImage migration completed:\n- Total files: ${files.length}\n- Processed: ${processed}\n- Skipped: ${skipped}\n- Errors: ${errors}`);
  console.log(`\nDetailed summary written to: scripts/image-migration-summary.json`);
}

processAllFiles();
