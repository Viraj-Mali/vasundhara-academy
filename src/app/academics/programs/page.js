import Link from 'next/link';
import '@/styles/about.css';
import '@/styles/phase4.css';

export const metadata = { title: 'Academic Programs' };

const programs = [
  { title: 'Expert Abacus Training', category: 'Enrichment', desc: 'Mental arithmetic program that builds concentration, speed, and problem-solving skills. Our students regularly win at state-level competitions.' },
  { title: 'SOF Olympiad Preparation', category: 'Competitive', desc: 'Dedicated coaching for Science Olympiad Foundation exams in Science, Mathematics, English, and Cyber/IT.' },
  { title: 'Sports Program', category: 'Physical', desc: 'Comprehensive sports coaching in cricket, football, kho-kho, kabaddi, athletics, and indoor games with professional coaches.' },
  { title: 'Art & Craft Program', category: 'Creative', desc: 'Creative expression through drawing, painting, clay modeling, origami, and various art forms to nurture imagination.' },
  { title: 'Music & Dance', category: 'Cultural', desc: 'Training in vocal music, instrumental music, classical and folk dance forms to develop cultural appreciation.' },
  { title: 'Yoga & Meditation', category: 'Wellness', desc: 'Regular yoga and meditation sessions for physical fitness, mental clarity, and emotional balance.' },
  { title: 'Science Club', category: 'Academic', desc: 'Hands-on experiments, science projects, and exhibition preparation to develop scientific thinking and innovation.' },
  { title: 'Eco Club', category: 'Environmental', desc: 'Environmental awareness programs including tree plantation drives, waste management projects, and nature walks.' },
  { title: 'Literary Club', category: 'Academic', desc: 'Debates, essay writing, poetry recitation, storytelling, and quiz competitions for language and communication skills.' },
];

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
        <div className="facilities-grid">
          {programs.map((p, i) => (
            <div key={i} className="facility-card">
              <div className="facility-img">
                <img src={`/images/school-photo-${(i % 3) + 1}.jpg`} alt={p.title} />
              </div>
              <div className="facility-body">
                <span className="facility-category">{p.category}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
