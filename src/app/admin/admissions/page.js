'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import '@/styles/admin.css';

export default function AdminAdmissions() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const fetchData = () => {
    fetch('/api/admin/admissions').then(r => r.json()).then(data => { setItems(data); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(fetchData, []);

  const handleStatus = async (id, status) => {
    await fetch('/api/admin/admissions', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    showToast(`Status updated to ${status}`);
    fetchData();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this application?')) return;
    await fetch(`/api/admin/admissions?id=${id}`, { method: 'DELETE' });
    showToast('Deleted!');
    fetchData();
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.length} selected?`)) return;
    await fetch(`/api/admin/admissions?ids=${selected.join(',')}`, { method: 'DELETE' });
    showToast(`${selected.length} deleted!`);
    setSelected([]);
    fetchData();
  };

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const filtered = items.filter(i => {
    const q = search.toLowerCase();
    const matchSearch = i.studentName.toLowerCase().includes(q) || i.parentName.toLowerCase().includes(q) || i.phone.includes(q);
    const matchStatus = statusFilter === 'all' || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(i => i.id));

  return (
    <AdminLayout>
      <div className="admin-header">
        <h1>Admissions</h1>
        <div className="admin-header-actions">
          <a href="/api/admin/export?type=admissions" className="admin-btn admin-btn-outline admin-btn-sm"><i className="fas fa-download"></i> Export CSV</a>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {['all', 'pending', 'reviewed', 'accepted', 'rejected'].map(s => (
          <button key={s} className={`admin-btn admin-btn-sm ${statusFilter === s ? 'admin-btn-primary' : 'admin-btn-outline'}`} onClick={() => setStatusFilter(s)} style={{ textTransform: 'capitalize' }}>
            {s} {s !== 'all' && `(${items.filter(i => i.status === s).length})`}
          </button>
        ))}
      </div>

      <div className="admin-search">
        <i className="fas fa-search"></i>
        <input placeholder="Search by student name, parent name, or phone..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {selected.length > 0 && (
        <div className="bulk-bar">
          <span><strong>{selected.length}</strong> selected</span>
          <div className="bulk-bar-actions">
            <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={handleBulkDelete}><i className="fas fa-trash"></i> Delete Selected</button>
            <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => setSelected([])}><i className="fas fa-times"></i> Clear</button>
          </div>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-body" style={{ padding: 0 }}>
          {loading ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-400)' }}><i className="fas fa-spinner fa-spin"></i> Loading...</p>
          ) : filtered.length === 0 ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-400)' }}>No applications found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th><input type="checkbox" className="admin-checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} /></th>
                    <th>Student</th>
                    <th>Parent</th>
                    <th>Phone</th>
                    <th>Grade</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(a => (
                    <tr key={a.id}>
                      <td><input type="checkbox" className="admin-checkbox" checked={selected.includes(a.id)} onChange={() => toggleSelect(a.id)} /></td>
                      <td style={{ fontWeight: 600, color: 'var(--navy)' }}>{a.studentName}</td>
                      <td>{a.parentName}</td>
                      <td>{a.phone}</td>
                      <td>{a.grade}</td>
                      <td>
                        <select value={a.status} onChange={e => handleStatus(a.id, e.target.value)} style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '0.75rem' }}>
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>{new Date(a.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                          <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(a.id)} title="Delete"><i className="fas fa-trash"></i></button>
                          <a 
                            href={`https://wa.me/${a.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${a.parentName}, the application status for ${a.studentName} at Vasundhara Academy has been updated to: ${a.status.toUpperCase()}. \n\nYou can track the live progress here: ${typeof window !== 'undefined' ? window.location.origin : ''}/admissions/track?id=${a.id}`)}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="admin-btn admin-btn-outline admin-btn-sm"
                            style={{ color: '#25D366', borderColor: '#25D366' }}
                            title="Notify via WhatsApp"
                          >
                            <i className="fab fa-whatsapp"></i>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {toast && <div className={`admin-toast ${toast.type}`}><i className={`fas fa-${toast.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i> {toast.msg}</div>}
    </AdminLayout>
  );
}
