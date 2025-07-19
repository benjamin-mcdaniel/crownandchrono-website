const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Enable more verbose logging
const DEBUG = true;

// Directory paths
const contentDir = path.join(__dirname, '../content/blog');

// New categories to add
const categories = ['Trending', 'Classics', 'Deals'];

// Read all markdown files
const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.md'));
console.log(`Found ${files.length} markdown files`);

// Criteria for assigning categories
function assignCategories(frontmatter, filename) {
  const title = frontmatter.title || '';
  const tags = frontmatter.tags || [];
  const slug = filename.replace('.md', '');
  const newTags = [...tags];
  
  // Assign Trending to popular watch articles
  if (
    title.toLowerCase().includes('rolex') || 
    slug.includes('rolex') || 
    title.toLowerCase().includes('popular') ||
    title.toLowerCase().includes('worth') ||
    title.toLowerCase().includes('investment')
  ) {
    if (!newTags.includes('Trending')) {
      newTags.push('Trending');
    }
  }
  
  // Assign Classics to history and iconic articles
  if (
    title.toLowerCase().includes('history') ||
    title.toLowerCase().includes('iconic') ||
    title.toLowerCase().includes('heritage') || 
    title.toLowerCase().includes('classic') ||
    title.toLowerCase().includes('favorite') ||
    slug.includes('history')
  ) {
    if (!newTags.includes('Classics')) {
      newTags.push('Classics');
    }
  }
  
  // Assign Deals to articles that might discuss value or purchasing
  if (
    title.toLowerCase().includes('reasons to buy') ||
    title.toLowerCase().includes('review') ||
    title.toLowerCase().includes('guide') ||
    title.toLowerCase().includes('why') ||
    slug.includes('reasons')
  ) {
    if (!newTags.includes('Deals')) {
      newTags.push('Deals');
    }
  }
  
  return newTags;
}

// Process each file
let filesUpdated = 0;

files.forEach(file => {
  const filePath = path.join(contentDir, file);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  // Parse frontmatter
  const { data, content } = matter(fileContent);
  
  // Ensure tags is an array
  if (!data.tags) {
    data.tags = [];
  } else if (typeof data.tags === 'string') {
    data.tags = [data.tags];
  }
  
  // Assign categories based on content
  const newTags = assignCategories(data, file);
  
  // Debug logging
  if (DEBUG) {
    console.log(`Processing ${file}`);
    console.log(`Current tags: ${JSON.stringify(data.tags)}`);
    console.log(`New tags: ${JSON.stringify(newTags)}`);
  }
  
  // Compare tags more carefully
  let tagsChanged = false;
  
  // Check if any new tag is not in the original tags
  for (const tag of newTags) {
    if (!data.tags.includes(tag)) {
      tagsChanged = true;
      break;
    }
  }
  
  // Check if lengths are different (means we've added tags)
  if (newTags.length !== data.tags.length) {
    tagsChanged = true;
  }
  
  // If tags have changed, update the file
  if (tagsChanged) {
    data.tags = newTags;
    const newFileContent = matter.stringify(content, data);
    fs.writeFileSync(filePath, newFileContent);
    filesUpdated++;
    console.log(`Updated ${file} with tags: ${newTags.join(', ')}`);
  }
});

console.log(`Updated ${filesUpdated} files with new category tags`);
