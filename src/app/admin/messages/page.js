'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import '@/styles/admin.css';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', title: '', message: '', role: 'president' });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/messages').then(r => r.json()).then(data => {
      setMessages(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let photoUrl = editId ? messages.find(m => m.id === editId)?.photo || '' : '';

    // Upload photo if selected
    if (photoFile) {
      const fd = new FormData();
      fd.append('file', photoFile);
      const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        photoUrl = uploadData.url;
      }
    }

    const method = editId ? 'PUT' : 'POST';
    const body = editId ? { ...form, id: editId, photo: photoUrl } : { ...form, photo: photoUrl };
    const res = await fetch('/api/admin/messages', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const saved = await res.json();
      if (editId) {
        setMessages(messages.map(m => m.id === editId ? saved : m));
      } else {
        setMessages([...messages, saved]);
      }
      setForm({ name: '', title: '', message: '', role: 'president' });
      setPhotoFile(null);
      setPhotoPreview('');
      setEditId(null);
    }
  };

  const startEdit = (m) => {
    setEditId(m.id);
    setForm({ name: m.name, title: m.title, message: m.message, role: m.role });
    setPhotoPreview(m.photo || '');
    setPhotoFile(null);
  };

  return (
    <AdminLayout>
      <div className="admin-header">
        <h1>President & Principal Messages</h1>
      </div>

      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-card-header">
          <h3>{editId ? 'Edit Message' : 'Add Message'}</h3>
          {editId && <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => { setEditId(null); setForm({ name: '', title: '', message: '', role: 'president' }); setPhotoPreview(''); setPhotoFile(null); }}>Cancel</button>}
        </div>
        <div className="admin-card-body">
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-row">
              <div className="form-group">
                <label className="form-label">Role *</label>
                <select className="form-select" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                  <option value="president">President</option>
                  <option value="principal">Principal</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="e.g., Mr. Laxmikant J. Aher" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Title / Designation</label>
              <input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g., Principal, Vasundhara Academy" />
            </div>

            {/* Photo Upload */}
            <div className="form-group">
              <label className="form-label">Photo</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {photoPreview && (
                  <img src={photoPreview} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--gold)' }} />
                )}
                <label className="image-upload-area" style={{ flex: 1, padding: '1rem', cursor: 'pointer' }}>
                  <i className="fas fa-camera" style={{ display: 'block', fontSize: '1.5rem' }}></i>
                  <p>{photoPreview ? 'Change Photo' : 'Upload Photo'}</p>
                  <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Message *</label>
              <textarea className="form-textarea" style={{ minHeight: '200px' }} value={form.message} onChange={e => setForm({...form, message: e.target.value})} required placeholder="Full message text..." />
            </div>
            <button type="submit" className="admin-btn admin-btn-primary">
              <i className="fas fa-save"></i> {editId ? 'Update' : 'Save'} Message
            </button>
          </form>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header"><h3>Saved Messages</h3></div>
        <div className="admin-card-body" style={{ padding: 0 }}>
          {loading ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-400)' }}><i className="fas fa-spinner fa-spin"></i> Loading...</p>
          ) : messages.length === 0 ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-400)' }}>No messages saved yet.</p>
          ) : (
            <table className="admin-table">
              <thead><tr><th>Photo</th><th>Role</th><th>Name</th><th>Preview</th><th>Actions</th></tr></thead>
              <tbody>
                {messages.map(m => (
                  <tr key={m.id}>
                    <td>
                      {m.photo ? (
                        <img src={m.photo} alt={m.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--navy)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                          {m.name?.charAt(0)}
                        </div>
                      )}
                    </td>
                    <td><span className="status-badge active" style={{ textTransform: 'capitalize' }}>{m.role}</span></td>
                    <td style={{ fontWeight: 600, color: 'var(--navy)' }}>{m.name}</td>
                    <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.message}</td>
                    <td>
                      <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => startEdit(m)}>
                        <i className="fas fa-edit"></i> Edit
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
