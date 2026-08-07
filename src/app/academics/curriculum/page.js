import Link from 'next/link';
import '@/styles/about.css';
import '@/styles/phase4.css';

export const metadata = {
  title: 'CBSE Curriculum & Academic Structure | Vasundhara Academy',
  description: 'Learn about our rigorous CBSE curriculum, foundational to secondary stages, and our competency-based assessment system at Vasundhara Academy Akole.',
};

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
          <h2 className="section-title">Academic Structure & Pedagogy</h2>
          <p className="section-subtitle" style={{ maxWidth: '800px', margin: '0 auto 3rem' }}>
            Our curriculum is thoughtfully designed in alignment with CBSE guidelines and the vision of NEP 2020, 
            aiming to nurture confident, responsible, and future-ready learners.
          </p>
        </div>
        <div className="curriculum-grid">
          <div className="curriculum-card">
            <div className="curriculum-card-header">
              <div className="curriculum-icon"><i className="fas fa-seedling"></i></div>
              <h3>Foundational Stage (Pre-Primary)</h3>
            </div>
            <p>At this stage, learning is joyful, exploratory, and child-centric. We use the play-way method and activity-based learning to nurture early literacy, numeracy, and motor skills.</p>
            <div className="curriculum-subjects">
              <span>Language Dev</span><span>Numeracy</span><span>Motor Skills</span><span>Social & Emotional</span><span>Play-way</span><span>Storytelling</span>
            </div>
          </div>
          <div className="curriculum-card">
            <div className="curriculum-card-header">
              <div className="curriculum-icon"><i className="fas fa-book-reader"></i></div>
              <h3>Preparatory Stage (Classes I – V)</h3>
            </div>
            <p>Focuses on strong foundational literacy and numeracy through experiential learning. Introduction of smart boards and visual aids to make learning immersive.</p>
            <div className="curriculum-subjects">
              <span>English</span><span>Maths</span><span>EVS</span><span>Hindi/Regional</span><span>Computer</span><span>Art & Craft</span><span>PE & Yoga</span><span>Marathi</span>
            </div>
          </div>
          <div className="curriculum-card">
            <div className="curriculum-card-header">
              <div className="curriculum-icon"><i className="fas fa-atom"></i></div>
              <h3>Middle Stage (Classes VI – VIII)</h3>
            </div>
            <p>Focuses on conceptual clarity and analytical thinking via inquiry-based learning. Introduction of Skill-Based subjects like AI and Coding.</p>
            <div className="curriculum-subjects">
              <span>English</span><span>Hindi</span><span>Marathi</span><span>Maths</span><span>Science</span><span>Social Science</span><span>IT</span><span>AI</span><span>Coding</span><span>Lab Work</span>
            </div>
          </div>
          <div className="curriculum-card">
            <div className="curriculum-card-header">
              <div className="curriculum-icon"><i className="fas fa-graduation-cap"></i></div>
              <h3>Secondary Stage (Classes IX – X)</h3>
            </div>
            <p>Rigorous preparation for CBSE Board Examinations with competency-based learning. Regular mock tests, career guidance, and counseling sessions.</p>
            <div className="curriculum-subjects">
              <span>English</span><span>Maths</span><span>Science</span><span>Social Science</span><span>Hindi</span><span>IT</span><span>Marathi</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about-welcome" style={{ backgroundColor: 'var(--gray-50)' }}>
        <div className="about-welcome-inner">
          <span className="section-tag"><i className="fas fa-minus"></i> Highlights</span>
          <h2 className="section-title">Curriculum Highlights</h2>
          <div className="about-welcome-text">
            <ul style={{ paddingLeft: '1.5rem', marginTop: '1.5rem' }}>
              <li style={{ marginBottom: '1rem' }}><strong>Competency-based education</strong> focusing on real-life application and critical thinking.</li>
              <li style={{ marginBottom: '1rem' }}><strong>Experiential and project-based learning</strong> approach to encourage discovery.</li>
              <li style={{ marginBottom: '1rem' }}><strong>Integration of digital tools</strong> and smart classrooms across all stages.</li>
              <li style={{ marginBottom: '1rem' }}><strong>Inclusive education</strong> catering to diverse learners and learning styles.</li>
              <li style={{ marginBottom: '1rem' }}><strong>Strong emphasis on values</strong>, ethics, and life skills for holistic character building.</li>
              <li style={{ marginBottom: '1rem' }}><strong>Co-Curricular Integration:</strong> Learning goes beyond textbooks through Clubs (Science, Eco, Language), Sports, Arts, and Olympiads.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="about-welcome">
        <div className="about-welcome-inner">
          <span className="section-tag"><i className="fas fa-minus"></i> Assessment</span>
          <h2 className="section-title">Evaluation System</h2>
          <div className="about-welcome-text">
            <p>We follow a <strong>Continuous and Comprehensive Evaluation (CCE)</strong> approach to track student performance and provide regular feedback.</p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
              <li><strong>Periodic Tests (PT)</strong> for regular assessment.</li>
              <li><strong>Portfolio & Notebook Submission</strong> to track consistency.</li>
              <li><strong>Subject Enrichment Activities</strong> (Projects, Practicals, Experimentations, Argumentation, Inquiry, Exploration etc).</li>
              <li><strong>Half-Yearly and Annual Exams</strong> as per CBSE norms.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
