'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import '@/styles/about.css';
import '@/styles/phase4.css';

const defaultEvents = [
  { title: 'Annual Day Celebration', desc: 'A grand celebration of talent, culture, and academic achievements with performances by students from all grades.', category: 'Celebration', img: '/images/school-photo-1.jpg', date: { day: '15', month: 'Dec' }, photos: 45 },
  { title: 'Expert Abacus Competition', desc: 'Students demonstrated exceptional mental arithmetic skills at the State Level Expert Abacus Competition.', category: 'Achievement', img: '/images/school-photo-2.jpg', date: { day: '10', month: 'Oct' }, photos: 20 },
  { title: 'Science Exhibition 2026', desc: 'Innovative science projects showcased by budding scientists from Grade 5 to 10.', category: 'Academic', img: '/images/school-photo-3.jpg', date: { day: '18', month: 'Aug' }, photos: 30 },
];

export default function EventsPage() {
  const [dbEvents, setDbEvents] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/public/events')
      .then(r => r.json())
      .then(data => { setDbEvents(data); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
<h1 className="page-hero-title">School Events</h1>
          <p className="page-hero-desc">Glimpses of the vibrant life at Vasundhara Academy.</p>
        </div>
      </section>

      <section className="events-section">
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Our Events</span>
          <h2 className="section-title">Recent Events & Celebrations</h2>
        </div>
        <div className="events-grid">
          {/* Database events */}
          {dbEvents.map((e) => {
            const d = new Date(e.date);
            return (
              <div key={e.id} className="event-card">
                <div className="event-img-wrap" style={{ background: 'linear-gradient(135deg, var(--navy), var(--navy-light))', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="event-date-badge">
                    <span className="event-date-day">{d.getDate()}</span>
                    <span className="event-date-month">{months[d.getMonth()]}</span>
                  </div>
                  <span className="event-category-badge" style={{ textTransform: 'capitalize' }}>{e.category}</span>
                </div>
                <div className="event-body">
                  <h3>{e.title}</h3>
                  <p>{e.description}</p>
                </div>
              </div>
            );
          })}

          {/* Default events */}
          {defaultEvents.map((e, i) => (
            <div key={`d-${i}`} className="event-card">
              <div className="event-img-wrap">
                <img src={e.img} alt={e.title} />
                <div className="event-date-badge">
                  <span className="event-date-day">{e.date.day}</span>
                  <span className="event-date-month">{e.date.month}</span>
                </div>
                <span className="event-category-badge">{e.category}</span>
              </div>
              <div className="event-body">
                <h3>{e.title}</h3>
                <p>{e.desc}</p>
              </div>
              <div className="event-footer">
                <span className="event-photos-count"><i className="fas fa-camera"></i> {e.photos} Photos</span>
                <span className="event-read-more">Read More <i className="fas fa-arrow-right"></i></span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
