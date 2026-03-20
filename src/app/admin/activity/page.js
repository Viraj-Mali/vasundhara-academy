'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import '@/styles/admin.css';

const actionIcons = {
  create: { icon: 'fas fa-plus-circle', color: '#16a34a', bg: '#dcfce7' },
  update: { icon: 'fas fa-edit', color: '#2563eb', bg: '#dbeafe' },
  delete: { icon: 'fas fa-trash', color: '#dc2626', bg: '#fee2e2' },
};

const entityIcons = {
  staff: 'fas fa-chalkboard-teacher',
  admission: 'fas fa-file-alt',
  enquiry: 'fas fa-question-circle',
  event: 'fas fa-calendar-alt',
  gallery: 'fas fa-images',
  notification: 'fas fa-bell',
  committee: 'fas fa-people-arrows',
  board: 'fas fa-users',
  message: 'fas fa-envelope',
  document: 'fas fa-file-contract',
};

export default function ActivityLogPage() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadLogs = (p = 1) => {
    setLoading(true);
    fetch(`/api/admin/activity?page=${p}&limit=30`)
      .then(r => r.json())
      .then(data => {
        setLogs(data.logs || []);
        setTotal(data.total || 0);
        setPage(p);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { loadLogs(); }, []);

  const totalPages = Math.ceil(total / 30);

  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Group logs by date
  const groupedLogs = {};
  logs.forEach(log => {
    const date = new Date(log.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    if (!groupedLogs[date]) groupedLogs[date] = [];
    groupedLogs[date].push(log);
  });

  return (
    <AdminLayout>
      <div className="admin-header">
        <h1><i className="fas fa-history" style={{ color: 'var(--gold)', marginRight: '0.5rem' }}></i> Activity Log</h1>
        <span style={{ fontSize: '0.82rem', color: 'var(--gray-400)' }}>{total} total activities</span>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '3rem' }}><i className="fas fa-spinner fa-spin"></i> Loading...</p>
      ) : logs.length === 0 ? (
        <div className="admin-card">
          <div className="admin-card-body" style={{ textAlign: 'center', padding: '3rem' }}>
            <i className="fas fa-clipboard-list" style={{ fontSize: '3rem', color: 'var(--gray-300)', marginBottom: '1rem' }}></i>
            <h3 style={{ color: 'var(--gray-400)', fontWeight: 500 }}>No activity yet</h3>
            <p style={{ color: 'var(--gray-300)', fontSize: '0.85rem' }}>Actions like creating, editing, and deleting items will appear here.</p>
          </div>
        </div>
      ) : (
        <>
          {Object.entries(groupedLogs).map(([date, dateLogs]) => (
            <div key={date} style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.8rem', padding: '0 0.2rem' }}>
                {date}
              </div>
              <div className="admin-card" style={{ marginBottom: 0 }}>
                <div className="admin-card-body" style={{ padding: 0 }}>
                  {dateLogs.map((log, i) => {
                    const actionStyle = actionIcons[log.action] || actionIcons.create;
                    const entityIcon = entityIcons[log.entityType] || 'fas fa-circle';
                    return (
                      <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem 1.2rem', borderBottom: i < dateLogs.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: actionStyle.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <i className={actionStyle.icon} style={{ color: actionStyle.color, fontSize: '0.82rem' }}></i>
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '0.85rem', color: 'var(--navy)', margin: 0 }}>
                            <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{log.action}d</span>
                            {' '}
                            <i className={entityIcon} style={{ fontSize: '0.72rem', color: 'var(--gray-400)' }}></i>
                            {' '}
                            <span style={{ textTransform: 'capitalize' }}>{log.entityType}</span>
                            {': '}
                            <strong>{log.entityName}</strong>
                          </p>
                          {log.description && (
                            <p style={{ fontSize: '0.72rem', color: 'var(--gray-400)', margin: '0.1rem 0 0' }}>{log.description}</p>
                          )}
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <p style={{ fontSize: '0.72rem', color: 'var(--gray-400)', margin: 0 }}>{formatTime(log.createdAt)}</p>
                          {log.userId && <p style={{ fontSize: '0.65rem', color: 'var(--gray-300)', margin: 0 }}>{log.userId}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
              <button className="admin-btn admin-btn-outline admin-btn-sm" disabled={page <= 1} onClick={() => loadLogs(page - 1)}>
                <i className="fas fa-chevron-left"></i> Previous
              </button>
              <span style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem', color: 'var(--gray-400)' }}>
                Page {page} of {totalPages}
              </span>
              <button className="admin-btn admin-btn-outline admin-btn-sm" disabled={page >= totalPages} onClick={() => loadLogs(page + 1)}>
                Next <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
