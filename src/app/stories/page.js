'use client';

import { useEffect, useState } from 'react';
import '@/styles/about.css';
import '@/styles/phase4.css';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function StoriesPage() {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/public/stories-achievements', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoaded(true));
  }, []);

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-hero-title">Stories & Achievements</h1>
          <p className="page-hero-desc">Celebrating the milestones that define our journey of excellence.</p>
        </div>
      </section>

      <section className="events-section">
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Our Stories</span>
          <h2 className="section-title">Achievements & Highlights</h2>
        </div>

        {!loaded ? (
          <p style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '2rem 1rem' }}>
            <i className="fas fa-spinner fa-spin"></i> Loading stories and achievements...
          </p>
        ) : items.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '2rem 1rem' }}>
            No stories or achievements added yet.
          </p>
        ) : (
          <div className="events-grid">
            {items.map((item) => {
              const itemDate = item.date ? new Date(item.date) : null;
              const hasDate = itemDate && !Number.isNaN(itemDate.getTime());

              return (
                <div key={item.id} className="event-card">
                  <div className="event-img-wrap">
                    <img src={item.imageUrl} alt={item.title} />
                    {hasDate && (
                      <div className="event-date-badge">
                        <span className="event-date-day">{itemDate.getDate()}</span>
                        <span className="event-date-month">{months[itemDate.getMonth()]}</span>
                      </div>
                    )}
                    <span className="event-category-badge">{item.category}</span>
                  </div>
                  <div className="event-body">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
