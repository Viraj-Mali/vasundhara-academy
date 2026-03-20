'use client';
import { useState, useEffect } from 'react';
import '@/styles/about.css';

const priorityIcons = { low: 'fas fa-info-circle', normal: 'fas fa-bell', high: 'fas fa-exclamation-triangle', urgent: 'fas fa-exclamation-circle' };
const priorityColors = { low: '#94a3b8', normal: '#3b82f6', high: '#f59e0b', urgent: '#ef4444' };
const categoryIcons = { general: 'fas fa-clipboard', exam: 'fas fa-file-alt', holiday: 'fas fa-calendar-day', circular: 'fas fa-scroll', result: 'fas fa-chart-bar' };

export default function NoticeBoardPage() {
  const [notices, setNotices] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/admin/notices')
      .then(r => r.json())
      .then(data => { setNotices(data.filter(n => n.active)); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-hero-title">Notice Board</h1>
          <p className="page-hero-desc">Important announcements, circulars, and updates for parents and students.</p>
        </div>
      </section>

      <section style={{ padding: '4rem 0', background: 'var(--off-white)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          {!loaded ? (
            <div>
              {[1,2,3].map(i => (
                <div key={i} className="shimmer" style={{ height: '120px', marginBottom: '1rem', borderRadius: 'var(--radius-lg)' }}></div>
              ))}
            </div>
          ) : notices.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <i className="fas fa-clipboard-list" style={{ fontSize: '3rem', color: 'var(--gray-300)', display: 'block', marginBottom: '1rem' }}></i>
              <h3 style={{ color: 'var(--navy)', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>No Active Notices</h3>
              <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>There are no active notices at the moment. Check back later.</p>
            </div>
          ) : (
            <div>
              {notices.map((notice, idx) => (
                <div key={notice.id} className="reveal" style={{
                  background: 'var(--white)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.5rem 2rem',
                  marginBottom: '1rem',
                  border: `1px solid ${notice.priority === 'urgent' ? 'rgba(239,68,68,0.3)' : 'rgba(0,0,0,0.04)'}`,
                  borderLeft: `4px solid ${priorityColors[notice.priority]}`,
                  transition: 'all 0.3s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: 'var(--radius-md)', flexShrink: 0,
                      background: `${priorityColors[notice.priority]}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: priorityColors[notice.priority], fontSize: '1.1rem',
                    }}>
                      <i className={priorityIcons[notice.priority]}></i>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: 'var(--navy)', margin: 0 }}>{notice.title}</h3>
                        <span style={{
                          padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)',
                          background: `${priorityColors[notice.priority]}15`, color: priorityColors[notice.priority],
                          fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px',
                        }}>
                          {notice.priority}
                        </span>
                      </div>
                      <p style={{ color: 'var(--gray-500)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '0.5rem', whiteSpace: 'pre-line' }}>{notice.content}</p>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                        <span><i className={categoryIcons[notice.category] || 'fas fa-tag'} style={{ marginRight: '0.3rem' }}></i>{notice.category}</span>
                        <span><i className="fas fa-clock" style={{ marginRight: '0.3rem' }}></i>{new Date(notice.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                  {notice.attachmentUrl && (
                    <a href={notice.attachmentUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline" style={{ marginTop: '0.8rem', marginLeft: '3.5rem' }}>
                      <i className="fas fa-download"></i> Download Attachment
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
