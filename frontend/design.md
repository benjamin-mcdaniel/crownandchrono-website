# Crown and Chrono Website Design Documentation

## Overview

This document outlines the architectural design and technical choices made for the Crown and Chrono website rebuild. The website has been migrated from Publii CMS to Decap CMS while maintaining all URL structures and implementing a modern, minimalist design suitable for a luxury watch blog.

## Technology Stack

### Frontend Framework
- **Next.js**: Used for its ability to generate static sites with dynamic routing capabilities. This allows for better SEO, faster page loads, and maintainability.

### Content Management
- **Decap CMS**: A Git-based headless CMS that stores content in Markdown format, allowing for version control of content alongside code.

### Styling
- **CSS Modules & Global CSS**: Used for component-specific and global styling respectively, providing a clean and maintainable styling approach.

### Hosting
- **Cloudflare Pages**: Provides fast global CDN distribution and easy deployment.

## Architecture Design

### URL Structure
The website maintains the original URL structure from the Publii site:
- Blog posts: `https://crownandchrono.com/post-slug`
- Tag pages: `https://crownandchrono.com/tags/tag-name`

### Content Organization
- **Content Directory**: All blog posts are stored as Markdown files in the `/content/blog` directory.
- **Media**: Images and other media files are stored in the `/public/media` directory.

### Component Structure
1. **Layout Component**: Provides the common header, footer, and navigation structure.
2. **Dynamic Routes**:
   - Root level catch-all route for blog posts: `/[slug]`
   - Tag pages route: `/tags/[tag]`

### Data Flow
1. Content is managed through Decap CMS and stored as Markdown files.
2. Next.js uses static site generation to pre-render all pages at build time.
3. Blog post content is parsed using the gray-matter library to extract frontmatter metadata.
4. React-markdown is used to render Markdown content as HTML.

## Performance Considerations

### Static Site Generation
- The entire site is pre-rendered at build time, resulting in fast page loads and improved SEO.
- No server-side rendering is needed, making it suitable for Cloudflare Pages hosting.

### Image Optimization
- Images are stored with responsive variants to optimize loading times.
- The site uses standard img tags for compatibility with Cloudflare Pages.

### CSS Optimization
- CSS is optimized for minimal file size while maintaining a clean visual design.
- Modern CSS features are used where appropriate for better performance.

## Content Management Workflow

1. **Authentication**: Decap CMS uses Netlify Identity for authentication.
2. **Content Editing**: Editors can log in to `/admin` to manage content.
3. **Publishing**: When content is published, it's committed to the Git repository.
4. **Deployment**: Changes trigger a rebuild and deployment of the static site.

## Responsive Design

The website features a fully responsive design that works well on:
- Desktop devices
- Tablets
- Mobile phones

The responsive approach uses:
- Fluid typography
- Flexible grid layouts
- Media queries for breakpoint adjustments

## SEO Strategy

- Semantic HTML structure for better accessibility and SEO
- Proper meta tags for social sharing and search engines
- Structured data for rich snippets in search results
- Preserved URL structure to maintain existing SEO value

## Future Enhancements

- Implement search functionality
- Add pagination for the blog listing page
- Integrate with analytics tools
- Add newsletter subscription capabilities

## Conclusion

This rebuild preserves the functionality and URL structure of the original Crown and Chrono website while modernizing the technology stack and design. The use of Next.js with Decap CMS creates a fast, maintainable, and developer-friendly codebase that can be easily extended in the future.
