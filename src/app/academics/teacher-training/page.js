import Link from 'next/link';
import '@/styles/about.css';

export const metadata = { title: 'Teacher Training' };

const trainings = [
  { icon: 'fas fa-laptop', title: 'ICT Integration Training', desc: 'Training teachers to effectively use technology, smart boards, and digital tools in classroom teaching for enhanced student engagement.' },
  { icon: 'fas fa-brain', title: 'NEP 2020 Workshops', desc: 'Workshops on implementing National Education Policy guidelines including competency-based learning, experiential education, and multidisciplinary approach.' },
  { icon: 'fas fa-chalkboard-teacher', title: 'Pedagogical Skills', desc: 'Regular training on modern teaching methodologies, activity-based learning, and differentiated instruction strategies.' },
  { icon: 'fas fa-heart', title: 'Child Psychology & Counseling', desc: 'Equipping teachers with skills to understand student behavior, handle classroom challenges, and provide basic emotional support.' },
  { icon: 'fas fa-universal-access', title: 'Inclusive Education', desc: 'Training on handling diverse learning needs, identifying learning disabilities, and creating inclusive classroom environments.' },
  { icon: 'fas fa-fire-extinguisher', title: 'Safety & First Aid', desc: 'Regular fire safety drills, first aid training, and emergency response procedures for all staff members.' },
];

export default function TeacherTrainingPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
<h1 className="page-hero-title">Teacher Training & Development</h1>
          <p className="page-hero-desc">Continuous professional development for our educators.</p>
        </div>
      </section>

      <section className="info-section">
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Training Programs</span>
          <h2 className="section-title">Empowering Our Educators</h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            We invest in our teachers&apos; growth through regular training workshops, seminars, and professional
            development programs aligned with CBSE and NEP 2020 guidelines.
          </p>
        </div>
        <div className="info-grid">
          {trainings.map((t, i) => (
            <div key={i} className="info-card">
              <div className="info-card-header">
                <div className="info-card-icon"><i className={t.icon}></i></div>
                <h3>{t.title}</h3>
              </div>
              <p>{t.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
