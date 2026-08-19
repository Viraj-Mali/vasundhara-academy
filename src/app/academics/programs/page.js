import '@/styles/about.css';
import '@/styles/phase4.css';
import AcademicProgramCards from './AcademicProgramCards';

export const metadata = {
  title: 'Co-curricular & Enrichment Programs | Vasundhara Academy',
  description: 'Explore our wide range of programs including Abacus training, Olympiad preparation, sports coaching, art, music, and yoga at Vasundhara Academy Akole.',
};

export default function ProgramsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
<h1 className="page-hero-title">Academic Programs</h1>
          <p className="page-hero-desc">Co-curricular and enrichment programs for all-round development.</p>
        </div>
      </section>

      <section className="facilities-section">
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Programs</span>
          <h2 className="section-title">Beyond the Classroom</h2>
        </div>
        <AcademicProgramCards />
      </section>
    </>
  );
}
