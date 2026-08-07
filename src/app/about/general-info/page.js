import Link from 'next/link';
import '@/styles/about.css';

export const metadata = {
  title: 'School General Information | Vasundhara Academy Akole',
  description: 'Quick facts about Vasundhara Academy Akole: CBSE affiliation, school timings, English medium instruction, and contact details.',
};

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
            <p>Abhinav Shikshan Sanstha&apos;s<br /><strong>Vasundhara Academy</strong></p>
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
              <div className="info-card-icon"><i className="fas fa-hashtag"></i></div>
              <h3>School Code</h3>
            </div>
            <p><strong>30623</strong></p>
          </div>
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><i className="fas fa-fingerprint"></i></div>
              <h3>UDISE Number</h3>
            </div>
            <p><strong>27260100120</strong></p>
          </div>
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><i className="fas fa-map-marker-alt"></i></div>
              <h3>Address</h3>
            </div>
            <p>
              Dhamangaon Awari Road, Akole,<br />
              Tal. Akole, Dist. Ahilyanagar,<br />
              PIN–422601, Maharashtra, India
            </p>
          </div>
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><i className="fas fa-graduation-cap"></i></div>
              <h3>Grades Offered</h3>
            </div>
            <p>Preschool, Grade 1 to Grade 10 (CBSE Curriculum)</p>
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
            <p>Monday to Saturday<br />9:00 AM to 3:30 PM</p>
          </div>
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><i className="fas fa-briefcase"></i></div>
              <h3>Administrative Office Time</h3>
            </div>
            <p>9:00 AM to 5:00 PM</p>
          </div>
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><i className="fas fa-phone-alt"></i></div>
              <h3>Contact</h3>
            </div>
            <p>
              Mr. Mayur Wakchaure sir: 96655557795<br />
              Ms. Gaje Mam: 9075735191<br /><br />
              Email: vasundhara.academy2016@gmail.com
            </p>
          </div>
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon"><i className="fas fa-users"></i></div>
              <h3>Managing Body</h3>
            </div>
            <p>Abhinav Shikshan Sanstha, Akole<br />Dist. Ahilyanagar, Maharashtra</p>
          </div>
        </div>
      </section>
    </>
  );
}
