import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const contentDirectory = path.join(process.cwd(), 'content/blog');

// Get all blog post slugs
export function getAllBlogSlugs() {
  try {
    const fileNames = fs.readdirSync(contentDirectory);
    return fileNames.map(fileName => {
      return {
        params: {
          slug: fileName.replace(/\.md$/, '')
        }
      };
    });
  } catch (error) {
    console.error('Error getting blog slugs:', error);
    return [];
  }
}

// Get blog post content by slug
export async function processMarkdown(content) {
  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(content);
  const contentHtml = processedContent.toString();
  return contentHtml;
}

export function getBlogPostBySlug(slug) {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug,
      frontmatter: {
        ...data,
        date: data.date.toString()
      },
      content
    };
  } catch (error) {
    console.error(`Error getting blog post ${slug}:`, error);
    return null;
  }
}

// Get all blog posts with frontmatter
export function getAllBlogPosts() {
  try {
    const fileNames = fs.readdirSync(contentDirectory);
    const allBlogData = fileNames.map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(contentDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      // Process markdown for excerpt
      const processedContent = content.replace(/\[.*?\]\(.*?\)/g, ''); // Remove markdown links for cleaner excerpts
      const plainText = processedContent
        .replace(/#{1,6}\s/g, '') // Remove headings
        .replace(/\*\*/g, '') // Remove bold
        .replace(/\*/g, '') // Remove italic
        .replace(/\n/g, ' '); // Replace newlines with spaces
      
      return {
        slug,
        frontmatter: {
          ...data,
          date: data.date.toString()
        },
        excerpt: plainText.slice(0, 200) + '...'
      };
    });
    
    // Sort posts by date
    return allBlogData.sort((a, b) => {
      if (new Date(a.frontmatter.date) < new Date(b.frontmatter.date)) {
        return 1;
      } else {
        return -1;
      }
    });
  } catch (error) {
    console.error('Error getting all blog posts:', error);
    return [];
  }
}

// Get blog posts filtered by tag
export function getBlogPostsByTag(tag) {
  const allPosts = getAllBlogPosts();
  const tagLower = tag.toLowerCase();
  return allPosts.filter(post => 
    post.frontmatter.tags && 
    post.frontmatter.tags.some(postTag => 
      postTag.toLowerCase() === tagLower
    )
  );
}
