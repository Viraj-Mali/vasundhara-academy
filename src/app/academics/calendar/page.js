import Link from 'next/link';
import '@/styles/about.css';
import '@/styles/phase4.css';

export const metadata = {
  title: 'Academic Calendar 2026-27 | Vasundhara Academy Akole',
  description: 'View the academic schedule, exam dates, school events, and holiday list for the year 2026-27 at Vasundhara Academy Akole.',
};

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

        <div className="calendar-images-container">
          <div className="calendar-page-card">
            <h3 className="calendar-page-title">Page 1</h3>
            <div className="calendar-image-wrap">
              <img 
                src="/images/academic-calendar/academic-calendar-page-1.png" 
                alt="Academic Calendar 2026-27 Page 1" 
                className="calendar-image"
              />
            </div>
          </div>

          <div className="calendar-page-card">
            <h3 className="calendar-page-title">Page 2</h3>
            <div className="calendar-image-wrap">
              <img 
                src="/images/academic-calendar/academic-calendar-page-2.png" 
                alt="Academic Calendar 2026-27 Page 2" 
                className="calendar-image"
              />
            </div>
          </div>

          <div className="calendar-page-card">
            <h3 className="calendar-page-title">Page 3</h3>
            <div className="calendar-image-wrap">
              <img 
                src="/images/academic-calendar/academic-calendar-page-3.png" 
                alt="Academic Calendar 2026-27 Page 3" 
                className="calendar-image"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
