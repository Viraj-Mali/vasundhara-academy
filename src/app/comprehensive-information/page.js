'use client';
import { useEffect, useState } from 'react';
import '@/styles/about.css';
import '@/styles/phase5.css';

export default function ComprehensiveInformationPage() {
  const [rows, setRows] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/public/comprehensive-information', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        setRows(Array.isArray(data.rows) ? data.rows : []);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  return (
    <>
      <section className="page-hero page-hero-building">
        <div className="page-hero-content">
          <h1 className="page-hero-title">Comprehensive Information : 2026-27</h1>
          <p className="page-hero-desc">School information and documents for the academic year 2026-27.</p>
        </div>
      </section>

      <section className="appendix-disclosures-section">
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Documents</span>
          <h2 className="section-title">Comprehensive Information</h2>
        </div>

        <div className="appendix-card-stack">
          {!loaded && (
            <div className="appendix-loading">
              <i className="fas fa-spinner fa-spin"></i> Loading comprehensive information...
            </div>
          )}

          <article className="appendix-card">
            <h2>Comprehensive Information : 2026-27</h2>
            <div className="appendix-table-wrap">
              <table className="appendix-table">
                <thead>
                  <tr>
                    <th>SL No.</th>
                    <th>Information</th>
                    <th>Uploaded Document</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const isMandatoryPublicDisclosure = row.rowKey === 'mandatory-public-disclosures';
                    const documentUrl = isMandatoryPublicDisclosure
                      ? '/comprehensive-information/public-disclosure.pdf'
                      : `/api/public/comprehensive-information/${encodeURIComponent(row.rowKey)}`;

                    return (
                      <tr key={row.rowKey}>
                        <td>{row.slNo}</td>
                        <td>{row.title}</td>
                        <td>
                          {isMandatoryPublicDisclosure || row.pdfUrl ? (
                          <a
                            href={documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="appendix-action"
                          >
                            View PDF
                          </a>
                          ) : (
                            'Not Uploaded'
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
