'use client';
import { useState } from 'react';
import Link from 'next/link';
import '@/styles/about.css';
import '@/styles/phase5.css';

export default function AlumniPage() {
  const [form, setForm] = useState({ name: '', graduateYear: '', phone: '', email: '', occupation: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/public/alumni', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSubmitted(true);
      setForm({ name: '', graduateYear: '', phone: '', email: '', occupation: '', message: '' });
    }
    setLoading(false);
  };

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
<h1 className="page-hero-title">Alumni Registration</h1>
          <p className="page-hero-desc">Once a Vasundharian, always a Vasundharian! Stay connected.</p>
        </div>
      </section>

      <section style={{ padding: '5rem 0', background: 'var(--white)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 2rem' }}>
          <div className="alumni-form-card">
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <i className="fas fa-check-circle" style={{ fontSize: '3rem', color: '#16a34a', marginBottom: '1rem', display: 'block' }}></i>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy)', marginBottom: '0.5rem' }}>You&apos;re Registered!</h3>
                <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>Welcome back to the Vasundhara family! We&apos;ll stay in touch.</p>
                <button onClick={() => setSubmitted(false)} className="btn btn-outline" style={{ marginTop: '1rem' }}>
                  Register Another Alumni
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--navy)', marginBottom: '0.3rem' }}>
                  Alumni Registration Form
                </h3>
                <p style={{ color: 'var(--gray-400)', fontSize: '0.82rem', marginBottom: '2rem' }}>
                  Join our alumni network and stay connected with the Vasundhara family.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" type="text" placeholder="Your full name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Year of Graduation *</label>
                      <input className="form-input" type="text" placeholder="e.g., 2020" required value={form.graduateYear} onChange={e => setForm({...form, graduateYear: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input className="form-input" type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Current Occupation</label>
                    <input className="form-input" type="text" placeholder="What do you do now?" value={form.occupation} onChange={e => setForm({...form, occupation: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message / Memory to Share</label>
                    <textarea className="form-textarea" placeholder="Share your fondest memory of Vasundhara Academy..." value={form.message} onChange={e => setForm({...form, message: e.target.value})}></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                    {loading ? <><i className="fas fa-spinner fa-spin"></i> Registering...</> : <><i className="fas fa-user-plus"></i> Register as Alumni</>}
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
