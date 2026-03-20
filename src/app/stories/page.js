'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import '@/styles/about.css';
import '@/styles/phase4.css';

const defaultStories = [
  { title: 'Expert Abacus State Level Winners', desc: 'Our students showcased exceptional mental arithmetic skills at the State Level Expert Abacus Competition.', category: 'Achievement', img: '/images/school-photo-1.jpg', date: { day: '10', month: 'Oct' } },
  { title: 'SOF Olympiad Award Winners', desc: 'Multiple students received awards in Science Olympiad Foundation examinations.', category: 'Achievement', img: '/images/school-photo-2.jpg', date: { day: '15', month: 'Nov' } },
  { title: 'Outstanding Board Results', desc: 'Vasundhara Academy secured excellent results in the CBSE board examinations.', category: 'Academic', img: '/images/school-photo-3.jpg', date: { day: '20', month: 'May' } },
];

export default function StoriesPage() {
  const [gallery, setGallery] = useState([]);
  const [events, setEvents] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/public/gallery').then(r => r.json()).catch(() => []),
      fetch('/api/public/events').then(r => r.json()).catch(() => []),
    ]).then(([galleryData, eventsData]) => {
      setGallery(galleryData);
      setEvents(eventsData);
      setLoaded(true);
    });
  }, []);

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
<h1 className="page-hero-title">Stories & Gallery</h1>
          <p className="page-hero-desc">Celebrating the milestones that define our journey of excellence.</p>
        </div>
      </section>

      {/* Gallery Images from Admin */}
      {gallery.length > 0 && (
        <section className="events-section">
          <div className="container text-center">
            <span className="section-tag"><i className="fas fa-minus"></i> Photo Gallery</span>
            <h2 className="section-title">Our Gallery</h2>
          </div>
          <div className="events-grid">
            {gallery.map((img) => (
              <div key={img.id} className="event-card">
                <div className="event-img-wrap">
                  <img src={img.url} alt={img.title || 'Gallery'} />
                  <span className="event-category-badge" style={{ textTransform: 'capitalize' }}>{img.category}</span>
                </div>
                <div className="event-body">
                  <h3>{img.title || 'Untitled'}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Events from Admin */}
      {events.length > 0 && (
        <section className="events-section" style={{ background: 'var(--off-white)' }}>
          <div className="container text-center">
            <span className="section-tag"><i className="fas fa-minus"></i> School Events</span>
            <h2 className="section-title">Recent Events</h2>
          </div>
          <div className="events-grid">
            {events.map((e) => {
              const d = new Date(e.date);
              return (
                <div key={e.id} className="event-card">
                  <div className="event-img-wrap" style={{ background: 'linear-gradient(135deg, var(--navy), var(--navy-light))', minHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          </div>
        </section>
      )}

      {/* Default Stories (always shown) */}
      <section className="events-section">
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Our Stories</span>
          <h2 className="section-title">Achievements & Highlights</h2>
        </div>
        <div className="events-grid">
          {defaultStories.map((s, i) => (
            <div key={i} className="event-card">
              <div className="event-img-wrap">
                <img src={s.img} alt={s.title} />
                <div className="event-date-badge">
                  <span className="event-date-day">{s.date.day}</span>
                  <span className="event-date-month">{s.date.month}</span>
                </div>
                <span className="event-category-badge">{s.category}</span>
              </div>
              <div className="event-body">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
