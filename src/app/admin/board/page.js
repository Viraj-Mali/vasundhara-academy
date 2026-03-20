'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import '@/styles/admin.css';

export default function AdminBoard() {
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', designation: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/board').then(r => r.json()).then(data => {
      setMembers(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/admin/board', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const newMember = await res.json();
      setMembers([...members, newMember]);
      setForm({ name: '', designation: '' });
      setShowForm(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this board member?')) return;
    const res = await fetch(`/api/admin/board?id=${id}`, { method: 'DELETE' });
    if (res.ok) setMembers(members.filter(m => m.id !== id));
  };

  return (
    <AdminLayout>
      <div className="admin-header">
        <h1>Board of Directors</h1>
        <button className="admin-btn admin-btn-primary" onClick={() => setShowForm(!showForm)}>
          <i className={`fas fa-${showForm ? 'times' : 'plus'}`}></i> {showForm ? 'Cancel' : 'Add Member'}
        </button>
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <div className="admin-card-body">
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Designation *</label>
                  <input className="form-input" value={form.designation} onChange={e => setForm({...form, designation: e.target.value})} required placeholder="e.g., Chairperson, Secretary" />
                </div>
              </div>
              <button type="submit" className="admin-btn admin-btn-primary"><i className="fas fa-save"></i> Save Member</button>
            </form>
          </div>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header"><h3>Board Members ({members.length})</h3></div>
        <div className="admin-card-body" style={{ padding: 0 }}>
          {loading ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-400)' }}><i className="fas fa-spinner fa-spin"></i> Loading...</p>
          ) : members.length === 0 ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-400)' }}>No board members added yet.</p>
          ) : (
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Designation</th><th>Actions</th></tr></thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 600, color: 'var(--navy)' }}>{m.name}</td>
                    <td>{m.designation}</td>
                    <td>
                      <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(m.id)}>
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
