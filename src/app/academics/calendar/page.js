import Link from 'next/link';
import '@/styles/about.css';
import '@/styles/phase4.css';

export const metadata = { title: 'Academic Calendar' };

const months = [
  { name: 'April 2026', events: [
    { day: '01', label: 'Apr', title: 'New Academic Session Begins', desc: 'Grade 1-10' },
    { day: '14', label: 'Apr', title: 'Ambedkar Jayanti', desc: 'Holiday' },
  ]},
  { name: 'May 2026', events: [
    { day: '01', label: 'May', title: 'May Day / Workers Day', desc: 'Holiday' },
    { day: '10', label: 'May', title: 'Summer Break Begins', desc: 'Tentative' },
  ]},
  { name: 'June 2026', events: [
    { day: '15', label: 'Jun', title: 'School Reopens After Summer Break', desc: 'All Grades' },
    { day: '21', label: 'Jun', title: 'International Yoga Day', desc: 'Special Assembly' },
  ]},
  { name: 'July 2026', events: [
    { day: '01', label: 'Jul', title: 'Van Mahotsav Week', desc: 'Eco Club Activity' },
    { day: '15', label: 'Jul', title: 'First Unit Test', desc: 'Grade 1-10' },
  ]},
  { name: 'August 2026', events: [
    { day: '15', label: 'Aug', title: 'Independence Day Celebration', desc: 'Flag Hoisting & Cultural Program' },
    { day: '25', label: 'Aug', title: 'Half Yearly Exam Preparation', desc: 'Revision begins' },
  ]},
  { name: 'September 2026', events: [
    { day: '05', label: 'Sep', title: 'Teachers Day Celebration', desc: 'Special Program by Students' },
    { day: '15', label: 'Sep', title: 'Half Yearly Examinations Begin', desc: 'Grade 1-10' },
  ]},
  { name: 'October 2026', events: [
    { day: '02', label: 'Oct', title: 'Gandhi Jayanti', desc: 'Holiday + Special Assembly' },
    { day: '15', label: 'Oct', title: 'Dussehra / Navratri Break', desc: 'Holiday' },
  ]},
  { name: 'November 2026', events: [
    { day: '14', label: 'Nov', title: "Children's Day Celebration", desc: 'Fun activities & competitions' },
    { day: '20', label: 'Nov', title: 'Science Exhibition', desc: 'Open for parents' },
  ]},
  { name: 'December 2026', events: [
    { day: '15', label: 'Dec', title: 'Annual Day Celebration', desc: 'Cultural performances' },
    { day: '25', label: 'Dec', title: 'Winter Break Begins', desc: 'Tentative' },
  ]},
];

export default function CalendarPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
<h1 className="page-hero-title">Academic Calendar</h1>
          <p className="page-hero-desc">Important dates, exams, events, and holidays for the academic year 2026-27.</p>
        </div>
      </section>

      <section className="calendar-section">
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Calendar 2026-27</span>
          <h2 className="section-title">Academic Year Schedule</h2>
        </div>
        <div className="calendar-grid">
          {months.map((m) => (
            <div key={m.name} className="calendar-month">
              <h3><i className="fas fa-calendar-alt" style={{ color: 'var(--gold)', marginRight: '0.5rem' }}></i>{m.name}</h3>
              {m.events.map((e, i) => (
                <div key={i} className="calendar-event">
                  <div className="calendar-event-date">
                    <span>{e.day}</span>
                    <span>{e.label}</span>
                  </div>
                  <div>
                    <h4>{e.title}</h4>
                    <p>{e.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
