import '@/styles/about.css';
import '@/styles/phase5.css';

export const metadata = { title: 'Fee Structure' };

export default function FeeStructurePage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-hero-title">Fee Structure</h1>
          <p className="page-hero-desc">Fee structure for the academic year 2026-27.</p>
        </div>
      </section>

      <section style={{ padding: 'clamp(3rem, 7vw, 5rem) 0', background: 'var(--off-white)' }}>
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Fee Details</span>
          <h2 className="section-title">Fee Structure 2026-27</h2>

          <div style={{ maxWidth: '980px', margin: '2rem auto 0' }}>
            <div style={{ background: 'var(--white)', border: '1px solid rgba(10, 22, 40, 0.1)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'clamp(0.5rem, 2vw, 1.25rem)', overflow: 'hidden' }}>
              <img
                src="/images/admissions/fee-structure-2026-27.png"
                alt="Vasundhara Academy fee structure for the academic year 2026-27"
                width="1653"
                height="2339"
                style={{ display: 'block', width: '100%', maxWidth: '100%', height: 'auto', objectFit: 'contain', margin: '0 auto' }}
              />
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
