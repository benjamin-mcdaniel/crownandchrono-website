const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directory paths
const rootDir = path.join(__dirname, '../../');
const outputDir = path.join(__dirname, '../content/blog');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Find all HTML files in root directory with hyphen in name
const htmlFiles = fs.readdirSync(rootDir)
  .filter(file => file.includes('-') && file.endsWith('.html') && file !== '404.html');

console.log(`Found ${htmlFiles.length} articles to convert`);

// Process each HTML file
htmlFiles.forEach(htmlFile => {
  try {
    const filePath = path.join(rootDir, htmlFile);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract article title
    let title = '';
    const titleMatch = content.match(/<title>(.*?)<\/title>/);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].replace(' - crownandchrono.com', '').trim();
    }
    
    // Extract publish date
    let publishDate = '';
    const dateMatch = content.match(/datePublished":"([^"]+)/);
    if (dateMatch && dateMatch[1]) {
      publishDate = dateMatch[1];
    }
    
    // Extract main image URL
    let imageUrl = '';
    const imageMatch = content.match(/property="og:image" content="([^"]+)"/);
    if (imageMatch && imageMatch[1]) {
      imageUrl = imageMatch[1];
    }
    
    // Extract tags
    let tags = [];
    const tagMatches = content.match(/<a href="https:\/\/crownandchrono\.com\/tags\/([^\/]+)\/" class="metadata__maintag">([^<]+)<\/a>/g);
    if (tagMatches) {
      tagMatches.forEach(match => {
        const tagName = match.match(/>([^<]+)</)[1];
        if (tagName && !tags.includes(tagName)) {
          tags.push(tagName);
        }
      });
    }
    
    // Extract main content
    let mainContent = '';
    const contentMatch = content.match(/<div class="post__entry">(.*?)<\/div><aside/s);
    if (contentMatch && contentMatch[1]) {
      mainContent = contentMatch[1].trim();
      
      // Convert HTML to Markdown-friendly format
      mainContent = mainContent
        // Remove image elements
        .replace(/<figure class="post__featured-image[^>]*>.*?<\/figure>/gs, '')
        // Convert headers
        .replace(/<h1[^>]*>(.*?)<\/h1>/gs, '# $1\n\n')
        .replace(/<h2[^>]*>(.*?)<\/h2>/gs, '## $1\n\n')
        .replace(/<h3[^>]*>(.*?)<\/h3>/gs, '### $1\n\n')
        .replace(/<h4[^>]*>(.*?)<\/h4>/gs, '#### $1\n\n')
        // Convert paragraphs
        .replace(/<p[^>]*>(.*?)<\/p>/gs, '$1\n\n')
        // Convert basic formatting
        .replace(/<strong>(.*?)<\/strong>/gs, '**$1**')
        .replace(/<em>(.*?)<\/em>/gs, '*$1*')
        .replace(/<a href="([^"]+)"[^>]*>(.*?)<\/a>/gs, '[$2]($1)')
        // Remove remaining HTML tags
        .replace(/<[^>]+>/g, '')
        // Fix any extra newlines
        .replace(/\n\s*\n\s*\n/g, '\n\n')
        .trim();
    }
    
    // Generate slug from filename
    const slug = htmlFile.replace('.html', '');
    
    // Create frontmatter
    const frontmatter = `---
title: "${title}"
date: "${publishDate}"
slug: "${slug}"
image: "${imageUrl}"
tags: [${tags.map(tag => `"${tag}"`).join(', ')}]
---

`;

    // Create markdown content
    const markdownContent = frontmatter + mainContent;
    
    // Write to markdown file
    const outputPath = path.join(outputDir, `${slug}.md`);
    fs.writeFileSync(outputPath, markdownContent);
    
    console.log(`Converted: ${htmlFile} -> ${slug}.md`);
  } catch (error) {
    console.error(`Error processing ${htmlFile}:`, error);
  }
});

console.log('Conversion complete!');
