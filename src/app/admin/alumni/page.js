'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import '@/styles/admin.css';

export default function AdminAlumni() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlumni, setSelectedAlumni] = useState(null);

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
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Year of X/XII</th>
                  <th>Status / Occupation</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {alumni.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 600, color: 'var(--navy)' }}>{a.name}</td>
                    <td>{a.graduateYear}</td>
                    <td>{a.employmentStatus || a.occupation || '-'}</td>
                    <td>{a.phone || '-'}</td>
                    <td>{a.email || '-'}</td>
                    <td style={{ fontSize: '0.78rem' }}>{new Date(a.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => setSelectedAlumni(a)} style={{ marginRight: '0.5rem' }} title="View details">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(a.id)} title="Delete record">
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

      {selectedAlumni && (
        <div className="admin-modal-overlay" onClick={() => setSelectedAlumni(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="admin-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--navy)', margin: 0 }}>Alumni Details</h2>
              <button onClick={() => setSelectedAlumni(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--gray-400)' }}>&times;</button>
            </div>
            <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '70vh', overflowY: 'auto' }}>
              <div>
                <strong>Full Name:</strong>
                <p style={{ margin: '0.2rem 0 0', color: 'var(--gray-700)' }}>{selectedAlumni.name}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <strong>Year of X / XII Passed:</strong>
                  <p style={{ margin: '0.2rem 0 0', color: 'var(--gray-700)' }}>{selectedAlumni.graduateYear}</p>
                </div>
                <div>
                  <strong>Educational Qualification:</strong>
                  <p style={{ margin: '0.2rem 0 0', color: 'var(--gray-700)' }}>{selectedAlumni.education || 'N/A'}</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <strong>Current Employment Status:</strong>
                  <p style={{ margin: '0.2rem 0 0', color: 'var(--gray-700)' }}>{selectedAlumni.employmentStatus || 'N/A'}</p>
                </div>
                <div>
                  <strong>Company Name:</strong>
                  <p style={{ margin: '0.2rem 0 0', color: 'var(--gray-700)' }}>{selectedAlumni.companyName || 'N/A'}</p>
                </div>
              </div>
              {selectedAlumni.businessDetails && (
                <div>
                  <strong>Business Details:</strong>
                  <p style={{ margin: '0.2rem 0 0', color: 'var(--gray-700)', whiteSpace: 'pre-wrap' }}>{selectedAlumni.businessDetails}</p>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <strong>Phone Number:</strong>
                  <p style={{ margin: '0.2rem 0 0', color: 'var(--gray-700)' }}>{selectedAlumni.phone || 'N/A'}</p>
                </div>
                <div>
                  <strong>Email:</strong>
                  <p style={{ margin: '0.2rem 0 0', color: 'var(--gray-700)' }}>{selectedAlumni.email || 'N/A'}</p>
                </div>
              </div>
              {selectedAlumni.occupation && (
                <div>
                  <strong>Old Occupation (Legacy):</strong>
                  <p style={{ margin: '0.2rem 0 0', color: 'var(--gray-700)' }}>{selectedAlumni.occupation}</p>
                </div>
              )}
              <div>
                <strong>Message / Memory to Share:</strong>
                <p style={{ margin: '0.2rem 0 0', color: 'var(--gray-700)', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{selectedAlumni.message || 'N/A'}</p>
              </div>
              <div>
                <strong>Registration Date:</strong>
                <p style={{ margin: '0.2rem 0 0', color: 'var(--gray-700)' }}>{new Date(selectedAlumni.createdAt).toLocaleString('en-IN')}</p>
              </div>
            </div>
            <div className="admin-modal-footer" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginTop: '1.5rem', textAlign: 'right' }}>
              <button className="admin-btn admin-btn-outline" onClick={() => setSelectedAlumni(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
