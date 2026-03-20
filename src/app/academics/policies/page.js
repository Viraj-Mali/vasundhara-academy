import Link from 'next/link';
import '@/styles/about.css';

export const metadata = { title: 'Policies & Rules' };

const policies = [
  { icon: 'fas fa-clock', title: 'Attendance Policy', items: ['Minimum 75% attendance mandatory for all students', 'Prior written application for leaves exceeding 3 days', 'Late arrivals noted; 3 consecutive late marks result in parent notification', 'Medical leave requires doctor certificate'] },
  { icon: 'fas fa-user-check', title: 'Discipline & Code of Conduct', items: ['School uniform mandatory on all working days', 'Respect towards teachers, staff, and fellow students', 'Mobile phones strictly prohibited on campus', 'Bullying, ragging, or any form of harassment leads to strict action'] },
  { icon: 'fas fa-book', title: 'Examination Policy', items: ['Regular unit tests, half-yearly, and annual examinations', 'CBSE guidelines followed for evaluation and grading', 'No re-examination for absent students without valid medical reason', 'Academic progress report shared with parents quarterly'] },
  { icon: 'fas fa-shield-alt', title: 'Safety & Security', items: ['CCTV surveillance across campus', 'Authorized pickup only for students below Grade 5', 'Fire safety equipment and regular drills', 'Visitor registration mandatory at reception'] },
  { icon: 'fas fa-ban', title: 'Anti-Bullying Policy', items: ['Zero tolerance for bullying in any form', 'Dedicated grievance cell for complaints', 'Counseling provided to both parties', 'Strict disciplinary action for repeat offenders'] },
  { icon: 'fas fa-graduation-cap', title: 'Promotion Policy', items: ['Based on overall academic performance and attendance', 'Minimum passing marks as per CBSE guidelines', 'Co-curricular participation considered for overall grade', 'Detained students given additional support and re-evaluation chance'] },
];

export default function PoliciesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
<h1 className="page-hero-title">Policies & Rules</h1>
          <p className="page-hero-desc">Guidelines that ensure a safe, disciplined, and productive learning environment.</p>
        </div>
      </section>

      <section className="info-section">
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Guidelines</span>
          <h2 className="section-title">School Policies</h2>
        </div>
        <div className="info-grid">
          {policies.map((p, i) => (
            <div key={i} className="info-card">
              <div className="info-card-header">
                <div className="info-card-icon"><i className={p.icon}></i></div>
                <h3>{p.title}</h3>
              </div>
              <ul>
                {p.items.map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
