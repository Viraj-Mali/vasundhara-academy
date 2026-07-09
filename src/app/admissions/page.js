import Link from 'next/link';
import '@/styles/about.css';
import '@/styles/phase5.css';

export const metadata = {
  title: 'Admissions 2026-27 | School Admission in Akole',
  description: 'Apply for admission at Vasundhara Academy Akole for the 2026-27 academic year. Learn about our simple, transparent admission process, fee structure, and online application.',
};

export default function AdmissionsPage() {
  return (
    <>
      <section className="page-hero page-hero-building">
        <div className="page-hero-content">
          <h1 className="page-hero-title">Admissions 2026-27</h1>
          <p className="page-hero-desc">Join the Vasundhara family. Admissions open for Grade 1 to 10 in Akole.</p>
        </div>
      </section>

      {/* Quick Links */}
      <section style={{ padding: '4rem 0', background: 'var(--white)' }}>
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: '3rem' }}>
            <span className="section-tag"><i className="fas fa-minus"></i> Enroll Now</span>
            <h2 className="section-title">Start Your Child&apos;s Journey</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <Link href="/admissions/process" className="highlight-card" style={{ textAlign: 'center' }}>
              <div className="highlight-icon" style={{ margin: '0 auto 1rem' }}><i className="fas fa-list-ol"></i></div>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy)' }}>Admission Process</h3>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>Step-by-step guide to join us</p>
            </Link>
            <Link href="/admissions/fee-structure" className="highlight-card" style={{ textAlign: 'center' }}>
              <div className="highlight-icon" style={{ margin: '0 auto 1rem' }}><i className="fas fa-rupee-sign"></i></div>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy)' }}>Fee Structure</h3>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>Grade-wise fee and payment details</p>
            </Link>
            <Link href="/admissions/apply" className="highlight-card" style={{ textAlign: 'center', borderColor: 'var(--gold)' }}>
              <div className="highlight-icon" style={{ margin: '0 auto 1rem', background: 'var(--gold)', color: 'var(--navy)' }}><i className="fas fa-pen"></i></div>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy)' }}>Apply Online</h3>
              <p style={{ color: 'var(--gold)', fontSize: '0.85rem', fontWeight: 600 }}>Fill admission form online</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="comp-section" style={{ background: 'var(--off-white)' }}>
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Essential Info</span>
          <h2 className="section-title">Admission Process & Requirements</h2>
        </div>
        <div className="comp-grid">
          <div className="comp-card">
            <h3><i className="fas fa-calendar-check"></i> Eligibility Criteria</h3>
            <ul>
              <li>Grade 1: Minimum 5 years of age as on 31st March of the admission year</li>
              <li>Grade 2-10: Age-appropriate admission as per CBSE guidelines</li>
              <li>Valid Transfer Certificate (TC) from previous recognized school</li>
              <li>Personal interview and basic interaction for assessment</li>
            </ul>
          </div>
          <div className="comp-card">
            <h3><i className="fas fa-file-alt"></i> Documents Required</h3>
            <ul>
              <li>Completely filled Admission Application Form</li>
              <li>Original Birth Certificate for primary admissions</li>
              <li>Original School Leaving Certificate (SLC/TC)</li>
              <li>Previous year marksheet or academic progress report</li>
              <li>5 recent passport-size color photographs of the student</li>
              <li>Aadhar Card copies of the Student and both Parents</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
