import { getBlogPostsByTag } from '../../../utils/blog';
import Link from 'next/link';
import styles from '../../page.module.css';

// Generate static paths for all tags we support
export function generateStaticParams() {
  // Include all tags we want to support in our navigation
  return [
    { tag: 'review' },
    { tag: 'history' },
    { tag: 'commentary' },
    { tag: 'trending' },
    { tag: 'classics' },
    { tag: 'deals' }
  ];
}

export default async function TagPage({ params }) {
  const { tag } = await Promise.resolve(params);
  
  // Fetch posts filtered by tag
  const posts = getBlogPostsByTag(tag) || [];

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className="tag-page">
          <header>
            <h1>Posts tagged: {tag}</h1>
          </header>
          
          {posts.length > 0 ? (
            <div className="posts-grid">
              {posts.map((post) => (
                <div key={post.slug} className="post-card">
                  {post.frontmatter.image && (
                    <div className="post-image">
                      <img src={post.frontmatter.image} alt={post.frontmatter.title} />
                    </div>
                  )}
                  <div className="post-content">
                    <h3>
                      <Link href={`/${post.slug}`}>{post.frontmatter.title}</Link>
                    </h3>
                    <p className="post-date">{new Date(post.frontmatter.date).toLocaleDateString()}</p>
                    <p className="post-excerpt">{post.excerpt}</p>
                    <Link href={`/${post.slug}`} className="read-more">Read More</Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No posts with this tag yet. Check back soon!</p>
            </div>
          )}
          
          <footer>
            <Link href="/" className="back-link">
              ← Back to all posts
            </Link>
          </footer>
        </div>
      </main>
    </div>
  );
}
