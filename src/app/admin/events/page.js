'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import '@/styles/admin.css';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'event', date: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/events').then(r => r.json()).then(data => {
      setEvents(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const res = await fetch('/api/admin/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, slug }),
    });
    if (res.ok) {
      const newEvent = await res.json();
      setEvents([newEvent, ...events]);
      setForm({ title: '', description: '', category: 'event', date: '' });
      setShowForm(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return;
    const res = await fetch(`/api/admin/events?id=${id}`, { method: 'DELETE' });
    if (res.ok) setEvents(events.filter(e => e.id !== id));
  };

  return (
    <AdminLayout>
      <div className="admin-header">
        <h1>Events Management</h1>
        <button className="admin-btn admin-btn-primary" onClick={() => setShowForm(!showForm)}>
          <i className={`fas fa-${showForm ? 'times' : 'plus'}`}></i> {showForm ? 'Cancel' : 'Add Event'}
        </button>
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <div className="admin-card-body">
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label className="form-label">Event Title *</label>
                <input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required placeholder="e.g., Annual Day Celebration 2026" />
              </div>
              <div className="admin-form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    <option value="event">Event</option>
                    <option value="achievement">Achievement</option>
                    <option value="media">Media Coverage</option>
                    <option value="celebration">Celebration</option>
                    <option value="competition">Competition</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input className="form-input" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea className="form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required placeholder="Describe the event..." />
              </div>
              <button type="submit" className="admin-btn admin-btn-primary"><i className="fas fa-save"></i> Save Event</button>
            </form>
          </div>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header"><h3>All Events ({events.length})</h3></div>
        <div className="admin-card-body" style={{ padding: 0 }}>
          {loading ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-400)' }}><i className="fas fa-spinner fa-spin"></i> Loading...</p>
          ) : events.length === 0 ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-400)' }}>No events yet.</p>
          ) : (
            <table className="admin-table">
              <thead><tr><th>Title</th><th>Category</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {events.map(e => (
                  <tr key={e.id}>
                    <td style={{ fontWeight: 600, color: 'var(--navy)' }}>{e.title}</td>
                    <td><span className="status-badge active">{e.category}</span></td>
                    <td>{new Date(e.date).toLocaleDateString('en-IN')}</td>
                    <td>
                      <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(e.id)}>
                        <i className="fas fa-trash"></i>
                      </button>
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
