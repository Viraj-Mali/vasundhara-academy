'use client';
import { useState } from 'react';
import Link from 'next/link';
import '@/styles/about.css';
import '@/styles/pages.css';

const enquiryContacts = [
  {
    designation: 'Principal',
    name: 'Prin.Dr.Jayashri Deshmukh',
    phone: '+91 94220 51190',
    tel: 'tel:+919422051190',
    whatsapp: 'https://wa.me/919422051190',
  },
  {
    designation: 'Vice Principal',
    name: 'Radhika Nawale',
    phone: '+91 88052 54793',
    tel: 'tel:+918805254793',
    whatsapp: 'https://wa.me/918805254793',
  },
];

export default function EnquirePage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/public/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSubmitted(true);
      setForm({ name: '', phone: '', email: '', subject: '', message: '' });
    }
    setLoading(false);
  };

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
<h1 className="page-hero-title">Enquire Now</h1>
          <p className="page-hero-desc">We&apos;re happy to answer your questions. Reach out to us!</p>
        </div>
      </section>

      <section className="enquire-section">
        <div className="enquire-inner">
          <div className="enquire-quick">
            <div className="enquire-quick-card">
              <i className="fas fa-phone-alt"></i>
              <h4>Call Us</h4>
              <div className="enquire-contact-list">
                {enquiryContacts.map((contact) => (
                  <a key={contact.designation} href={contact.tel} className="enquire-contact-row">
                    <span>{contact.designation}</span>
                    <strong>{contact.name}</strong>
                    <p>{contact.phone}</p>
                  </a>
                ))}
              </div>
            </div>
            <div className="enquire-quick-card">
              <i className="fab fa-whatsapp" style={{ color: '#25d366' }}></i>
              <h4>WhatsApp</h4>
              <div className="enquire-contact-list">
                {enquiryContacts.map((contact) => (
                  <a key={contact.designation} href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="enquire-contact-row whatsapp">
                    <span>{contact.designation}</span>
                    <strong>{contact.name}</strong>
                    <p>{contact.phone}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="enquire-card">
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy)', marginBottom: '0.5rem', fontSize: '1.3rem' }}>
              Quick Enquiry Form
            </h3>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <i className="fas fa-check-circle" style={{ fontSize: '3rem', color: '#16a34a', marginBottom: '1rem', display: 'block' }}></i>
                <h4 style={{ color: 'var(--navy)', marginBottom: '0.5rem' }}>Enquiry Submitted!</h4>
                <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>Thank you! We&apos;ll get back to you shortly.</p>
                <button onClick={() => setSubmitted(false)} className="btn btn-outline" style={{ marginTop: '1rem' }}>
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <>
                <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  Fill in the details and we&apos;ll get back to you shortly.
                </p>
                <form onSubmit={handleSubmit} aria-label="Quick Enquiry Form">
                  <div className="form-group">
                    <label className="form-label">Parent/Guardian Name *</label>
                    <input className="form-input" type="text" placeholder="Enter your name" required aria-required="true" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input className="form-input" type="tel" placeholder="+91 XXXXX XXXXX" required aria-required="true" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Enquiry About</label>
                    <select className="form-select" aria-label="Select enquiry topic" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}>
                      <option value="">Select topic...</option>
                      <option>Admissions (Grade 1-5)</option>
                      <option>Admissions (Grade 6-8)</option>
                      <option>Admissions (Grade 9-10)</option>
                      <option>Fee Structure</option>
                      <option>Transport/Hostel</option>
                      <option>General Information</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Your Message *</label>
                    <textarea className="form-textarea" placeholder="Type your message here..." required aria-required="true" value={form.message} onChange={e => setForm({...form, message: e.target.value})}></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading} aria-label={loading ? "Submitting enquiry" : "Submit enquiry"}>
                    {loading ? <><i className="fas fa-spinner fa-spin"></i> Submitting...</> : <><i className="fas fa-paper-plane"></i> Submit Enquiry</>}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
