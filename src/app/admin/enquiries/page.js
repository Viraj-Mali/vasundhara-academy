'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import '@/styles/admin.css';

export default function AdminEnquiries() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const fetchData = () => {
    fetch('/api/admin/enquiries').then(r => r.json()).then(data => { setItems(data); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(fetchData, []);

  const handleStatus = async (id, status) => {
    await fetch('/api/admin/enquiries', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    showToast(`Status: ${status}`);
    fetchData();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    await fetch(`/api/admin/enquiries?id=${id}`, { method: 'DELETE' });
    showToast('Deleted!');
    fetchData();
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.length} selected?`)) return;
    await fetch(`/api/admin/enquiries?ids=${selected.join(',')}`, { method: 'DELETE' });
    showToast(`${selected.length} deleted!`);
    setSelected([]);
    fetchData();
  };

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const filtered = items.filter(i => {
    const q = search.toLowerCase();
    const matchSearch = i.name.toLowerCase().includes(q) || i.phone.includes(q) || (i.subject || '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || i.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(i => i.id));

  return (
    <AdminLayout>
      <div className="admin-header">
        <h1>Enquiries</h1>
        <div className="admin-header-actions">
          <a href="/api/admin/export?type=enquiries" className="admin-btn admin-btn-outline admin-btn-sm"><i className="fas fa-download"></i> Export CSV</a>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {['all', 'new', 'read', 'replied'].map(s => (
          <button key={s} className={`admin-btn admin-btn-sm ${statusFilter === s ? 'admin-btn-primary' : 'admin-btn-outline'}`} onClick={() => setStatusFilter(s)} style={{ textTransform: 'capitalize' }}>
            {s} {s !== 'all' && `(${items.filter(i => i.status === s).length})`}
          </button>
        ))}
      </div>

      <div className="admin-search">
        <i className="fas fa-search"></i>
        <input placeholder="Search by name, phone, or subject..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {selected.length > 0 && (
        <div className="bulk-bar">
          <span><strong>{selected.length}</strong> selected</span>
          <div className="bulk-bar-actions">
            <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={handleBulkDelete}><i className="fas fa-trash"></i> Delete</button>
            <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => setSelected([])}><i className="fas fa-times"></i></button>
          </div>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-body" style={{ padding: 0 }}>
          {loading ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-400)' }}><i className="fas fa-spinner fa-spin"></i> Loading...</p>
          ) : filtered.length === 0 ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-400)' }}>No enquiries found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th><input type="checkbox" className="admin-checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} /></th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(e => (
                    <tr key={e.id}>
                      <td><input type="checkbox" className="admin-checkbox" checked={selected.includes(e.id)} onChange={() => toggleSelect(e.id)} /></td>
                      <td style={{ fontWeight: 600, color: 'var(--navy)' }}>{e.name}</td>
                      <td>{e.phone}</td>
                      <td>{e.subject || '-'}</td>
                      <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.message}</td>
                      <td>
                        <select value={e.status} onChange={ev => handleStatus(e.id, ev.target.value)} style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '0.75rem' }}>
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                        </select>
                      </td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>{new Date(e.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>
                        <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(e.id)}><i className="fas fa-trash"></i></button>
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
