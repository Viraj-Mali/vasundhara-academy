import Link from 'next/link';
import '@/styles/about.css';
import '@/styles/phase4.css';

export const metadata = {
  title: 'Academics',
  description: 'Explore the comprehensive CBSE curriculum and academic programs at Vasundhara Academy.',
};

export default function AcademicsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-hero-title">Academics</h1>
          <p className="page-hero-desc">
            CBSE curriculum excellence with innovative teaching and holistic development.
          </p>
        </div>
      </section>

      {/* Quick Cards */}
      <div className="academics-hero-cards">
        <Link href="/academics/curriculum" className="academics-hero-card">
          <i className="fas fa-book-open"></i>
          <h3>Curriculum</h3>
          <p>CBSE-aligned subjects and learning approach</p>
        </Link>
        <Link href="/academics/programs" className="academics-hero-card">
          <i className="fas fa-puzzle-piece"></i>
          <h3>Programs</h3>
          <p>Co-curricular and enrichment programs</p>
        </Link>
        <Link href="/academics/staff" className="academics-hero-card">
          <i className="fas fa-users"></i>
          <h3>Our Staff</h3>
          <p>Meet our experienced teaching team</p>
        </Link>
        <Link href="/academics/calendar" className="academics-hero-card">
          <i className="fas fa-calendar-alt"></i>
          <h3>Calendar</h3>
          <p>Academic year schedule and events</p>
        </Link>
      </div>

      {/* Curriculum Overview */}
      <section className="curriculum-section" style={{ paddingTop: '4rem' }}>
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Overview</span>
          <h2 className="section-title">Academic Framework</h2>
        </div>
        <div className="curriculum-grid">
          <div className="curriculum-card">
            <div className="curriculum-card-header">
              <div className="curriculum-icon"><i className="fas fa-seedling"></i></div>
              <h3>Primary (Grades 1-5)</h3>
            </div>
            <p>Building a strong foundation in literacy, numeracy, and general awareness through activity-based learning.</p>
            <div className="curriculum-subjects">
              <span>English</span><span>Hindi</span><span>Mathematics</span><span>EVS</span><span>Computer</span><span>Art</span><span>PE</span>
            </div>
          </div>
          <div className="curriculum-card">
            <div className="curriculum-card-header">
              <div className="curriculum-icon"><i className="fas fa-atom"></i></div>
              <h3>Middle (Grades 6-8)</h3>
            </div>
            <p>Deepening subject knowledge with analytical thinking, practical experiments, and project-based learning.</p>
            <div className="curriculum-subjects">
              <span>English</span><span>Hindi</span><span>Marathi</span><span>Maths</span><span>Science</span><span>Social Science</span><span>Computer</span>
            </div>
          </div>
          <div className="curriculum-card">
            <div className="curriculum-card-header">
              <div className="curriculum-icon"><i className="fas fa-flask"></i></div>
              <h3>Secondary (Grades 9-10)</h3>
            </div>
            <p>Board exam preparation with strong conceptual clarity, regular assessments, and focused guidance for higher education readiness.</p>
            <div className="curriculum-subjects">
              <span>English</span><span>Hindi</span><span>Maths</span><span>Science</span><span>Social Science</span><span>IT</span>
            </div>
          </div>
          <div className="curriculum-card">
            <div className="curriculum-card-header">
              <div className="curriculum-icon"><i className="fas fa-trophy"></i></div>
              <h3>Beyond Academics</h3>
            </div>
            <p>Co-curricular excellence through abacus training, olympiad preparation, sports coaching, and cultural activities.</p>
            <div className="curriculum-subjects">
              <span>Abacus</span><span>Olympiads</span><span>Sports</span><span>Arts</span><span>Music</span><span>Yoga</span>
            </div>
          </div>
        </div>
      </section>

      {/* Links */}
      <section style={{ padding: '3rem 0 5rem', background: 'var(--off-white)' }}>
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Explore</span>
          <h2 className="section-title">More in Academics</h2>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
            <Link href="/academics/policies" className="btn btn-primary"><i className="fas fa-scroll"></i> Policies & Rules</Link>
            <Link href="/academics/teacher-training" className="btn btn-outline"><i className="fas fa-chalkboard"></i> Teacher Training</Link>
            <Link href="/academics/staff" className="btn btn-outline"><i className="fas fa-users"></i> Our Staff</Link>
          </div>
        </div>
      </section>
    </>
  );
}
