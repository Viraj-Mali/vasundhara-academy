'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import '@/styles/about.css';

const defaultMessage = {
  name: 'Prin. Dr. Jayashri Deshmukh',
  title: 'Principal',
  message: `The aim of education goes beyond merely imparting knowledge from textbooks. Education and those in the field of education have a commitment of inculcating in young minds values of equality, justice, freedom, concern for others' well-being, secularism, respect for human dignity and rights, which are based on reason and understanding.

Students need to learn to make choices in life independently, participate in decision making processes and be ready and equipped with the mental frame to face the consequences for their choices. The students need to learn how to learn and to respond to new situations in a flexible manner and to identify their self-spirit to reach the pinnacle of success in their future life.

At Vasundhara Academy, we strive to provide an environment that encourages curiosity, critical thinking, and a love for learning. Our dedicated team of educators works tirelessly to ensure that every student receives the attention and guidance they need to excel — not just academically, but in every aspect of life.

I invite all parents and students to join us on this beautiful journey of learning, growth, and excellence.`,
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
              <img src={msg.photo} alt={msg.name} style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--gold)' }} />
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
              <div className="message-quote">
                &quot;Education is the most powerful weapon which you can use to change the world.&quot;
                <br /><small style={{ fontStyle: 'normal', color: 'var(--gray-500)' }}>— Nelson Mandela</small>
              </div>
              <p style={{ marginTop: '1.5rem' }}>
                <strong>Warm regards,</strong><br />
                <strong style={{ color: 'var(--navy)' }}>{msg.name}</strong><br />
                <span style={{ color: 'var(--gold)' }}>Principal, Vasundhara Academy</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
