'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import '@/styles/about.css';

const defaultMessage = {
  name: 'Dr. Jayashri Rajiv Deshmukh',
  title: 'Principal, Vasundhara Academy, Akole',
  photo: '/images/leadership/principal.jpg',
  message: `Welcome to Vasundhara Academy, Akole, where education is nurtured with dedication, discipline, and compassion. At our school, we believe that true education goes beyond textbooks and examinations; it develops values, skills, confidence, and a sense of responsibility towards society.

Our school stands as a center of learning and opportunity for every student. We strive to create a learner-centered environment where students are encouraged to think creatively, act ethically, and grow intellectually. Along with academic excellence, equal importance is given to co-curricular activities, sports, life skills, and character building so that our students become confident and responsible citizens of tomorrow.

In today’s dynamic world, students need more than academic knowledge. They require confidence, communication skills, technological awareness, critical thinking, and strong moral grounding. Our committed teachers work tirelessly to create a positive and engaging learning environment where every child feels encouraged to explore his or her abilities and talents. The achievements of our students in academics, sports, arts, and various competitions inspire us to continue our pursuit of excellence.

I sincerely appreciate dedicated efforts of our teachers, the support of parents, and the enthusiasm of our students who continuously inspire us to achieve higher standards in education. In this rapidly changing world, we are committed to equipping students with modern knowledge, technological awareness, communication skills, and strong moral values.

I express my sincere gratitude to the management, staff, parents, and well-wishers for their unwavering support and cooperation. May our school continue to spread the light of knowledge and inspire generations to dream, learn, and succeed.`,
};

export default function PrincipalMessagePage() {
  const [msg, setMsg] = useState(defaultMessage);

  useEffect(() => {
    fetch('/api/public/messages?role=principal')
      .then(r => r.json())
      .then(data => { if (data && data.length > 0) setMsg(data[0]); })
      .catch(() => { });
  }, []);

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-hero-title">Principal&apos;s Message</h1>
          <p className="page-hero-desc">Guidance and vision from our esteemed Principal.</p>
        </div>
      </section>

      <section className="message-section">
        <div className="message-inner">
          <div className="message-photo-card">
            {msg.photo ? (
              <img src={msg.photo} alt={msg.name} className="message-photo" />
            ) : (
              <div className="message-photo-placeholder">JD</div>
            )}
            <h3 className="message-name">{msg.name}</h3>
            <p className="message-designation">{msg.title || 'Principal'}</p>
          </div>
          <div className="message-content">
            <span className="section-tag"><i className="fas fa-minus"></i> From the Principal&apos;s Desk</span>
            <h2>Dear Students & Parents,</h2>
            <div className="message-text">
              {msg.message.split('\n').filter(p => p.trim()).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
              <p style={{ marginTop: '1.5rem' }}>
                <strong>Warm regards,</strong><br />
                <strong style={{ color: 'var(--navy)' }}>{msg.name}</strong><br />
                <span style={{ color: 'var(--gold)' }}>Principal, Vasundhara Academy</span>
              </p>
              <div className="message-quote">
                &quot;Education is the most powerful weapon which you can use to change the world.&quot;
                <br /><small style={{ fontStyle: 'normal', color: 'var(--gray-500)' }}>— Nelson Mandela</small>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
