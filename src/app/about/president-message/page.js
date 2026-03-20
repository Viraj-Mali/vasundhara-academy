'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import '@/styles/about.css';

const defaultMessage = {
  name: "Mr. Vikram Nawale",
  title: "President, Abhinav Education Society, Akole",
  message: `It gives me immense pleasure to welcome you to the Abhinav Education Society's Vasundhara Academy — an institution that stands as a testament to our commitment towards quality education and the holistic development of young minds.

When we established this academy, our vision was clear — to create a school in Akole that provides world-class CBSE education while staying rooted in our rich cultural values. Today, seeing our students excel in academics, sports, and various competitions at the state level fills my heart with pride and joy.

Our students' achievements in the Expert Abacus State Level Competition and SOF Olympiads are a reflection of the dedication of our teachers and the hard work of our students. We will continue to strive for excellence and provide every possible opportunity for our children to grow and succeed.

I extend my heartfelt gratitude to all parents for their trust in our institution. Together, let us shape a brighter future for our children and our nation.`,
};

export default function PresidentMessagePage() {
  const [msg, setMsg] = useState(defaultMessage);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/public/messages?role=president')
      .then(r => r.json())
      .then(data => {
        if (data && data.length > 0) {
          setMsg(data[0]);
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-hero-title">President&apos;s Message</h1>
          <p className="page-hero-desc">Words of wisdom from our Hon&apos;ble President.</p>
        </div>
      </section>

      <section className="message-section">
        <div className="message-inner">
          <div className="message-photo-card">
            {msg.photo ? (
              <img src={msg.photo} alt={msg.name} style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--gold)' }} />
            ) : (
              <div className="message-photo-placeholder">P</div>
            )}
            <h3 className="message-name">{msg.name}</h3>
            <p className="message-designation">{msg.title || 'President, Abhinav Education Society'}</p>
          </div>
          <div className="message-content">
            <span className="section-tag"><i className="fas fa-minus"></i> From the President&apos;s Desk</span>
            <h2>Dear Students, Parents & Well-Wishers,</h2>
            <div className="message-text">
              {msg.message.split('\n').filter(p => p.trim()).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
              <div className="message-quote">
                &quot;|| विद्याधनं सर्वधनं प्रधानम् ||&quot;<br />
                <small style={{ fontStyle: 'normal', color: 'var(--gray-500)' }}>
                  The wealth of knowledge is the greatest of all wealth.
                </small>
              </div>
              <p style={{ marginTop: '1.5rem' }}>
                <strong>With warm regards,</strong><br />
                <strong style={{ color: 'var(--navy)' }}>{msg.name}</strong><br />
                <span style={{ color: 'var(--gold)' }}>Abhinav Education Society</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
