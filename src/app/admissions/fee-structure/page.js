import Link from 'next/link';
import '@/styles/about.css';
import '@/styles/phase5.css';

export const metadata = { title: 'Fee Structure' };

export default function FeeStructurePage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
<h1 className="page-hero-title">Fee Structure</h1>
          <p className="page-hero-desc">Transparent and affordable fee structure for all grades.</p>
        </div>
      </section>

      <section style={{ padding: '5rem 0', background: 'var(--white)' }}>
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Fee Details</span>
          <h2 className="section-title">Grade-wise Fee Structure 2026-27</h2>
        </div>
        <div className="fee-grid">
          <div className="fee-card">
            <h3><i className="fas fa-seedling" style={{ color: 'var(--gold)', marginRight: '0.5rem' }}></i>Grade 1 - 5 (Primary)</h3>
            <div className="fee-row"><span>Admission Fee (One-time)</span><span>Contact Office</span></div>
            <div className="fee-row"><span>Tuition Fee (Annual)</span><span>Contact Office</span></div>
            <div className="fee-row"><span>Activity Fee</span><span>Contact Office</span></div>
            <div className="fee-row"><span>Examination Fee</span><span>Contact Office</span></div>
            <div className="fee-row"><span>Computer Lab Fee</span><span>Contact Office</span></div>
            <div className="fee-total">
              <div className="fee-row"><span>Total Annual Fee</span><span>Contact Office for Details</span></div>
            </div>
          </div>

          <div className="fee-card">
            <h3><i className="fas fa-atom" style={{ color: 'var(--gold)', marginRight: '0.5rem' }}></i>Grade 6 - 8 (Middle)</h3>
            <div className="fee-row"><span>Admission Fee (One-time)</span><span>Contact Office</span></div>
            <div className="fee-row"><span>Tuition Fee (Annual)</span><span>Contact Office</span></div>
            <div className="fee-row"><span>Activity Fee</span><span>Contact Office</span></div>
            <div className="fee-row"><span>Examination Fee</span><span>Contact Office</span></div>
            <div className="fee-row"><span>Lab Fee (Science + Computer)</span><span>Contact Office</span></div>
            <div className="fee-total">
              <div className="fee-row"><span>Total Annual Fee</span><span>Contact Office for Details</span></div>
            </div>
          </div>

          <div className="fee-card">
            <h3><i className="fas fa-graduation-cap" style={{ color: 'var(--gold)', marginRight: '0.5rem' }}></i>Grade 9 - 10 (Secondary)</h3>
            <div className="fee-row"><span>Admission Fee (One-time)</span><span>Contact Office</span></div>
            <div className="fee-row"><span>Tuition Fee (Annual)</span><span>Contact Office</span></div>
            <div className="fee-row"><span>Activity Fee</span><span>Contact Office</span></div>
            <div className="fee-row"><span>Board Exam Fee (Grade 10)</span><span>As per CBSE</span></div>
            <div className="fee-row"><span>Lab Fee (Science + Computer)</span><span>Contact Office</span></div>
            <div className="fee-total">
              <div className="fee-row"><span>Total Annual Fee</span><span>Contact Office for Details</span></div>
            </div>
          </div>

          <div className="fee-card">
            <h3><i className="fas fa-bus" style={{ color: 'var(--gold)', marginRight: '0.5rem' }}></i>Transport & Hostel</h3>
            <div className="fee-row"><span>Transport Fee (Monthly)</span><span>Based on Distance</span></div>
            <div className="fee-row"><span>Hostel Fee (Annual)</span><span>Contact Office</span></div>
            <div className="fee-row"><span>Mess Charges (Monthly)</span><span>Contact Office</span></div>
          </div>
        </div>
        <div className="container text-center" style={{ marginTop: '2rem' }}>
          <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>
            <i className="fas fa-info-circle" style={{ marginRight: '0.3rem' }}></i>
            For exact fee details, please contact the school office or call +91 98819 45960.
            Fee amounts will be updated through the admin panel.
          </p>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/admissions/apply" className="btn btn-primary">
              <i className="fas fa-pen"></i> Apply Online
            </Link>
            <Link href="/contact" className="btn btn-outline">
              <i className="fas fa-phone"></i> Contact Office
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
