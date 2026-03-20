'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import '@/styles/admin.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentAdmissions, setRecentAdmissions] = useState([]);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/dashboard').then(r => r.json()),
      fetch('/api/admin/activity?limit=5').then(r => r.json()).catch(() => ({ logs: [] })),
    ]).then(([dashData, activityData]) => {
      setStats(dashData.stats);
      setRecentAdmissions(dashData.recentAdmissions || []);
      setRecentEnquiries(dashData.recentEnquiries || []);
      setRecentActivity(activityData.logs || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout><p style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }}><i className="fas fa-spinner fa-spin"></i> Loading dashboard...</p></AdminLayout>;

  const statCards = [
    { label: 'Total Admissions', value: stats?.admissions || 0, icon: 'fas fa-file-alt', color: '#2563eb', bg: '#dbeafe', href: '/admin/admissions' },
    { label: 'Pending', value: stats?.pendingAdmissions || 0, icon: 'fas fa-clock', color: '#d97706', bg: '#fef3c7', href: '/admin/admissions' },
    { label: 'Enquiries', value: stats?.enquiries || 0, icon: 'fas fa-question-circle', color: '#7c3aed', bg: '#ede9fe', href: '/admin/enquiries' },
    { label: 'New Enquiries', value: stats?.newEnquiries || 0, icon: 'fas fa-envelope-open', color: '#dc2626', bg: '#fee2e2', href: '/admin/enquiries' },
    { label: 'Staff', value: stats?.staff || 0, icon: 'fas fa-chalkboard-teacher', color: '#059669', bg: '#dcfce7', href: '/admin/staff' },
    { label: 'Events', value: stats?.events || 0, icon: 'fas fa-calendar-alt', color: '#0891b2', bg: '#cffafe', href: '/admin/events' },
    { label: 'Gallery Photos', value: stats?.gallery || 0, icon: 'fas fa-images', color: '#d946ef', bg: '#fae8ff', href: '/admin/gallery' },
    { label: 'Alumni', value: stats?.alumni || 0, icon: 'fas fa-graduation-cap', color: '#ea580c', bg: '#ffedd5', href: '/admin/alumni' },
  ];

  const actionIcons = { create: '🟢', update: '🔵', delete: '🔴' };

  return (
    <AdminLayout>
      <div className="admin-header">
        <div>
          <h1>Dashboard</h1>
          <p style={{ color: 'var(--gray-400)', fontSize: '0.82rem', margin: 0 }}>Welcome back! Here&apos;s your school overview.</p>
        </div>
        <div className="admin-header-actions">
          <a href="/admin/activity" className="admin-btn admin-btn-outline admin-btn-sm"><i className="fas fa-history"></i> Activity Log</a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-stats">
        {statCards.map((s, i) => (
          <a key={i} href={s.href} className="stat-card" style={{ textDecoration: 'none' }}>
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
              <i className={s.icon}></i>
            </div>
            <div className="stat-info">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          </a>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Recent Admissions */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3><i className="fas fa-file-alt" style={{ color: 'var(--gold)', marginRight: '0.4rem' }}></i> Recent Admissions</h3>
            <a href="/admin/admissions" className="admin-btn admin-btn-outline admin-btn-sm">View All</a>
          </div>
          <div className="admin-card-body" style={{ padding: 0 }}>
            {recentAdmissions.length === 0 ? (
              <p style={{ padding: '1rem', color: 'var(--gray-400)', fontSize: '0.82rem', textAlign: 'center' }}>No recent admissions</p>
            ) : (
              <table className="admin-table">
                <tbody>
                  {recentAdmissions.slice(0, 5).map(a => (
                    <tr key={a.id}>
                      <td style={{ fontWeight: 600, color: 'var(--navy)' }}>{a.studentName}</td>
                      <td style={{ fontSize: '0.78rem' }}>{a.grade}</td>
                      <td><span className={`status-badge ${a.status}`}>{a.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3><i className="fas fa-question-circle" style={{ color: 'var(--gold)', marginRight: '0.4rem' }}></i> Recent Enquiries</h3>
            <a href="/admin/enquiries" className="admin-btn admin-btn-outline admin-btn-sm">View All</a>
          </div>
          <div className="admin-card-body" style={{ padding: 0 }}>
            {recentEnquiries.length === 0 ? (
              <p style={{ padding: '1rem', color: 'var(--gray-400)', fontSize: '0.82rem', textAlign: 'center' }}>No recent enquiries</p>
            ) : (
              <table className="admin-table">
                <tbody>
                  {recentEnquiries.slice(0, 5).map(e => (
                    <tr key={e.id}>
                      <td style={{ fontWeight: 600, color: 'var(--navy)' }}>{e.name}</td>
                      <td style={{ fontSize: '0.78rem' }}>{e.subject || '-'}</td>
                      <td><span className={`status-badge ${e.status}`}>{e.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <div className="admin-card-header">
          <h3><i className="fas fa-history" style={{ color: 'var(--gold)', marginRight: '0.4rem' }}></i> Recent Activity</h3>
          <a href="/admin/activity" className="admin-btn admin-btn-outline admin-btn-sm">View All</a>
        </div>
        <div className="admin-card-body" style={{ padding: 0 }}>
          {recentActivity.length === 0 ? (
            <p style={{ padding: '1.5rem', color: 'var(--gray-400)', fontSize: '0.82rem', textAlign: 'center' }}>
              No recent activity. Actions will appear here as you use the admin panel.
            </p>
          ) : (
            recentActivity.map((log, i) => (
              <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.7rem 1.2rem', borderBottom: i < recentActivity.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <span style={{ fontSize: '1rem' }}>{actionIcons[log.action] || '⚪'}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.82rem', color: 'var(--navy)', margin: 0 }}>
                    <strong style={{ textTransform: 'capitalize' }}>{log.action}d</strong> {log.entityType}: <strong>{log.entityName}</strong>
                  </p>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--gray-400)' }}>
                  {new Date(log.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <div className="admin-card-header"><h3>Quick Actions</h3></div>
        <div className="admin-card-body">
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            <a href="/admin/staff" className="admin-btn admin-btn-outline"><i className="fas fa-user-plus"></i> Add Staff</a>
            <a href="/admin/events" className="admin-btn admin-btn-outline"><i className="fas fa-calendar-plus"></i> Add Event</a>
            <a href="/admin/gallery" className="admin-btn admin-btn-outline"><i className="fas fa-upload"></i> Upload Photo</a>
            <a href="/admin/notifications" className="admin-btn admin-btn-outline"><i className="fas fa-bullhorn"></i> New Announcement</a>
            <a href="/api/admin/export?type=admissions" className="admin-btn admin-btn-outline"><i className="fas fa-download"></i> Export Admissions</a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
