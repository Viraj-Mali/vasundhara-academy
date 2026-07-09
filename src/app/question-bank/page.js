'use client';

import { useEffect, useState } from 'react';
import '@/styles/about.css';
import '@/styles/phase4.css';

const classes = [
  { name: 'Class 5', color: '#2563eb', icon: 'fas fa-book-open' },
  { name: 'Class 6', color: '#7c3aed', icon: 'fas fa-book-open' },
  { name: 'Class 7', color: '#0891b2', icon: 'fas fa-book-open' },
  { name: 'Class 8', color: '#059669', icon: 'fas fa-book-open' },
  { name: 'Class 9', color: '#d97706', icon: 'fas fa-book-open' },
  { name: 'Class 10', color: '#db2777', icon: 'fas fa-book-open' },
];

export default function QuestionBankPage() {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/question-bank')
      .then((res) => res.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <>
      <section className="page-hero page-hero-building">
        <div className="page-hero-content">
          <h1 className="page-hero-title">Question Bank</h1>
          <p className="page-hero-desc">Class-wise PDF resources for focused practice and revision.</p>
        </div>
      </section>

      <section className="facilities-section">
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Practice Resources</span>
          <h2 className="section-title">Class 5 to Class 10 Question Bank</h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            Download active Question Bank PDFs uploaded by the school for each class.
          </p>
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
          {classes.map((classItem) => {
            const classDocs = items.filter((item) => item.className === classItem.name);

            return (
              <div key={classItem.name} className="reveal" style={{ marginBottom: '2.5rem', background: 'var(--white)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-md)', background: `${classItem.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className={classItem.icon} style={{ fontSize: '1.3rem', color: classItem.color }}></i>
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--navy)', margin: 0 }}>{classItem.name}</h3>
                    <span style={{ fontSize: '0.72rem', color: classItem.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Question Bank PDFs</span>
                  </div>
                </div>

                <div style={{ padding: '1.5rem 2rem' }}>
                  {!loaded ? (
                    <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>
                      <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.4rem' }}></i>
                      Loading Question Bank PDFs...
                    </p>
                  ) : classDocs.length === 0 ? (
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                      No Question Bank available for this class.
                    </p>
                  ) : (
                    <div style={{ display: 'grid', gap: '0.9rem' }}>
                      {classDocs.map((doc) => (
                        <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '1rem', border: '1px solid #f1f5f9', borderRadius: 'var(--radius-md)', background: '#fff' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', minWidth: 0 }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <i className="fas fa-file-pdf" style={{ color: '#dc2626', fontSize: '1.15rem' }}></i>
                            </div>
                            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.98rem', color: 'var(--navy)', margin: 0 }}>{doc.title}</h4>
                          </div>
                          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                            <a href={doc.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '0.65rem 1rem', fontSize: '0.8rem', textDecoration: 'none' }}>
                              <i className="fas fa-eye" style={{ marginRight: '0.35rem' }}></i> View PDF
                            </a>
                            <a href={doc.pdfUrl} download className="btn btn-primary" style={{ padding: '0.65rem 1rem', fontSize: '0.8rem', textDecoration: 'none' }}>
                              <i className="fas fa-download" style={{ marginRight: '0.35rem' }}></i> Download PDF
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
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
