import Link from 'next/link';
import '@/styles/about.css';
import '@/styles/phase5.css';

export const metadata = { title: 'Admission Process' };

const steps = [
  { num: '1', title: 'Enquiry & Campus Visit', desc: 'Contact the school office or visit the campus to learn about our programs, facilities, and academic approach. Schedule a tour with our admission team.' },
  { num: '2', title: 'Collect Application Form', desc: 'Obtain the admission form from the school office or download it from the website. You can also apply online through our portal.' },
  { num: '3', title: 'Submit Application', desc: 'Fill in the application form with all required details along with the necessary documents (Birth Certificate, Aadhar, TC, Photos).' },
  { num: '4', title: 'Interaction / Assessment', desc: 'An informal interaction with the student and parents. For Grade 6 and above, a basic assessment in English, Hindi, and Mathematics.' },
  { num: '5', title: 'Admission Confirmation', desc: 'Upon selection, complete the admission formalities by paying the registration fee and first installment of the annual fee.' },
  { num: '6', title: 'Welcome to Vasundhara', desc: 'Receive the welcome kit including uniform details, school calendar, bus routes, and student ID. Your child is now part of the Vasundhara family!' },
];

export default function ProcessPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
<h1 className="page-hero-title">Admission Process</h1>
          <p className="page-hero-desc">A simple 6-step process to join Vasundhara Academy.</p>
        </div>
      </section>

      <section style={{ padding: '5rem 0', background: 'var(--white)' }}>
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Process</span>
          <h2 className="section-title">How to Apply</h2>
        </div>
        <div className="admission-steps">
          {steps.map((s) => (
            <div key={s.num} className="admission-step">
              <div className="step-num">{s.num}</div>
              <div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="container text-center" style={{ marginTop: '2rem' }}>
          <Link href="/admissions/apply" className="btn btn-primary btn-lg">
            <i className="fas fa-pen"></i> Apply Online Now
          </Link>
        </div>
      </section>
    </>
  );
}
