import Link from 'next/link';
import '@/styles/about.css';
import '@/styles/phase5.css';

export const metadata = {
  title: 'Admissions',
  description: 'Admission process, fee structure, and online application for Vasundhara Academy.',
};

export default function AdmissionsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-hero-title">Admissions 2026-27</h1>
          <p className="page-hero-desc">Join the Vasundhara family. Admissions open for Grade 1 to 10.</p>
        </div>
      </section>

      {/* Quick Links */}
      <section style={{ padding: '4rem 0', background: 'var(--white)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
            <Link href="/admissions/process" className="highlight-card" style={{ textAlign: 'center' }}>
              <div className="highlight-icon" style={{ margin: '0 auto 1rem' }}><i className="fas fa-list-ol"></i></div>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy)' }}>Admission Process</h3>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>Step-by-step guide</p>
            </Link>
            <Link href="/admissions/fee-structure" className="highlight-card" style={{ textAlign: 'center' }}>
              <div className="highlight-icon" style={{ margin: '0 auto 1rem' }}><i className="fas fa-rupee-sign"></i></div>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy)' }}>Fee Structure</h3>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>Grade-wise fee details</p>
            </Link>
            <Link href="/admissions/apply" className="highlight-card" style={{ textAlign: 'center', borderColor: 'var(--gold)' }}>
              <div className="highlight-icon" style={{ margin: '0 auto 1rem', background: 'var(--gold)', color: 'var(--navy)' }}><i className="fas fa-pen"></i></div>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy)' }}>Apply Online</h3>
              <p style={{ color: 'var(--gold)', fontSize: '0.85rem', fontWeight: 600 }}>Start application now</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="comp-section" style={{ background: 'var(--off-white)' }}>
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Quick Info</span>
          <h2 className="section-title">Admission Highlights</h2>
        </div>
        <div className="comp-grid">
          <div className="comp-card">
            <h3><i className="fas fa-calendar-check"></i> Eligibility</h3>
            <ul>
              <li>Grade 1: Minimum 5 years of age as on 31st March</li>
              <li>Grade 2-10: Age-appropriate admission</li>
              <li>Transfer Certificate from previous school required</li>
              <li>No entrance test for Grade 1-5</li>
            </ul>
          </div>
          <div className="comp-card">
            <h3><i className="fas fa-file-alt"></i> Documents Required</h3>
            <ul>
              <li>Birth Certificate</li>
              <li>Aadhar Card of student and parent</li>
              <li>Transfer Certificate (TC)</li>
              <li>Previous year mark sheet</li>
              <li>4 passport-size photographs</li>
              <li>Caste certificate (if applicable)</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
