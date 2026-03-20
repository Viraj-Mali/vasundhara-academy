'use client';
import { useState, useEffect } from 'react';
import '@/styles/about.css';
import '@/styles/phase4.css';
import Lightbox from '@/components/ui/Lightbox';

const facilities = [
  { title: 'Smart Classrooms', category: 'Educational', icon: 'fas fa-chalkboard-teacher', color: '#2563eb', desc: 'Technology-enabled classrooms with projectors, digital boards, and audio-visual equipment for interactive and engaging learning.', galleryTag: 'classroom' },
  { title: 'Science Laboratory', category: 'Educational', icon: 'fas fa-flask', color: '#7c3aed', desc: 'Well-equipped physics, chemistry, and biology labs for hands-on experiments and practical learning.', galleryTag: 'science-lab' },
  { title: 'Computer Lab', category: 'Educational', icon: 'fas fa-laptop-code', color: '#0891b2', desc: 'Modern computer lab with latest systems, internet connectivity, and age-appropriate software for digital literacy.', galleryTag: 'computer-lab' },
  { title: 'Library', category: 'Educational', icon: 'fas fa-book-open', color: '#059669', desc: 'A vast collection of books, journals, magazines, and digital resources to cultivate reading habits and knowledge seeking.', galleryTag: 'library' },
  { title: 'Hostel Facility', category: 'Hostel', icon: 'fas fa-bed', color: '#dc2626', desc: 'Clean, safe, and comfortable residential facility with nutritious meals, supervised study hours, and recreational activities.', galleryTag: 'hostel' },
  { title: 'Counseling Center', category: 'Counseling', icon: 'fas fa-hands-helping', color: '#d97706', desc: 'Professional counseling services to address academic, emotional, and social needs of students in a confidential setting.', galleryTag: 'counseling' },
  { title: 'Healthcare & First Aid', category: 'Healthcare', icon: 'fas fa-heartbeat', color: '#e11d48', desc: 'On-campus health room with first aid facilities and regular health checkups to ensure student wellbeing.', galleryTag: 'healthcare' },
  { title: 'Sports Grounds', category: 'Sports', icon: 'fas fa-futbol', color: '#16a34a', desc: 'Spacious playground with facilities for cricket, football, kho-kho, kabaddi, and track & field events.', galleryTag: 'sports' },
  { title: 'Indoor Games Room', category: 'Sports', icon: 'fas fa-chess', color: '#4f46e5', desc: 'Dedicated indoor space for chess, carrom, table tennis, and other indoor sports and recreational activities.', galleryTag: 'indoor-games' },
  { title: 'Educational Outings', category: 'Outings', icon: 'fas fa-mountain', color: '#0d9488', desc: 'Regular educational trips, field visits, and excursions to historical places, museums, and nature spots for experiential learning.', galleryTag: 'outings' },
  { title: 'Assembly Ground', category: 'Educational', icon: 'fas fa-bullhorn', color: '#ca8a04', desc: 'Open assembly area for morning prayers, special events, cultural programs, and school-wide gatherings.', galleryTag: 'assembly' },
  { title: 'Transport Facility', category: 'Transport', icon: 'fas fa-bus-alt', color: '#ea580c', desc: 'Safe and well-maintained school buses covering major routes in and around Akole for comfortable commuting.', galleryTag: 'transport' },
];

export default function FacilitiesPage() {
  const [gallery, setGallery] = useState([]);
  const [lightboxData, setLightboxData] = useState(null);

  useEffect(() => {
    fetch('/api/public/gallery?all=true')
      .then(r => r.json())
      .then(data => setGallery(data))
      .catch(() => {});
  }, []);

  const getPhotos = (tag) => gallery.filter(g => (g.category || '').toLowerCase().includes(tag) || (g.title || '').toLowerCase().includes(tag));

  const openLightbox = (photos, index) => {
    setLightboxData({
      images: photos.map(p => ({ url: p.url, title: p.title })),
      startIndex: index,
    });
  };

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-hero-title">Our Facilities</h1>
          <p className="page-hero-desc">Modern infrastructure and resources for a world-class learning experience.</p>
        </div>
      </section>

      <section className="facilities-section">
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Infrastructure</span>
          <h2 className="section-title">Everything Your Child Needs</h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            Our campus is designed to inspire learning, creativity, and growth with modern facilities
            that support every aspect of student development.
          </p>
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
          {facilities.map((f, i) => {
            const photos = getPhotos(f.galleryTag);
            return (
              <div key={i} className="reveal" style={{ marginBottom: '2.5rem', background: 'var(--white)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-md)', background: `${f.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className={f.icon} style={{ fontSize: '1.3rem', color: f.color }}></i>
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--navy)', margin: 0 }}>{f.title}</h3>
                    <span style={{ fontSize: '0.72rem', color: f.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{f.category}</span>
                  </div>
                </div>

                {/* Description */}
                <div style={{ padding: '1.5rem 2rem' }}>
                  <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', lineHeight: 1.7 }}>{f.desc}</p>
                </div>

                {/* Photo Gallery with Lightbox */}
                {photos.length > 0 && (
                  <div style={{ padding: '0 2rem 1.5rem' }}>
                    <h4 style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.8rem' }}>
                      <i className="fas fa-images" style={{ marginRight: '0.4rem' }}></i> Photo Gallery ({photos.length})
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.8rem' }}>
                      {photos.map((p, idx) => (
                        <div
                          key={p.id}
                          onClick={() => openLightbox(photos, idx)}
                          style={{ cursor: 'pointer', borderRadius: 'var(--radius-md)', overflow: 'hidden', aspectRatio: '4/3', position: 'relative' }}
                        >
                          <img
                            src={p.url}
                            alt={p.title || f.title}
                            loading="lazy"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                            onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
                            onMouseOut={e => e.target.style.transform = 'scale(1)'}
                          />
                          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onMouseOver={e => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}
                            onMouseOut={e => e.currentTarget.style.background = 'rgba(0,0,0,0)'}
                          >
                            <i className="fas fa-search-plus" style={{ color: 'white', fontSize: '1.2rem', opacity: 0, transition: 'opacity 0.3s' }}
                              ref={el => { if (el) { el.parentElement.addEventListener('mouseenter', () => el.style.opacity = 1); el.parentElement.addEventListener('mouseleave', () => el.style.opacity = 0); }}}
                            ></i>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Placeholder if no photos */}
                {photos.length === 0 && (
                  <div style={{ padding: '0 2rem 1.5rem' }}>
                    <div style={{ background: `${f.color}08`, border: `1px dashed ${f.color}30`, borderRadius: 'var(--radius-md)', padding: '1.5rem', textAlign: 'center' }}>
                      <i className={f.icon} style={{ fontSize: '2rem', color: `${f.color}40`, marginBottom: '0.5rem', display: 'block' }}></i>
                      <p style={{ color: 'var(--gray-400)', fontSize: '0.78rem' }}>
                        Photos can be uploaded via Admin Panel → Gallery<br />
                        <span style={{ fontSize: '0.7rem' }}>Use category: <code>{f.galleryTag}</code></span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Lightbox with navigation */}
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
