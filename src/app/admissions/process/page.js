import Link from 'next/link';
import '@/styles/about.css';
import '@/styles/phase5.css';

export const metadata = { title: 'Admission Process' };

const steps = [
  { num: '1', title: 'Enquiry & Campus Visit', desc: 'Visit the school office or contact us to learn about our academic programs and facilities. Parents can collect the school brochure and application form directly from the office.' },
  { num: '2', title: 'Application Submission', desc: "Submit the completely filled admission form along with required documents like Birth Certificate (for Preschool and Grade I), School Leaving Certificate, Student's Aadhar, Father's Aadhar, and Mother's Aadhar details." },
  { num: '3', title: 'Verification & Interaction', desc: 'Our team will verify the submitted documents. This is followed by an informal interaction with the student and parents.' },
  { num: '4', title: 'Admission Confirmation', desc: 'Confirmation is based on document verification, interaction outcomes, and availability of seats as per school guidelines.' },
  { num: '5', title: 'Payment of Fees', desc: 'Once confirmed, complete the admission formalities by paying the necessary fees at the school office.' },
  { num: '6', title: 'Welcome to Vasundhara', desc: 'Join the Vasundhara family! Receive the school calendar, uniform details, and transportation info to begin your journey.' },
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
