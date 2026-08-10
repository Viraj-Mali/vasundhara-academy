'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import '@/styles/admin.css';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'event', date: '', photos: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/events').then(r => r.json()).then(data => {
      setEvents(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('gallery', 'false');
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok && data.url) {
        setForm(prev => ({ ...prev, photos: data.url }));
      }
    } catch (err) {
      console.error('Photo upload failed:', err);
    }
  };

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
      setForm({ title: '', description: '', category: 'event', date: '', photos: '' });
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
                  <label className="form-label">Date</label>
                  <input className="form-input" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea className="form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required placeholder="Describe the event..." />
              </div>
              <div className="form-group">
                <label className="form-label">Event Cover Image</label>
                {form.photos && (
                  <div style={{ marginBottom: '0.5rem' }}>
                    <img 
                      src={form.photos} 
                      alt="Cover Preview" 
                      style={{ width: '120px', height: '80px', borderRadius: 'var(--radius-md)', objectFit: 'cover', display: 'block' }} 
                    />
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/jpg, image/webp" 
                  onChange={handlePhotoUpload} 
                  style={{ fontSize: '0.82rem' }} 
                />
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
              <thead><tr><th>Preview</th><th>Title</th><th>Category</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {events.map(e => {
                  const getPreviewUrl = (photosField) => {
                    if (!photosField) return '';
                    try {
                      if (photosField.trim().startsWith('[')) {
                        const arr = JSON.parse(photosField);
                        if (Array.isArray(arr) && arr.length > 0) return arr[0];
                      }
                    } catch (err) {}
                    return photosField;
                  };
                  const previewUrl = getPreviewUrl(e.photos);

                  return (
                    <tr key={e.id}>
                      <td>
                        {previewUrl ? (
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            style={{ width: '50px', height: '35px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} 
                          />
                        ) : (
                          <div style={{ width: '50px', height: '35px', borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg, var(--navy), var(--navy-light))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="fas fa-image" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}></i>
                          </div>
                        )}
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--navy)' }}>{e.title}</td>
                      <td><span className="status-badge active">{e.category}</span></td>
                      <td>{new Date(e.date).toLocaleDateString('en-IN')}</td>
                      <td>
                        <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(e.id)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
