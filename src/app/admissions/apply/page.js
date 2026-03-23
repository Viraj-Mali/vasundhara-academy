'use client';
import { useState } from 'react';
import Link from 'next/link';
import '@/styles/about.css';
import '@/styles/phase5.css';

export default function ApplyPage() {
  const [form, setForm] = useState({ studentName: '', grade: '', parentName: '', phone: '', email: '', previousSchool: '', address: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/public/admissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSubmitted(true);
      setForm({ studentName: '', grade: '', parentName: '', phone: '', email: '', previousSchool: '', address: '', message: '' });
    }
    setLoading(false);
  };

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
<h1 className="page-hero-title">Online Admission Form</h1>
          <p className="page-hero-desc">Fill the form below to apply for admission at Vasundhara Academy.</p>
        </div>
      </section>

      <section style={{ padding: '5rem 0', background: 'var(--white)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
          <div className="alumni-form-card">
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <i className="fas fa-check-circle" style={{ fontSize: '3rem', color: '#16a34a', marginBottom: '1rem', display: 'block' }}></i>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy)', marginBottom: '0.5rem' }}>Application Submitted!</h3>
                <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>Thank you! Our admission team will contact you within 48 hours.</p>
                <button onClick={() => setSubmitted(false)} className="btn btn-outline" style={{ marginTop: '1rem' }}>
                  Submit Another Application
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--navy)', marginBottom: '0.3rem' }}>
                  Admission Application 2026-27
                </h3>
                <p style={{ color: 'var(--gray-400)', fontSize: '0.82rem', marginBottom: '2rem' }}>
                  Fields marked with * are required. We&apos;ll get back to you within 48 hours.
                </p>

                <form onSubmit={handleSubmit}>
                  <h4 style={{ color: 'var(--gold)', fontSize: '0.82rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1rem' }}>
                    Student Information
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="studentName">Student&apos;s Full Name *</label>
                      <input 
                        id="studentName"
                        name="studentName"
                        className="form-input" 
                        type="text" 
                        placeholder="Full name" 
                        required 
                        autocomplete="name"
                        value={form.studentName} 
                        onChange={e => setForm({...form, studentName: e.target.value})} 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="grade">Applying for Grade *</label>
                      <select 
                        id="grade"
                        name="grade"
                        className="form-select" 
                        required 
                        value={form.grade} 
                        onChange={e => setForm({...form, grade: e.target.value})}
                      >
                        <option value="">Select Grade…</option>
                        {[1,2,3,4,5,6,7,8,9,10].map(g => (
                          <option key={g} value={`Grade ${g}`}>Grade {g}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <h4 style={{ color: 'var(--gold)', fontSize: '0.82rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1rem', marginTop: '1rem' }}>
                    Parent / Guardian Information
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="parentName">Parent/Guardian Name *</label>
                      <input 
                        id="parentName"
                        name="parentName"
                        className="form-input" 
                        type="text" 
                        placeholder="Full name" 
                        required 
                        autocomplete="name"
                        value={form.parentName} 
                        onChange={e => setForm({...form, parentName: e.target.value})} 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="phone">Phone Number *</label>
                      <input 
                        id="phone"
                        name="phone"
                        className="form-input" 
                        type="tel" 
                        inputmode="tel"
                        placeholder="+91 XXXXX XXXXX" 
                        required 
                        autocomplete="tel"
                        value={form.phone} 
                        onChange={e => setForm({...form, phone: e.target.value})} 
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email</label>
                    <input 
                      id="email"
                      name="email"
                      className="form-input" 
                      type="email" 
                      placeholder="your@email.com" 
                      autocomplete="email"
                      spellCheck={false}
                      value={form.email} 
                      onChange={e => setForm({...form, email: e.target.value})} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Previous School Name</label>
                    <input className="form-input" type="text" placeholder="Name of last attended school" value={form.previousSchool} onChange={e => setForm({...form, previousSchool: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="address">Address</label>
                    <textarea 
                      id="address"
                      name="address"
                      className="form-textarea" 
                      placeholder="Your complete address…" 
                      style={{ minHeight: '80px' }} 
                      value={form.address} 
                      onChange={e => setForm({...form, address: e.target.value})}
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="message">Any Message / Special Requirements</label>
                    <textarea 
                      id="message"
                      name="message"
                      className="form-textarea" 
                      placeholder="Anything you&apos;d like us to know…" 
                      style={{ minHeight: '80px' }} 
                      value={form.message} 
                      onChange={e => setForm({...form, message: e.target.value})}
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                    {loading ? <><i className="fas fa-spinner fa-spin"></i> Submitting...</> : <><i className="fas fa-paper-plane"></i> Submit Application</>}
                  </button>
                  <p style={{ textAlign: 'center', color: 'var(--gray-400)', fontSize: '0.78rem', marginTop: '1rem' }}>
                    By submitting, you agree to be contacted by our admission team.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
