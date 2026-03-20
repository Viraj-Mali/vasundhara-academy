'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import '@/styles/admin.css';

export default function AdminAlumni() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/alumni').then(r => r.json()).then(data => {
      setAlumni(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this alumni record?')) return;
    const res = await fetch(`/api/admin/alumni?id=${id}`, { method: 'DELETE' });
    if (res.ok) setAlumni(alumni.filter(a => a.id !== id));
  };

  return (
    <AdminLayout>
      <div className="admin-header">
        <h1>Alumni Records</h1>
        <span style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>{alumni.length} registered</span>
      </div>

      <div className="admin-card">
        <div className="admin-card-body" style={{ padding: 0 }}>
          {loading ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-400)' }}><i className="fas fa-spinner fa-spin"></i> Loading...</p>
          ) : alumni.length === 0 ? (
            <p style={{ padding: '3rem', textAlign: 'center', color: 'var(--gray-400)' }}>
              <i className="fas fa-graduation-cap" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}></i>
              No alumni registrations yet.
            </p>
          ) : (
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Grad Year</th><th>Occupation</th><th>Phone</th><th>Email</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {alumni.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 600, color: 'var(--navy)' }}>{a.name}</td>
                    <td>{a.graduateYear}</td>
                    <td>{a.occupation || '-'}</td>
                    <td>{a.phone || '-'}</td>
                    <td>{a.email || '-'}</td>
                    <td style={{ fontSize: '0.78rem' }}>{new Date(a.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(a.id)}>
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
