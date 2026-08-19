'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import '@/styles/about.css';

export default function TeacherTrainingDetailPage() {
  const params = useParams();
  const [training, setTraining] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    fetch(`/api/public/teacher-training/${encodeURIComponent(params.id)}`, { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then(setTraining)
      .catch(() => setTraining(null))
      .finally(() => setLoaded(true));
  }, [params?.id]);

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-hero-title">{training?.title || 'Teacher Training & Development'}</h1>
          <p className="page-hero-desc">Training program photos and details.</p>
        </div>
      </section>

      <section className="info-section">
        <div className="container text-center">
          {!loaded ? (
            <p style={{ color: 'var(--gray-400)', padding: '2rem' }}><i className="fas fa-spinner fa-spin"></i> Loading training photos...</p>
          ) : !training ? (
            <p style={{ color: 'var(--gray-400)', padding: '2rem' }}>Teacher training program not found.</p>
          ) : (
            <>
              <span className="section-tag"><i className="fas fa-minus"></i> {training.category}</span>
              <h2 className="section-title">{training.title}</h2>
              <p className="section-desc" style={{ margin: '0 auto' }}>{training.description}</p>
              {training.trainingDate && <p style={{ marginTop: '0.75rem', color: 'var(--gray-400)', fontSize: '0.82rem' }}><i className="fas fa-calendar-alt" style={{ color: 'var(--gold)', marginRight: '0.35rem' }}></i>{new Date(training.trainingDate).toLocaleDateString('en-IN')}</p>}

              {training.images.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', maxWidth: '1200px', margin: '2rem auto 0' }}>
                  {training.images.map((image) => (
                    <a key={image.id} href={image.imageUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '220px', padding: '0.5rem', background: 'var(--off-white)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: 'var(--shadow-sm)' }}>
                      <img src={image.imageUrl} alt={`${training.title} training`} style={{ display: 'block', width: '100%', maxWidth: '100%', height: 'auto', maxHeight: '420px', objectFit: 'contain', borderRadius: 'var(--radius-md)' }} />
                    </a>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--gray-400)', padding: '2rem' }}>No training photos added yet.</p>
              )}
            </>
          )}

          <Link href="/academics/teacher-training" className="btn btn-outline" style={{ marginTop: '2rem' }}><i className="fas fa-arrow-left"></i> Back to Teacher Training</Link>
        </div>
      </section>
    </>
  );
}
