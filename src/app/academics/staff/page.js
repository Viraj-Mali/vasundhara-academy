'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import '@/styles/about.css';
import '@/styles/phase4.css';

export default function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const gridRef = useRef(null);

  useEffect(() => {
    fetch('/api/public/staff')
      .then(r => r.json())
      .then(data => { setStaff(data); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  // After staff data loads and cards render, trigger the reveal animation
  const handleGridRef = useCallback((node) => {
    gridRef.current = node;
    if (node && loaded && staff.length > 0) {
      // Remove any stale 'revealed' class first, then re-add after a frame
      // so the CSS transition actually fires on the new children
      node.classList.remove('revealed');
      requestAnimationFrame(() => {
        node.classList.add('revealed');
      });
    }
  }, [loaded, staff]);

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-hero-title">Our Teaching Staff</h1>
          <p className="page-hero-desc">Dedicated educators shaping the future, one student at a time.</p>
        </div>
      </section>

      <section className="staff-section">
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Our Team</span>
          <h2 className="section-title">Meet Our Educators</h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            Our qualified and passionate team of teachers is the backbone of Vasundhara Academy&apos;s academic excellence.
          </p>
        </div>
        <div className="staff-grid reveal-stagger" ref={handleGridRef}>
          {!loaded ? (
            <>
              {[1,2,3,4].map(i => (
                <div key={i} className="staff-card">
                  <div className="shimmer shimmer-circle" style={{ width: 120, height: 120, margin: '0 auto 1.2rem' }}></div>
                  <div className="shimmer shimmer-line shimmer-line-medium" style={{ margin: '0 auto 0.5rem' }}></div>
                  <div className="shimmer shimmer-line shimmer-line-short" style={{ margin: '0 auto' }}></div>
                </div>
              ))}
            </>
          ) : staff.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-400)', gridColumn: '1/-1' }}>
              <i className="fas fa-users" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem', color: 'var(--gray-300)' }}></i>
              Staff details coming soon.
            </p>
          ) : (
            staff.map((t) => (
              <div key={t.id} className="staff-card">
                {t.subject && (
                  <div className="staff-subject-badge">
                    {t.subject}
                  </div>
                )}
                {t.photo ? (
                  <img
                    src={t.photo}
                    alt={t.name}
                    className="staff-photo"
                    loading="lazy"
                  />
                ) : (
                  <div className="staff-photo-placeholder">{t.name?.charAt(0) || '?'}</div>
                )}
                <div className="staff-info">
                  <h3>{t.name}</h3>
                  <p className="staff-desg">{t.designation}</p>
                  {t.qualification && <p className="staff-qual">{t.qualification}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
