'use client';

import { useEffect, useState } from 'react';

export default function AcademicProgramCards() {
  const [programs, setPrograms] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/public/academic-programs', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => setPrograms(Array.isArray(data) ? data : []))
      .catch(() => setPrograms([]))
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded) {
    return (
      <p style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '2rem 1rem' }}>
        <i className="fas fa-spinner fa-spin"></i> Loading academic programs...
      </p>
    );
  }

  if (programs.length === 0) {
    return (
      <p style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '2rem 1rem' }}>
        No academic programs added yet.
      </p>
    );
  }

  return (
    <div className="facilities-grid">
      {programs.map((program) => (
        <div key={program.id} className="facility-card">
          <div className="facility-img">
            <img src={program.imageUrl} alt={program.title} />
          </div>
          <div className="facility-body">
            <span className="facility-category">{program.category}</span>
            <h3>{program.title}</h3>
            <p>{program.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
