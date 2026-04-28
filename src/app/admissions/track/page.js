'use client';
import { useState } from 'react';
import Link from 'next/link';
import '@/styles/about.css';
import '@/styles/phase5.css';

export default function TrackPage() {
  const [applicationId, setApplicationId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!applicationId.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`/api/public/admissions/track?id=${applicationId.trim()}`);
      const data = await res.json();

      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { 
          icon: 'clock', 
          color: '#eab308', 
          text: 'Pending', 
          desc: 'Your application has been received and is waiting to be reviewed by our admission team.',
          step: 1 
        };
      case 'reviewed':
        return { 
          icon: 'eye', 
          color: '#3b82f6', 
          text: 'Under Review', 
          desc: 'Our admission team is currently reviewing your documents and information.',
          step: 2
        };
      case 'accepted':
        return { 
          icon: 'check-circle', 
          color: '#16a34a', 
          text: 'Accepted', 
          desc: 'Congratulations! Your application has been accepted. Our team will contact you for the next steps.',
          step: 3
        };
      case 'rejected':
        return { 
          icon: 'times-circle', 
          color: '#dc2626', 
          text: 'Rejected', 
          desc: 'We regret to inform you that your application was not accepted at this time. Please contact the office for more details.',
          step: 3
        };
      default:
        return { icon: 'question', color: '#64748b', text: status, desc: '', step: 0 };
    }
  };

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-hero-title">Track Application</h1>
          <p className="page-hero-desc">Enter your unique Application ID to check your admission status.</p>
        </div>
      </section>

      <section style={{ padding: '5rem 0', background: 'var(--white)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 2rem' }}>
          
          <div className="alumni-form-card" style={{ marginBottom: '2rem' }}>
            <form onSubmit={handleTrack}>
              <div className="form-group">
                <label className="form-label" htmlFor="appId">Enter Application ID</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    id="appId"
                    className="form-input" 
                    type="text" 
                    placeholder="e.g. cl2m4x..." 
                    value={applicationId}
                    onChange={(e) => setApplicationId(e.target.value)}
                    required
                    style={{ flex: 1 }}
                  />
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Track'}
                  </button>
                </div>
                {error && <p style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.5rem' }}><i className="fas fa-exclamation-circle"></i> {error}</p>}
              </div>
            </form>
          </div>

          {result && (
            <div className="admin-card" style={{ animation: 'fadeIn 0.5s ease' }}>
              <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--navy)', marginBottom: '0.2rem' }}>{result.studentName}</h3>
                    <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>{result.grade} | Applied on {new Date(result.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div style={{ 
                    background: getStatusInfo(result.status).color + '20', 
                    color: getStatusInfo(result.status).color,
                    padding: '0.5rem 1rem',
                    borderRadius: '50px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <i className={`fas fa-${getStatusInfo(result.status).icon}`}></i>
                    {getStatusInfo(result.status).text}
                  </div>
                </div>

                {/* Status Timeline */}
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '3rem' }}>
                  <div style={{ 
                    position: 'absolute', 
                    top: '15px', 
                    left: '5%', 
                    right: '5%', 
                    height: '2px', 
                    background: '#e2e8f0', 
                    zIndex: 0 
                  }}></div>
                  <div style={{ 
                    position: 'absolute', 
                    top: '15px', 
                    left: '5%', 
                    width: result.status === 'pending' ? '0%' : result.status === 'reviewed' ? '45%' : '90%', 
                    height: '2px', 
                    background: 'var(--gold)', 
                    zIndex: 0,
                    transition: 'width 1s ease'
                  }}></div>

                  {[
                    { label: 'Submitted', step: 1 },
                    { label: 'Reviewed', step: 2 },
                    { label: result.status === 'rejected' ? 'Rejected' : 'Decision', step: 3 }
                  ].map((s) => {
                    const currentStep = getStatusInfo(result.status).step;
                    const isActive = currentStep >= s.step;
                    const isRejected = result.status === 'rejected' && s.step === 3;

                    return (
                      <div key={s.label} style={{ textAlign: 'center', zIndex: 1, width: '33%' }}>
                        <div style={{ 
                          width: '30px', 
                          height: '30px', 
                          borderRadius: '50%', 
                          background: isRejected ? '#dc2626' : isActive ? 'var(--gold)' : 'white', 
                          border: `2px solid ${isRejected ? '#dc2626' : isActive ? 'var(--gold)' : '#e2e8f0'}`,
                          margin: '0 auto 0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isActive ? 'white' : '#cbd5e1',
                          fontSize: '0.8rem'
                        }}>
                          {isActive ? <i className="fas fa-check"></i> : s.step}
                        </div>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? 'var(--navy)' : 'var(--gray-400)'
                        }}>
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div style={{ 
                  background: 'var(--gray-50)', 
                  padding: '1.5rem', 
                  borderRadius: '12px', 
                  borderLeft: `4px solid ${getStatusInfo(result.status).color}` 
                }}>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--navy)' }}>Status Update</h4>
                  <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                    {getStatusInfo(result.status).desc}
                  </p>
                </div>

                {result.status === 'pending' && (
                  <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'var(--gray-400)', textAlign: 'center' }}>
                    Didn't receive a call? Please contact our office at <a href="tel:+919876543210" style={{ color: 'var(--gold)', fontWeight: 600 }}>+91 98765 43210</a>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
