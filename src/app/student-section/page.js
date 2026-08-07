import Link from 'next/link';
import '@/styles/about.css';
import '@/styles/phase5.css';

export const metadata = {
  title: 'Student Life & Activities | Vasundhara Academy Akole',
  description: 'Experience a vibrant student life at Vasundhara Academy Akole. Explore our morning assembly, sports, co-curricular activities, and holistic development programs.',
};

const sections = [
  { icon: 'fas fa-sun', title: 'Morning Assembly', desc: 'The school day begins with the morning assembly at 9:55 a.m. It helps students imbibe moral and ethical principles through prayers and collaborative activities.', items: ['National Anthem, Pledge, Preamble', 'State Song & Prayer', 'News, Current Affairs & Amazing Facts', 'Importance of the Day talks', 'Skits, Poems, and Group Performances', 'Platform for every child to showcase talent'] },
  { icon: 'fas fa-futbol', title: 'Sports & Fitness', desc: 'Physical fitness is an essential part of students’ overall development. We emphasize regular physical training, yoga, and a wide variety of games.', items: ['Regular physical training sessions', 'Yoga and meditation for mental well-being', 'Coaching in various indoor/outdoor games', 'Emphasis on strength, stamina, and discipline', 'Inter-school sports competitions', 'Focus on teamwork and sportsmanship'] },
  { icon: 'fas fa-palette', title: 'Co-curricular Activities', desc: 'We believe in holistic development through a wide range of academic and creative activities conducted throughout the year.', items: ['Debates, Elocution & Essay Writing', 'Drawing, Quizzes & Cultural Programs', 'Science Exhibitions & Educational Tours', 'National Festival Celebrations', 'Social Awareness Initiatives', 'Annual Cultural Gathering'] },
  { icon: 'fas fa-brain', title: 'Activity Based Learning', desc: 'Making education interactive and student-centered through projects, experiments, and hands-on experiences.', items: ['Project-based conceptual understanding', 'Scientific experiments and models', 'Student presentations and group work', 'Educational games and simulations', 'Hands-on practical learning', 'Better retention of knowledge'] },
  { icon: 'fas fa-calendar-star', title: 'Celebrations', desc: 'We celebrate cultural unity and national pride through various festivals and important school events.', items: ['Independence Day & Republic Day', 'Teachers’ Day & Children’s Day', 'Environment Day & International Yoga Day', 'Cultural Festivals & Annual Functions', 'Thematic days and awareness weeks', 'Unity and patriotism building events'] },
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
