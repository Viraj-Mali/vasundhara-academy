'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import '@/styles/about.css';

export default function BoardPage() {
  const [members, setMembers] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/public/board')
      .then(r => r.json())
      .then(data => { setMembers(data); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-hero-title">Board of Directors</h1>
          <p className="page-hero-desc">Meet the leadership team guiding Abhinav Education Society.</p>
        </div>
      </section>

      <section className="board-section">
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Our Leaders</span>
          <h2 className="section-title">Abhinav Education Society — Board Members</h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            The Board of Directors provides strategic guidance and ensures the academy&apos;s
            commitment to educational excellence.
          </p>
        </div>
        <div className="board-grid">
          {!loaded ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)', gridColumn: '1/-1' }}><i className="fas fa-spinner fa-spin"></i> Loading...</p>
          ) : members.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)', gridColumn: '1/-1' }}>Board member details coming soon.</p>
          ) : (
            members.map((m) => (
              <div key={m.id} className="board-card">
                {m.photo ? (
                  <img src={m.photo} alt={m.name} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--gold)', marginBottom: '1rem' }} />
                ) : (
                  <div className="board-photo-placeholder">{m.name?.charAt(0)}</div>
                )}
                <h3>{m.name}</h3>
                <p>{m.designation}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
