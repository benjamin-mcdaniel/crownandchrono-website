import Image from "next/image";
import styles from "./page.module.css";
import { getAllBlogPosts } from "../utils/blog";
import Link from "next/link";

export default function Home() {
  // Fetch all blog posts from the content directory
  const allPosts = getAllBlogPosts();
  
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className="hero-section">
          <div className="hero-background"></div>
          <div className="hero-content-wrapper">
            <h1>Great watches, exceptional collectors</h1>
            <p style={{color: '#0066cc'}}>No-nonsense wristwatch reviews, history, and commentary</p>
          </div>
        </div>
        
        <section className="blog-posts">
          <h2>Latest Articles</h2>
          
          {allPosts.length > 0 ? (
            <div className="posts-grid">
              {allPosts.map((post) => (
                <div key={post.slug} className="post-card">
                  {post.frontmatter.image && (
                    <div className="post-image">
                      <Link href={`/${post.slug}`}>
                        <img 
                          src={post.frontmatter.image.startsWith('/') ? post.frontmatter.image : `/${post.frontmatter.image}`} 
                          alt={post.frontmatter.title} 
                          style={{ cursor: 'pointer' }}
                        />
                      </Link>
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
              <p>Content coming soon! We're working on bringing you the latest watch insights.</p>
            </div>
          )}
        </section>
      </main>

    </div>
  );
}
