import Link from 'next/link';
import '@/styles/about.css';
import '@/styles/phase5.css';

export const metadata = {
  title: 'Student Section',
  description: 'Student life at Vasundhara Academy — discipline, hobbies, sports, and alumni.',
};

const sections = [
  { icon: 'fas fa-user-check', title: 'Student Discipline', desc: 'We believe discipline is the foundation of success. Our code of conduct instills values of respect, responsibility, and integrity in every student.', items: ['Uniform compliance mandatory', 'Punctuality and regular attendance', 'Respect for teachers and peers', 'No mobile phones on campus', 'Anti-bullying pledge by all students'] },
  { icon: 'fas fa-backpack', title: 'No School Bag Day', desc: 'Every Saturday is observed as "No School Bag Day" to reduce the physical burden on students and promote activity-based learning.', items: ['Saturdays designated as bag-free days', 'Activity-based and project learning', 'Sports, art, music, and life skills sessions', 'Storytelling and group discussions', 'Reduces physical strain on young students', 'Encourages creativity and expression'] },
  { icon: 'fas fa-palette', title: 'Hobbies & Co-Curricular', desc: 'Beyond textbooks, we encourage students to explore their creative side through various hobby clubs and activities.', items: ['Art & Craft Club', 'Music & Dance Club', 'Science & Innovation Club', 'Literary Club (Debates, Poetry)', 'Eco Club & Nature Walks', 'Photography Club'] },
  { icon: 'fas fa-futbol', title: 'Sports & Athletics', desc: 'Physical fitness and sportsmanship are integral parts of our educational philosophy.', items: ['Cricket & Football', 'Kho-Kho & Kabaddi', 'Athletics & Track Events', 'Indoor Games (Chess, Carrom, TT)', 'Annual Sports Day Competition', 'Inter-school tournaments'] },
  { icon: 'fas fa-graduation-cap', title: 'Alumni Network', desc: 'Our alumni are our pride. Many have gone on to excel in various fields, carrying the values and education of Vasundhara Academy.', items: ['Annual alumni meet', 'Mentorship programs for current students', 'Alumni success stories shared regularly', 'Career guidance sessions by alumni'] },
];

export default function StudentSectionPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
<h1 className="page-hero-title">Student Section</h1>
          <p className="page-hero-desc">Life beyond the classroom — discipline, creativity, sports, and connections.</p>
        </div>
      </section>

      <section style={{ padding: '5rem 0', background: 'var(--white)' }}>
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Student Life</span>
          <h2 className="section-title">Growing Beyond Academics</h2>
        </div>

        <div className="student-content-grid">
          {sections.map((s, i) => (
            <div key={i} className="student-card">
              <div className="student-card-icon"><i className={s.icon}></i></div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <ul>
                {s.items.map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <div className="cta-content">
            <h2>Want to Be Part of Our Family?</h2>
            <p>Apply for admission or register as an alumni to stay connected.</p>
          </div>
          <div className="cta-btns">
            <Link href="/admissions/apply" className="btn btn-navy btn-lg">
              <i className="fas fa-file-alt"></i> Apply Now
            </Link>
            <Link href="/alumni" className="btn btn-outline btn-lg" style={{ borderColor: 'var(--navy)', color: 'var(--navy)' }}>
              <i className="fas fa-users"></i> Alumni Registration
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
