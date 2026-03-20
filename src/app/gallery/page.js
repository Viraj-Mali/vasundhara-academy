'use client';
import { useState, useEffect } from 'react';
import '@/styles/about.css';
import '@/styles/phase4.css';
import Lightbox from '@/components/ui/Lightbox';

const categoryTabs = [
  { key: 'all', label: 'All Photos', icon: 'fas fa-th' },
  { key: 'general', label: 'General', icon: 'fas fa-images' },
  { key: 'campus', label: 'Campus', icon: 'fas fa-school' },
  { key: 'awards', label: 'Awards', icon: 'fas fa-trophy' },
  { key: 'achievements', label: 'Achievements', icon: 'fas fa-medal' },
];

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [lightboxData, setLightboxData] = useState(null);

  useEffect(() => {
    fetch('/api/public/gallery')
      .then(r => r.json())
      .then(data => { setImages(data); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  const filtered = activeTab === 'all' ? images : images.filter(i => (i.category || '').toLowerCase() === activeTab);

  const openLightbox = (idx) => {
    setLightboxData({
      images: filtered.map(i => ({ url: i.url, title: i.title })),
      startIndex: idx,
    });
  };

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-hero-title">Photo Gallery</h1>
          <p className="page-hero-desc">Memories and moments captured at Vasundhara Academy.</p>
        </div>
      </section>

      <section style={{ padding: '4rem 0', background: 'var(--off-white)' }}>
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Gallery</span>
          <h2 className="section-title">Our Campus in Pictures</h2>
          <p className="section-desc" style={{ margin: '0 auto 2rem' }}>
            Browse through photos of our campus, events, and achievements.
          </p>

          {/* Category Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            {categoryTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`event-filter-btn${activeTab === tab.key ? ' active' : ''}`}
              >
                <i className={tab.icon} style={{ marginRight: '0.4rem' }}></i> {tab.label}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          {!loaded ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="shimmer shimmer-image" style={{ height: '220px', borderRadius: 'var(--radius-lg)' }}></div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <i className="fas fa-images" style={{ fontSize: '3rem', color: 'var(--gray-300)', display: 'block', marginBottom: '1rem' }}></i>
              <h3 style={{ color: 'var(--navy)', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>No Photos Yet</h3>
              <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>
                {activeTab === 'all' ? 'Photos will appear here once uploaded via the admin panel.' : `No ${activeTab} photos available yet.`}
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1rem',
              maxWidth: '1200px',
              margin: '0 auto',
            }}>
              {filtered.map((img, idx) => (
                <div
                  key={img.id}
                  onClick={() => openLightbox(idx)}
                  className="reveal-scale"
                  style={{
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative',
                    aspectRatio: '4/3',
                    background: 'var(--gray-100)',
                  }}
                >
                  <img
                    src={img.url}
                    alt={img.title || 'Gallery photo'}
                    loading="lazy"
                    style={{
                      width: '100%', height: '100%', objectFit: 'cover',
                      transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
                    }}
                    onMouseOver={e => e.target.style.transform = 'scale(1.08)'}
                    onMouseOut={e => e.target.style.transform = 'scale(1)'}
                  />
                  {/* Overlay */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(10,22,40,0.7) 0%, transparent 50%)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                    padding: '1rem',
                    opacity: 0, transition: 'opacity 0.3s',
                  }}
                    onMouseOver={e => e.currentTarget.style.opacity = 1}
                    onMouseOut={e => e.currentTarget.style.opacity = 0}
                  >
                    {img.title && (
                      <p style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>{img.title}</p>
                    )}
                    <span style={{ color: 'var(--gold)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.2rem' }}>
                      {img.category || 'General'}
                    </span>
                  </div>
                  {/* Zoom icon */}
                  <div style={{
                    position: 'absolute', top: '0.8rem', right: '0.8rem',
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0, transition: 'opacity 0.3s',
                  }}
                    onMouseOver={e => e.currentTarget.style.opacity = 1}
                    onMouseOut={e => e.currentTarget.style.opacity = 0}
                  >
                    <i className="fas fa-expand" style={{ color: 'white', fontSize: '0.7rem' }}></i>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Photo count */}
          {loaded && filtered.length > 0 && (
            <p style={{ marginTop: '2rem', color: 'var(--gray-400)', fontSize: '0.82rem' }}>
              Showing {filtered.length} photo{filtered.length !== 1 ? 's' : ''}
              {activeTab !== 'all' && ` in ${activeTab}`}
            </p>
          )}
        </div>
      </section>

      {lightboxData && (
        <Lightbox
          images={lightboxData.images}
          startIndex={lightboxData.startIndex}
          onClose={() => setLightboxData(null)}
        />
      )}
    </>
  );
}
