'use client';

import { useEffect, useState } from 'react';
import '@/styles/about.css';
import '@/styles/phase4.css';

const grades = [
  { number: 1, name: 'Grade 1', color: '#2563eb', icon: 'fas fa-book-open' },
  { number: 2, name: 'Grade 2', color: '#7c3aed', icon: 'fas fa-book-open' },
  { number: 3, name: 'Grade 3', color: '#0891b2', icon: 'fas fa-book-open' },
  { number: 4, name: 'Grade 4', color: '#059669', icon: 'fas fa-book-open' },
  { number: 5, name: 'Grade 5', color: '#2563eb', icon: 'fas fa-book-open' },
  { number: 6, name: 'Grade 6', color: '#7c3aed', icon: 'fas fa-book-open' },
  { number: 7, name: 'Grade 7', color: '#0891b2', icon: 'fas fa-book-open' },
  { number: 8, name: 'Grade 8', color: '#059669', icon: 'fas fa-book-open' },
  { number: 9, name: 'Grade 9', color: '#d97706', icon: 'fas fa-book-open' },
  { number: 10, name: 'Grade 10', color: '#db2777', icon: 'fas fa-book-open' },
];

export default function QuestionBankPage() {
  const [links, setLinks] = useState({});

  useEffect(() => {
    fetch('/api/question-bank', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => setLinks(data && typeof data === 'object' ? data : {}))
      .catch(() => setLinks({}));
  }, []);

  return (
    <>
      <section className="page-hero page-hero-building">
        <div className="page-hero-content">
          <h1 className="page-hero-title">Question Bank</h1>
          <p className="page-hero-desc">Grade-wise resources for focused practice and revision.</p>
        </div>
      </section>

      <section className="facilities-section">
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Practice Resources</span>
          <h2 className="section-title">Grade 1 to Grade 10 Question Bank</h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            Open the Grade-wise Google Drive folder to access subject-wise Question Bank PDFs.
          </p>
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
          {grades.map((grade) => {
            const driveLink = links[`grade${grade.number}`] || '';

            return (
              <div key={grade.name} className="reveal" style={{ marginBottom: '2.5rem', background: 'var(--white)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-md)', background: `${grade.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className={grade.icon} style={{ fontSize: '1.3rem', color: grade.color }}></i>
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--navy)', margin: 0 }}>{grade.name}</h3>
                    <span style={{ fontSize: '0.72rem', color: grade.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Question Bank PDFs</span>
                  </div>
                </div>

                <div style={{ padding: '1.5rem 2rem' }}>
                  <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                    Subject-wise Question Bank PDFs
                  </p>

                  {driveLink ? (
                    <a href={driveLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '0.65rem 1rem', fontSize: '0.8rem', textDecoration: 'none' }}>
                      <i className="fas fa-folder-open" style={{ marginRight: '0.35rem' }}></i>
                      Open {grade.name} Folder
                    </a>
                  ) : (
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                      Question Bank folder will be available soon.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
