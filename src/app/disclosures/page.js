'use client';
import { useEffect, useState } from 'react';
import {
  appendixDocumentSections,
  defaultResultYears,
  generalInformationRows,
  getDocumentForAppendixRow,
  infrastructureRows,
  normalizePublicDisclosureInfo,
  staffTeachingRows,
} from '@/lib/publicDisclosureConfig';
import '@/styles/about.css';
import '@/styles/phase5.css';

const ADDITIONAL_B_CATEGORY = 'public-disclosure-b-additional';

function valueOrNA(value) {
  return value && String(value).trim() ? value : 'NA';
}

function InfoTable({ rows, info }) {
  return (
    <div className="appendix-table-wrap">
      <table className="appendix-table">
        <thead>
          <tr>
            <th>SL No.</th>
            <th>Information</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            let cellContent = row.key === 'infrastructureVideoUrl' ? (
              <a href="https://youtu.be/UdUi9N6daGY?si=IAFAfsj4T8qHFEhx" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--navy)', textDecoration: 'underline', wordBreak: 'break-all' }}>
                https://youtu.be/UdUi9N6daGY?si=IAFAfsj4T8qHFEhx
              </a>
            ) : row.type === 'url' && info[row.key] ? (
              <a href={info[row.key]} target="_blank" rel="noopener noreferrer" className="appendix-action">
                View Video
              </a>
            ) : (
              valueOrNA(info[row.key])
            );

            if (row.key === 'contactDetails') {
              cellContent = (
                <div style={{ whiteSpace: 'pre-line' }}>
                  Principal: Prin.Dr. Jayashri Deshmukh{"\n"}
                  +91 94220 51190{"\n\n"}
                  Vice Principal: Ms.Radhika Nawale{"\n"}
                  +91 88052 54793
                </div>
              );
            }

            return (
              <tr key={row.key}>
                <td>{index + 1}</td>
                <td>{row.label}</td>
                <td>{cellContent}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function DocumentTable({ rows, documents, additionalDocuments = [] }) {
  return (
    <div className="appendix-table-wrap">
      <table className="appendix-table">
        <thead>
          <tr>
            <th>SL No.</th>
            <th>Documents / Information</th>
            <th>Uploaded Documents</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const doc = getDocumentForAppendixRow(documents, row);
            const hasFile = doc?.fileUrl && doc.fileUrl.trim() !== '';
            const displayTitle = doc?.title || row.label;

            return (
              <tr key={row.category}>
                <td>{index + 1}</td>
                <td>{displayTitle}</td>
                <td>
                  {hasFile ? (
                    <a
                      href={doc.isStatic ? doc.fileUrl : `/api/public/mandatory-disclosure/${encodeURIComponent(doc.id)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="appendix-action"
                    >
                      View PDF
                    </a>
                  ) : (
                    row.emptyText || 'Not Uploaded'
                  )}
                </td>
              </tr>
            );
          })}
          {additionalDocuments.map((doc, index) => (
            <tr key={doc.id}>
              <td>{rows.length + index + 1}</td>
              <td>{doc.title}</td>
              <td>
                <a
                  href={`/api/public/mandatory-disclosure/${encodeURIComponent(doc.id)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="appendix-action"
                >
                  View PDF
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function resultRowsForClass(rows, resultClass) {
  const classRows = (Array.isArray(rows) ? rows : [])
    .filter((row) => row.resultClass === resultClass)
    .sort((a, b) => a.year.localeCompare(b.year));

  if (classRows.length > 0) return classRows;

  return defaultResultYears.map((year) => ({
    id: `${resultClass}-${year}`,
    year,
    registeredStudents: '--',
    studentsPassed: '--',
    passPercentage: '--',
    remarks: 'NA',
  }));
}

function ResultClassTable({ title, rows }) {
  return (
    <>
      <h3 className="appendix-result-title">{title}</h3>
      <div className="appendix-table-wrap">
        <table className="appendix-table">
          <thead>
            <tr>
              <th>SL No.</th>
              <th>Year</th>
              <th>No. of Registered Students</th>
              <th>No. of Students Passed</th>
              <th>Pass Percentage</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id || `${title}-${row.year}-${index}`}>
                <td>{index + 1}</td>
                <td>{valueOrNA(row.year)}</td>
                <td>{row.registeredStudents || '--'}</td>
                <td>{row.studentsPassed || '--'}</td>
                <td>{row.passPercentage || '--'}</td>
                <td>{row.remarks || 'NA'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function AppendixCard({ title, children }) {
  return (
    <article className="appendix-card">
      <h2>{title}</h2>
      {children}
    </article>
  );
}

export default function DisclosuresPage() {
  const [info, setInfo] = useState(normalizePublicDisclosureInfo());
  const [documents, setDocuments] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/public/public-disclosures', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        setInfo(normalizePublicDisclosureInfo(data.info));
        setDocuments(Array.isArray(data.documents) ? data.documents : []);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const additionalBDocuments = documents
    .filter((doc) => doc.category === ADDITIONAL_B_CATEGORY)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const mainDocuments = documents.filter((doc) => doc.category !== ADDITIONAL_B_CATEGORY);

  return (
    <>
      <section className="page-hero page-hero-building">
        <div className="page-hero-content">
          <h1 className="page-hero-title">Mandatory Public Disclosures</h1>
          <p className="page-hero-desc">CBSE Appendix IX information and documents for Vasundhara Academy.</p>
        </div>
      </section>

      <section className="appendix-disclosures-section">
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Appendix IX</span>
          <h2 className="section-title">Public Disclosures</h2>
        </div>

        <div className="appendix-card-stack">
          {!loaded && (
            <div className="appendix-loading">
              <i className="fas fa-spinner fa-spin"></i> Loading disclosures...
            </div>
          )}

          <AppendixCard title="A: GENERAL INFORMATION">
            <InfoTable rows={generalInformationRows} info={info} />
          </AppendixCard>

          {appendixDocumentSections.map((section) => (
            <AppendixCard key={section.key} title={section.title}>
              <DocumentTable
                rows={section.rows}
                documents={mainDocuments}
                additionalDocuments={section.key === 'documents' ? additionalBDocuments : []}
              />
              {section.key === 'academics' && (
                <>
                  <ResultClassTable title="RESULT CLASS: X" rows={resultRowsForClass(info.resultRows, 'Class X')} />
                  <ResultClassTable title="RESULT CLASS: XII" rows={resultRowsForClass(info.resultRows, 'Class XII')} />
                </>
              )}
            </AppendixCard>
          ))}

          <AppendixCard title="D: STAFF TEACHING">
            <InfoTable rows={staffTeachingRows} info={info} />
          </AppendixCard>

          <AppendixCard title="E: SCHOOL INFRASTRUCTURE">
            <InfoTable rows={infrastructureRows} info={info} />
          </AppendixCard>
        </div>
      </section>
    </>
  );
}
