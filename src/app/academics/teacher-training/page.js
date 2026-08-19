import '@/styles/about.css';
import TeacherTrainingCards from './TeacherTrainingCards';

export const metadata = {
  title: 'Teacher Training & Professional Development | Vasundhara Academy',
  description: 'Our educators undergo regular training in ICT integration, NEP 2020 workshops, and pedagogical skills to provide the best learning experience at Vasundhara Academy Akole.',
};

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
        <TeacherTrainingCards />
      </section>
    </>
  );
}
