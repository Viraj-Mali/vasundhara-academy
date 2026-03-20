'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import '@/styles/about.css';
import '@/styles/phase4.css';

const categoryColors = { news: '#3b82f6', announcement: '#f59e0b', article: '#8b5cf6', achievement: '#22c55e' };

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetch('/api/admin/blog')
      .then(r => r.json())
      .then(data => { setPosts(data.filter(p => p.published)); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  const filtered = activeFilter === 'all' ? posts : posts.filter(p => p.category === activeFilter);

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-hero-title">News & Blog</h1>
          <p className="page-hero-desc">Stay updated with the latest news, stories, and achievements from Vasundhara Academy.</p>
        </div>
      </section>

      <section style={{ padding: '4rem 0', background: 'var(--off-white)' }}>
        <div className="container">
          {/* Filter */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            {['all', 'news', 'announcement', 'article', 'achievement'].map(cat => (
              <button key={cat} onClick={() => setActiveFilter(cat)} className={`event-filter-btn${activeFilter === cat ? ' active' : ''}`}>
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {!loaded ? (
            <div className="events-grid">
              {[1,2,3].map(i => (
                <div key={i} className="event-card">
                  <div className="shimmer shimmer-image" style={{ height: '200px' }}></div>
                  <div style={{ padding: '1.5rem' }}>
                    <div className="shimmer shimmer-line shimmer-line-full"></div>
                    <div className="shimmer shimmer-line shimmer-line-medium"></div>
                    <div className="shimmer shimmer-line shimmer-line-short"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <i className="fas fa-newspaper" style={{ fontSize: '3rem', color: 'var(--gray-300)', display: 'block', marginBottom: '1rem' }}></i>
              <h3 style={{ color: 'var(--navy)', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>No Posts Yet</h3>
              <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>Blog posts will appear here once published.</p>
            </div>
          ) : (
            <div className="events-grid">
              {filtered.map(post => (
                <article key={post.id} className="event-card reveal">
                  {post.coverImage && (
                    <div className="event-img-wrap">
                      <img src={post.coverImage} alt={post.title} loading="lazy" />
                      <span className="event-category-badge" style={{ background: categoryColors[post.category] || '#3b82f6' }}>{post.category}</span>
                    </div>
                  )}
                  {!post.coverImage && (
                    <div style={{ height: '180px', background: `linear-gradient(135deg, var(--navy), var(--navy-light))`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <i className="fas fa-newspaper" style={{ fontSize: '3rem', color: 'rgba(212,168,83,0.2)' }}></i>
                      <span className="event-category-badge" style={{ background: categoryColors[post.category] || '#3b82f6' }}>{post.category}</span>
                    </div>
                  )}
                  <div className="event-body">
                    <h3>{post.title}</h3>
                    <p>{post.excerpt || post.content.substring(0, 150)}...</p>
                  </div>
                  <div className="event-footer">
                    <span className="event-photos-count">
                      <i className="fas fa-calendar-alt"></i> {new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    {post.author && <span style={{ color: 'var(--gray-400)', fontSize: '0.78rem' }}>By {post.author}</span>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
