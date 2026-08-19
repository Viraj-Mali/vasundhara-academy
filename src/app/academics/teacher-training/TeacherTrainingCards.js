'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const categoryIcons = {
  'ICT Training': 'fas fa-laptop',
  'NEP Workshop': 'fas fa-brain',
  'Pedagogical Skills': 'fas fa-chalkboard-teacher',
  'Child Psychology': 'fas fa-heart',
  'Inclusive Education': 'fas fa-universal-access',
  'Safety & First Aid': 'fas fa-fire-extinguisher',
  Other: 'fas fa-chalkboard-teacher',
};

export default function TeacherTrainingCards() {
  const [trainings, setTrainings] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/public/teacher-training', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => setTrainings(Array.isArray(data) ? data : []))
      .catch(() => setTrainings([]))
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded) {
    return <p style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '2rem' }}><i className="fas fa-spinner fa-spin"></i> Loading training programs...</p>;
  }

  if (trainings.length === 0) {
    return <p style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '2rem' }}>No teacher training programs added yet.</p>;
  }

  return (
    <div className="info-grid">
      {trainings.map((training) => (
        <div key={training.id} className="info-card" style={{ overflow: 'hidden' }}>
          {training.coverImageUrl && (
            <img
              src={training.coverImageUrl}
              alt={training.title}
              style={{ display: 'block', width: 'calc(100% + 3.6rem)', height: '220px', objectFit: 'cover', margin: '-1.8rem -1.8rem 1.2rem' }}
            />
          )}
          <div className="info-card-header">
            {!training.coverImageUrl && (
              <div className="info-card-icon"><i className={categoryIcons[training.category] || categoryIcons.Other}></i></div>
            )}
            <h3>{training.title}</h3>
          </div>
          <p>{training.description}</p>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '1rem', color: 'var(--gray-400)', fontSize: '0.75rem' }}>
            <span><i className="fas fa-tag" style={{ color: 'var(--gold)', marginRight: '0.3rem' }}></i>{training.category}</span>
            {training.trainingDate && (
              <span><i className="fas fa-calendar-alt" style={{ color: 'var(--gold)', marginRight: '0.3rem' }}></i>{new Date(training.trainingDate).toLocaleDateString('en-IN')}</span>
            )}
          </div>
          {training.images?.length > 0 && (
            <Link href={`/academics/teacher-training/${encodeURIComponent(training.id)}`} className="btn btn-outline" style={{ marginTop: '1rem' }}>
              <i className="fas fa-images"></i> View Photos
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
