import Link from 'next/link';
import '@/styles/about.css';
import '@/styles/pages.css';

export const metadata = {
  title: 'Why Vasundhara Academy',
  description: 'Discover why Vasundhara Academy stands apart — the right curriculum, faculty, environment, approach, and skills.',
};

export default function WhyVasundharaPage() {
  const reasons = [
    {
      num: '01',
      title: 'The Right Curriculum',
      desc: 'Our CBSE-aligned curriculum is carefully designed to foster critical thinking, creativity, and conceptual understanding. We go beyond rote learning to develop students who can apply knowledge in real-world situations.',
      tags: ['CBSE Curriculum', 'Conceptual Learning', 'Holistic Education'],
    },
    {
      num: '02',
      title: 'The Right Faculty',
      desc: 'Our team of 50+ experienced and passionate educators brings expertise, empathy, and innovation to the classroom. Every teacher is committed to understanding each student\'s unique learning needs and helping them excel.',
      tags: ['50+ Educators', 'Trained Professionals', 'Mentoring'],
    },
    {
      num: '03',
      title: 'The Right Environment',
      desc: 'Set in the scenic town of Akole, our campus provides a safe, green, and stimulating environment perfect for learning. Smart classrooms, science labs, computer labs, and expansive sports facilities create the ideal setting for growth.',
      tags: ['Smart Classrooms', 'Science Labs', 'Sports Grounds'],
    },
    {
      num: '04',
      title: 'The Right Approach',
      desc: 'We believe in nurturing the whole child — academically, socially, emotionally, and physically. Our approach combines modern teaching methodologies with traditional Indian values. Activity-based learning, project work, and experiential education define our teaching philosophy.',
      tags: ['Activity-Based Learning', 'Value Education', 'Experiential'],
    },
    {
      num: '05',
      title: 'The Right Skills',
      desc: 'Beyond academics, we equip students with essential life skills — leadership, teamwork, communication, critical thinking, and emotional intelligence. Our students consistently shine in olympiads, abacus competitions, sports, and cultural events.',
      tags: ['Abacus Champions', 'Olympiad Winners', 'Leadership', 'Life Skills'],
    },
  ];

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
<h1 className="page-hero-title">Why Vasundhara Academy?</h1>
          <p className="page-hero-desc">Five reasons why families trust us with their children&apos;s future.</p>
        </div>
      </section>

      <section className="why-section">
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Our Difference</span>
          <h2 className="section-title">What Makes Us Stand Apart</h2>
        </div>
        <div className="why-grid">
          {reasons.map((r) => (
            <div key={r.num} className="why-item">
              <span className="why-num">{r.num}</span>
              <div>
                <h3>{r.title}</h3>
                <p>{r.desc}</p>
                <div className="why-item-features">
                  {r.tags.map((t) => <span key={t}>{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-inner">
          <div className="cta-content">
            <h2>Ready to Join the Vasundhara Family?</h2>
            <p>Experience the difference — schedule a campus visit or apply now.</p>
          </div>
          <div className="cta-btns">
            <Link href="/admissions/apply" className="btn btn-navy btn-lg">
              <i className="fas fa-file-alt"></i> Apply Now
            </Link>
            <Link href="/contact" className="btn btn-outline btn-lg" style={{ borderColor: 'var(--navy)', color: 'var(--navy)' }}>
              <i className="fas fa-phone"></i> Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
