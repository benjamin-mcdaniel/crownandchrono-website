import { getBlogPostBySlug, getAllBlogSlugs, getBlogPostsByTag } from '@/utils/blog';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import styles from '../page.module.css';

// Generate static paths for all blog posts
export function generateStaticParams() {
  const allSlugs = getAllBlogSlugs();
  return allSlugs.map(({ params }) => params);
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
  
  // Get related posts for sidebar (by matching tags)
  const relatedPosts = post.frontmatter.tags && post.frontmatter.tags.length > 0 ?
    getBlogPostsByTag(post.frontmatter.tags[0])
      .filter(related => related.slug !== slug)
      .slice(0, 3) : [];

  return (
    <div className={styles.page}>
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
