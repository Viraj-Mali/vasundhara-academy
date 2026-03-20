'use client';
import Link from 'next/link';
import { useState } from 'react';
import '@/styles/about.css';
import '@/styles/pages.css';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        setForm({ name: '', phone: '', email: '', subject: '', message: '' });
      } else {
        setError('Failed to send. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setSending(false);
  };

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-hero-title">Contact Us</h1>
          <p className="page-hero-desc">We&apos;d love to hear from you. Reach out to us anytime.</p>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-grid">
          <div>
            <span className="section-tag"><i className="fas fa-minus"></i> Get in Touch</span>
            <h2 className="section-title">We&apos;re Here to Help</h2>
            <p className="section-desc">Have questions about admissions, academics, or anything else? Don&apos;t hesitate to reach out.</p>
            <div className="contact-info-list">
              <div className="contact-info-item">
                <div className="contact-info-icon"><i className="fas fa-map-marker-alt"></i></div>
                <div>
                  <h4>Our Address</h4>
                  <p>
                    Dhamangaon Awari Road, Akole,<br />
                    Tal. Akole, Dist. Ahmednagar,<br />
                    PIN–422601, Maharashtra, India
                  </p>
                </div>
              </div>
              <a href="tel:+919881945960" className="contact-info-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="contact-info-icon"><i className="fas fa-phone-alt"></i></div>
                <div>
                  <h4>Phone</h4>
                  <p>+91 98819 45960</p>
                </div>
              </a>
              <a href="mailto:vasundhara.academy2016@gmail.com" className="contact-info-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="contact-info-icon"><i className="fas fa-envelope"></i></div>
                <div>
                  <h4>Email</h4>
                  <p>vasundhara.academy2016@gmail.com</p>
                </div>
              </a>
              <a href="https://wa.me/919881945960?text=Hello!%20I%20would%20like%20to%20know%20more%20about%20Vasundhara%20Academy." target="_blank" rel="noopener noreferrer" className="contact-info-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="contact-info-icon" style={{ color: '#25d366' }}><i className="fab fa-whatsapp"></i></div>
                <div>
                  <h4>WhatsApp</h4>
                  <p>+91 98819 45960</p>
                </div>
              </a>
            </div>
          </div>

          <div className="contact-form-card">
            <h3>Send Us a Message</h3>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <i className="fas fa-check-circle" style={{ fontSize: '3rem', color: '#16a34a', display: 'block', marginBottom: '1rem' }}></i>
                <h3 style={{ color: 'var(--navy)', marginBottom: '0.5rem' }}>Message Sent!</h3>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>Thank you for reaching out. We&apos;ll get back to you soon.</p>
                <button onClick={() => setSent(false)} className="btn btn-outline" style={{ marginTop: '1rem' }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" type="text" placeholder="Your full name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input className="form-input" type="tel" placeholder="+91 XXXXX XXXXX" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input className="form-input" type="text" placeholder="What is this about?" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea className="form-textarea" placeholder="Your message..." required value={form.message} onChange={e => setForm({...form, message: e.target.value})}></textarea>
                </div>
                {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '0.5rem' }}><i className="fas fa-exclamation-circle"></i> {error}</p>}
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={sending}>
                  {sending ? <><i className="fas fa-spinner fa-spin"></i> Sending...</> : <><i className="fas fa-paper-plane"></i> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="contact-map">
        <div className="container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3756.123!2d73.9992023!3d19.5281872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdd08c6b7493abd%3A0x68e4b86d59c33e2!2sAbhinav%20Education%20Society%2CAkole!5e0!3m2!1sen!2sin!4v1700000000000"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Vasundhara Academy Location"
          ></iframe>
        </div>
      </section>
    </>
  );
}
