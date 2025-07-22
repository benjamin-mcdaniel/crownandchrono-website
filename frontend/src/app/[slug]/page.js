import { getBlogPostBySlug, getAllBlogSlugs, getBlogPostsByTag } from '@/utils/blog';
import { getEditorForArticle } from '@/utils/editors';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import styles from '../page.module.css';
import EditorBio from '../components/EditorBio';

// Generate static paths for all blog posts
export function generateStaticParams() {
  const allSlugs = getAllBlogSlugs();
  return allSlugs.map(({ params }) => params);
}

// Generate metadata for each blog post
export async function generateMetadata({ params }) {
  // Properly await the params object before destructuring
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;
  const post = getBlogPostBySlug(slug);
  
  if (!post) return { title: 'Post Not Found | Crown and Chrono' };
  
  // Determine featured image URL
  const imageUrl = post.frontmatter.image ? 
    `https://crownandchrono.com${post.frontmatter.image.startsWith('/') ? post.frontmatter.image : `/${post.frontmatter.image}`}` : 
    'https://crownandchrono.com/images/og-default.jpg';
  
  const description = post.excerpt || post.frontmatter.description || `Read about ${post.frontmatter.title} on Crown and Chrono`;
  
  return {
    title: `${post.frontmatter.title} | Crown and Chrono`,
    description,
    keywords: post.frontmatter.tags?.join(', ') || 'watches, luxury watches',
    alternates: {
      canonical: `https://crownandchrono.com/${slug}`,
    },
    openGraph: {
      title: post.frontmatter.title,
      description,
      type: 'article',
      publishedTime: post.frontmatter.date,
      modifiedTime: post.frontmatter.lastModified || post.frontmatter.date,
      authors: post.frontmatter.author ? [post.frontmatter.author] : ['Crown and Chrono'],
      tags: post.frontmatter.tags || [],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.frontmatter.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.frontmatter.title,
      description,
      images: [imageUrl],
      creator: post.frontmatter.author ? `@${post.frontmatter.author.replace(/\s+/g, '')}` : '@crownandchrono',
    },
  };
}

export default async function BlogPost({ params }) {
  const { slug } = await Promise.resolve(params);
  
  // Fetch the actual blog post content
  const post = getBlogPostBySlug(slug) || {
    slug: slug,
    frontmatter: {
      title: `Post Not Found: ${slug}`,
      date: new Date().toString(),
      tags: [],
    },
    content: '# This post could not be found'
  };
  
  // Get the appropriate editor for this article
  const editor = getEditorForArticle(post.frontmatter);
  
  // Get related posts for sidebar (by matching tags)
  const relatedPosts = post.frontmatter.tags && post.frontmatter.tags.length > 0 ?
    getBlogPostsByTag(post.frontmatter.tags[0])
      .filter(related => related.slug !== slug)
      .slice(0, 3) : [];
      
  // Create structured data for the blog post (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.frontmatter.title,
    'datePublished': post.frontmatter.date,
    'dateModified': post.frontmatter.lastModified || post.frontmatter.date,
    'author': {
      '@type': 'Person',
      'name': editor ? editor.name : (post.frontmatter.author || 'Crown and Chrono'),
      'description': editor ? editor.title : undefined,
      'jobTitle': editor ? editor.title : undefined
    },
    'image': post.frontmatter.image ? `https://crownandchrono.com${post.frontmatter.image.startsWith('/') ? post.frontmatter.image : `/${post.frontmatter.image}`}` : undefined,
    'publisher': {
      '@type': 'Organization',
      'name': 'Crown and Chrono',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://crownandchrono.com/logo.png'
      }
    },
    'description': post.excerpt || post.frontmatter.description,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://crownandchrono.com/${slug}`
    }
  };

  return (
    <div className={styles.page}>
      {/* Add JSON-LD structured data script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className={styles.main}>
        <article className="blog-post">
          {post.frontmatter.image ? (
            <div className="post-hero-wrapper">
              <div className="post-hero" style={{ 
                backgroundImage: `url(${post.frontmatter.image.startsWith('/') ? post.frontmatter.image : `/${post.frontmatter.image}`})` 
              }}>
                <div className="hero-overlay"></div>
                <div className="container">
                  <h1>{post.frontmatter.title}</h1>
                  <div className="post-meta">
                    <span className="post-date">
                      {new Date(post.frontmatter.date).toLocaleDateString()}
                    </span>
                    {post.frontmatter.author && (
                      <span className="post-author">
                        By {post.frontmatter.author}
                      </span>
                    )}
                  </div>
                  {post.frontmatter.tags && (
                    <div className="post-tags">
                      {post.frontmatter.tags.map(tag => (
                        <Link key={tag} href={`/tags/${tag}`} className="tag">
                          {tag}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <header className="post-header">
              <h1>{post.frontmatter.title}</h1>
              <div className="post-meta">
                <span className="post-date">
                  {new Date(post.frontmatter.date).toLocaleDateString()}
                </span>
                {post.frontmatter.author && (
                  <span className="post-author">
                    By {post.frontmatter.author}
                  </span>
                )}
              </div>
              {post.frontmatter.tags && (
                <div className="post-tags">
                  {post.frontmatter.tags.map(tag => (
                    <Link key={tag} href={`/tags/${tag}`} className="tag">
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
            </header>
          )}
          
          <div className="blog-layout">
            <div className="post-content">
              <ReactMarkdown>
                {post.content}
              </ReactMarkdown>
              
              {/* Display the editor bio */}
              {editor && (
                <div className="editor-section">
                  <EditorBio editor={editor} />
                </div>
              )}
              
              <footer className="post-footer">
                <Link href="/" className="back-link">
                  ← Back to Articles
                </Link>
              </footer>
            </div>
            
            <aside className="sidebar">
              {relatedPosts.length > 0 && (
                <div className="sidebar-module related-posts">
                  <h3>Related Articles</h3>
                  <ul>
                    {relatedPosts.map(related => (
                      <li key={related.slug}>
                        <Link href={`/${related.slug}`}>
                          <div className="related-post">
                            {related.frontmatter.image && (
                              <div className="related-post-image" style={{ backgroundImage: `url(${related.frontmatter.image.startsWith('/') ? related.frontmatter.image : `/${related.frontmatter.image}`})` }}></div>
                            )}
                            <div className="related-post-title">{related.frontmatter.title}</div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="sidebar-module ad-space">
                <div className="ad-placeholder">
                  <h4>Advertisement</h4>
                  <p>Your ad could be here</p>
                </div>
              </div>
              
              <div className="sidebar-module newsletter">
                <h3>Newsletter</h3>
                <p>Subscribe to get updates on new watches and reviews</p>
                <div className="newsletter-form">
                  <input type="email" placeholder="Your email address" />
                  <button>Subscribe</button>
                </div>
              </div>
            </aside>
          </div>
        </article>
      </main>
    </div>
  );
}
