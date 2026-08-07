'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import '@/styles/about.css';

const defaultMessage = {
  name: "Mr. Madhukarrao Nawale",
  title: "President, Abhinav Shikshan Sanstha, Akole",
  message: `It gives me immense pleasure to welcome you to Vasundhara Academy, Akole, which has always remained committed to providing quality education along with strong moral values and holistic development. We believe that education is not merely the acquisition of knowledge, but the shaping of character, confidence, creativity, and social responsibility.

Since its inception, Sanstha has been deeply committed to serving the downtrodden sections of society, especially students from hilly, tribal, and rural areas. We strongly believe that every child, irrespective of social or economic background, deserves access to quality education and opportunities for a brighter future. Education is the most powerful tool for social transformation, and our institution continues to work tirelessly to uplift underprivileged communities through inclusive and value-based education.

With the dedicated efforts of our teachers, students, parents, and management, we continuously strive to create a learning environment that nurtures excellence in academics, sports, culture, and life skills. We are proud of our journey and remain committed to empowering every student to become a responsible citizen and a compassionate human being.

In today's rapidly changing world, our aim is to equip students with modern knowledge, technological skills, and ethical values so that they can confidently face future challenges. We believe that every child possesses unique potential, and our institution works tirelessly to help them discover and develop their talents.

I extend my heartfelt gratitude to all stakeholders for their constant support and trust in our Sanstha. Together, let us continue this noble mission of transforming lives through education and social service.

With best wishes for a bright and successful future.`,
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
            <img
              src="/images/leadership/president.jpg"
              alt="Mr. Madhukarrao Nawale - President"
              className="message-photo"
            />
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
              <p style={{ marginTop: '1.5rem' }}>
                <strong>With warm regards,</strong><br />
                <strong style={{ color: 'var(--navy)' }}>{msg.name}</strong><br />
                <span style={{ color: 'var(--gold)' }}>Abhinav Education Society</span>
              </p>
              <div className="message-quote">
                &quot;|| विद्याधनं सर्वधनं प्रधानम् ||&quot;<br />
                <small style={{ fontStyle: 'normal', color: 'var(--gray-500)' }}>
                  The wealth of knowledge is the greatest of all wealth.
                </small>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
