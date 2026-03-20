import Link from 'next/link';
import '@/styles/about.css';

export const metadata = { title: 'Awards & Recognition' };

export default function AwardsPage() {
  const awards = [
    { title: 'Expert Abacus State Level Competition', desc: 'Our students won at the State Level Expert Abacus Competition, showcasing exceptional mental arithmetic skills.', img: '/images/school-photo-1.jpg' },
    { title: 'SOF Olympiad Achievers', desc: 'Multiple students recognized as award winners in Science Olympiad Foundation competitions.', img: '/images/school-photo-2.jpg' },
    { title: 'Academic Excellence', desc: 'Consistent outstanding results in CBSE board examinations with exceptional pass rates.', img: '/images/school-photo-3.jpg' },
  ];

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-hero-title">Awards & Recognition</h1>
          <p className="page-hero-desc">Celebrating our students&apos; achievements and school milestones.</p>
        </div>
      </section>

      <section className="awards-section">
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Our Pride</span>
          <h2 className="section-title">Achievements & Milestones</h2>
        </div>
        <div className="awards-grid">
          {awards.map((a, i) => (
            <div key={i} className="award-card">
              <img src={a.img} alt={a.title} className="award-img" />
              <div className="award-body">
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
