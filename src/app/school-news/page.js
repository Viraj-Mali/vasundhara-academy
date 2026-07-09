'use client';

import { useEffect, useState } from 'react';
import '@/styles/about.css';
import '@/styles/school-news.css';

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function SchoolNewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/school-news')
      .then((res) => res.json())
      .then((data) => {
        setNews(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="page-hero page-hero-building">
        <div className="page-hero-content">
          <h1 className="page-hero-title">School News</h1>
          <p className="page-hero-desc">
            Latest updates, announcements, and moments from Vasundhara Academy.
          </p>
        </div>
      </section>

      <section className="school-news-section">
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Updates</span>
          <h2 className="section-title">Latest School News</h2>
        </div>

        {loading ? (
          <div className="school-news-empty">
            <div className="school-news-empty-icon"><i className="fas fa-spinner fa-spin"></i></div>
            <h3>Loading News</h3>
            <p>Please wait while the latest school news is loaded.</p>
          </div>
        ) : news.length === 0 ? (
          <div className="school-news-empty">
            <div className="school-news-empty-icon"><i className="fas fa-newspaper"></i></div>
            <h3>No Active News</h3>
            <p>There are no active school news updates at the moment. Please check back later.</p>
          </div>
        ) : (
          <div className="school-news-grid">
            {news.map((item) => (
              <article key={item.id} className="school-news-card">
                <div className="school-news-image">
                  <img src={item.image} alt={item.title} />
                  <span className="school-news-date">
                    <i className="far fa-calendar-alt"></i>
                    {formatDate(item.newsDate)}
                  </span>
                </div>
                <div className="school-news-body">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
