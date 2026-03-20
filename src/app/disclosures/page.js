'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import '@/styles/about.css';
import '@/styles/phase5.css';

const defaultCategories = [
  {
    title: 'School Affiliation Documents',
    key: 'affiliation',
    icon: 'fas fa-certificate',
    defaultDocs: [
      { title: 'Period of Affiliation', desc: 'CBSE Affiliation Certificate — No. 1130637' },
      { title: 'Society Registration Certificate', desc: 'Reg. No: MAHA/2143/ANR' },
      { title: 'No Objection Certificate (NOC)', desc: 'State Government NOC for CBSE affiliation' },
      { title: 'Recognition Certificate', desc: 'State recognition under RTE Act' },
    ],
  },
  {
    title: 'Self-Affidavit & Compliance',
    key: 'self-affidavit',
    icon: 'fas fa-gavel',
    defaultDocs: [
      { title: 'Self-Affidavit of School', desc: 'Compliance declaration as per CBSE norms' },
      { title: 'Building Safety Certificate', desc: 'Structural safety and fire safety certification' },
      { title: 'Land Certificate', desc: 'Land ownership / lease documentation' },
      { title: 'DEO Certificate', desc: 'District Education Officer certificate' },
    ],
  },
  {
    title: 'Results & Academic',
    key: 'result',
    icon: 'fas fa-chart-bar',
    defaultDocs: [
      { title: 'Class 10 Board Results', desc: 'CBSE Board examination results summary' },
      { title: 'Academic Performance Report', desc: 'School-wise academic performance analysis' },
    ],
  },
  {
    title: 'Staff & Infrastructure',
    key: 'academic',
    icon: 'fas fa-users',
    defaultDocs: [
      { title: 'Teacher Details', desc: 'Qualifications and experience of teaching staff' },
      { title: 'Staff (Teaching)', desc: 'Complete teaching staff statement' },
      { title: 'Infrastructure Report', desc: 'Campus facilities and amenities details' },
    ],
  },
];

export default function DisclosuresPage() {
  const [uploadedDocs, setUploadedDocs] = useState([]);

  useEffect(() => {
    fetch('/api/public/documents')
      .then(r => r.json())
      .then(data => setUploadedDocs(data))
      .catch(() => {});
  }, []);

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
<h1 className="page-hero-title">Mandatory Public Disclosures</h1>
          <p className="page-hero-desc">Transparency documents as mandated by CBSE for all affiliated schools.</p>
        </div>
      </section>

      <section className="docs-section">
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Documents</span>
          <h2 className="section-title">CBSE Mandatory Disclosures</h2>
        </div>
        <div className="docs-grid">
          {defaultCategories.map((cat, i) => {
            const catDocs = uploadedDocs.filter(d => d.category === cat.key);
            return (
              <div key={i} className="docs-category">
                <h3><i className={cat.icon}></i> {cat.title}</h3>
                {/* Show uploaded docs from admin first */}
                {catDocs.map(doc => (
                  <div key={doc.id} className="doc-item">
                    <div className="doc-info">
                      <div className="doc-icon"><i className="fas fa-file-pdf" style={{ color: '#dc2626' }}></i></div>
                      <div>
                        <h4>{doc.title}</h4>
                        <p style={{ color: '#16a34a', fontSize: '0.75rem' }}>✓ Uploaded</p>
                      </div>
                    </div>
                    {doc.fileUrl && (
                      <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="doc-download" style={{ cursor: 'pointer', textDecoration: 'none' }}>
                        <i className="fas fa-download" style={{ marginRight: '0.3rem' }}></i> View
                      </a>
                    )}
                  </div>
                ))}
                {/* Show default placeholders for this category */}
                {cat.defaultDocs.map((doc, j) => {
                  // Skip if already uploaded
                  const alreadyUploaded = catDocs.some(d => d.title.toLowerCase() === doc.title.toLowerCase());
                  if (alreadyUploaded) return null;
                  return (
                    <div key={j} className="doc-item">
                      <div className="doc-info">
                        <div className="doc-icon"><i className="fas fa-file-alt"></i></div>
                        <div>
                          <h4>{doc.title}</h4>
                          <p>{doc.desc}</p>
                        </div>
                      </div>
                      <span className="doc-download" style={{ opacity: 0.5 }}>
                        <i className="fas fa-clock" style={{ marginRight: '0.3rem' }}></i> Coming
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
