import Link from 'next/link';
import '@/styles/about.css';

export const metadata = { title: 'General Information' };

export default function GeneralInfoPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-hero-title">School General Information</h1>
          <p className="page-hero-desc">Key details about Vasundhara Academy.</p>
        </div>
      </section>

      <section className="info-section">
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> School Details</span>
          <h2 className="section-title">At a Glance</h2>
        </div>
        <div className="info-grid">
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><i className="fas fa-school"></i></div>
              <h3>School Name</h3>
            </div>
            <p>Abhinav Education Society&apos;s<br /><strong>Vasundhara Academy</strong></p>
          </div>
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><i className="fas fa-certificate"></i></div>
              <h3>Affiliation</h3>
            </div>
            <p>
              CBSE Affiliation No: <strong>1130637</strong><br />
              Society Reg. No: <strong>MAHA/2143/ANR</strong>
            </p>
          </div>
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><i className="fas fa-map-marker-alt"></i></div>
              <h3>Address</h3>
            </div>
            <p>
              Dhamangaon Awari Road, Akole,<br />
              Tal. Akole, Dist. Ahmednagar,<br />
              PIN–422601, Maharashtra, India
            </p>
          </div>
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><i className="fas fa-graduation-cap"></i></div>
              <h3>Grades Offered</h3>
            </div>
            <p>Grade 1 to Grade 10 (CBSE Curriculum)</p>
          </div>
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><i className="fas fa-language"></i></div>
              <h3>Medium of Instruction</h3>
            </div>
            <p>English Medium</p>
          </div>
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><i className="fas fa-clock"></i></div>
              <h3>School Timings</h3>
            </div>
            <p>Monday to Saturday<br />8:00 AM to 3:30 PM</p>
          </div>
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><i className="fas fa-phone-alt"></i></div>
              <h3>Contact</h3>
            </div>
            <p>
              Phone: +91 98819 45960<br />
              Email: vasundhara.academy2016@gmail.com
            </p>
          </div>
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><i className="fas fa-users"></i></div>
              <h3>Managing Body</h3>
            </div>
            <p>Abhinav Education Society, Akole<br />Dist. Ahmednagar, Maharashtra</p>
          </div>
        </div>
      </section>
    </>
  );
}
