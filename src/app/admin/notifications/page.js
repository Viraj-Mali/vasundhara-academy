'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import '@/styles/admin.css';

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', type: 'announcement', active: true });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/notifications').then(r => r.json()).then(data => {
      setNotifications(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/admin/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const newNotif = await res.json();
      setNotifications([newNotif, ...notifications]);
      setForm({ title: '', content: '', type: 'announcement', active: true });
      setShowForm(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this notification?')) return;
    const res = await fetch(`/api/admin/notifications?id=${id}`, { method: 'DELETE' });
    if (res.ok) setNotifications(notifications.filter(n => n.id !== id));
  };

  const toggleActive = async (id, active) => {
    const res = await fetch('/api/admin/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, active: !active }),
    });
    if (res.ok) {
      setNotifications(notifications.map(n => n.id === id ? { ...n, active: !active } : n));
    }
  };

  return (
    <AdminLayout>
      <div className="admin-header">
        <h1>Notifications</h1>
        <button className="admin-btn admin-btn-primary" onClick={() => setShowForm(!showForm)}>
          <i className={`fas fa-${showForm ? 'times' : 'plus'}`}></i> {showForm ? 'Cancel' : 'Add Notification'}
        </button>
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <div className="admin-card-body">
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required placeholder="e.g., Admissions Open for 2026-27" />
              </div>
              <div className="admin-form-row">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select className="form-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                    <option value="announcement">Announcement</option>
                    <option value="news">News</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={form.active} onChange={e => setForm({...form, active: e.target.value === 'true'})}>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Content (optional)</label>
                <textarea className="form-textarea" value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder="Additional details..." />
              </div>
              <button type="submit" className="admin-btn admin-btn-primary"><i className="fas fa-save"></i> Save Notification</button>
            </form>
          </div>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <h3>All Notifications</h3>
        </div>
        <div className="admin-card-body" style={{ padding: 0 }}>
          {loading ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-400)' }}><i className="fas fa-spinner fa-spin"></i> Loading...</p>
          ) : notifications.length === 0 ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-400)' }}>No notifications yet. Click &quot;Add Notification&quot; to create one.</p>
          ) : (
            <table className="admin-table">
              <thead><tr><th>Title</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {notifications.map(n => (
                  <tr key={n.id}>
                    <td style={{ fontWeight: 600, color: 'var(--navy)' }}>{n.title}</td>
                    <td><span className="status-badge" style={{ background: '#dbeafe', color: '#1e40af' }}>{n.type}</span></td>
                    <td>
                      <span className={`status-badge ${n.active ? 'active' : 'read'}`} style={{ cursor: 'pointer' }} onClick={() => toggleActive(n.id, n.active)}>
                        {n.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-action-btns">
                        <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(n.id)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
