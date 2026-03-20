import Link from 'next/link';
import '@/styles/about.css';
import '@/styles/phase4.css';

export const metadata = { title: 'Curriculum' };

export default function CurriculumPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
<h1 className="page-hero-title">CBSE Curriculum</h1>
          <p className="page-hero-desc">A rigorous yet balanced approach to learning excellence.</p>
        </div>
      </section>

      <section className="curriculum-section">
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Our Curriculum</span>
          <h2 className="section-title">Grade-wise Academic Structure</h2>
        </div>
        <div className="curriculum-grid">
          <div className="curriculum-card">
            <div className="curriculum-card-header">
              <div className="curriculum-icon"><i className="fas fa-seedling"></i></div>
              <h3>Grade 1 & 2 — Foundation</h3>
            </div>
            <p>Play-based and activity-based learning to develop fine motor skills, language, and early numeracy. Focus on curiosity, creativity, and social skills.</p>
            <div className="curriculum-subjects">
              <span>English</span><span>Hindi</span><span>Mathematics</span><span>EVS</span><span>Art & Craft</span><span>PE</span><span>Music</span>
            </div>
          </div>
          <div className="curriculum-card">
            <div className="curriculum-card-header">
              <div className="curriculum-icon"><i className="fas fa-book-reader"></i></div>
              <h3>Grade 3-5 — Primary</h3>
            </div>
            <p>Strengthening core literacy and numeracy skills. Introduction of environmental studies, computer basics, and structured co-curricular activities.</p>
            <div className="curriculum-subjects">
              <span>English</span><span>Hindi</span><span>Mathematics</span><span>EVS</span><span>Computer</span><span>Art</span><span>PE</span><span>GK</span>
            </div>
          </div>
          <div className="curriculum-card">
            <div className="curriculum-card-header">
              <div className="curriculum-icon"><i className="fas fa-atom"></i></div>
              <h3>Grade 6-8 — Middle School</h3>
            </div>
            <p>Subject-specific deep learning with introduction of separate sciences, social studies components, and third language (Marathi). Lab work and project-based learning.</p>
            <div className="curriculum-subjects">
              <span>English</span><span>Hindi</span><span>Marathi</span><span>Maths</span><span>Science</span><span>Social Science</span><span>Computer</span><span>Art</span>
            </div>
          </div>
          <div className="curriculum-card">
            <div className="curriculum-card-header">
              <div className="curriculum-icon"><i className="fas fa-graduation-cap"></i></div>
              <h3>Grade 9-10 — Secondary</h3>
            </div>
            <p>CBSE board preparation with rigorous academics, regular assessments, and focused exam strategies. Career guidance and higher education counseling.</p>
            <div className="curriculum-subjects">
              <span>English</span><span>Hindi/Marathi</span><span>Mathematics</span><span>Science</span><span>Social Science</span><span>Information Technology</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
