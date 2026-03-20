'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import '@/styles/admin.css';

export default function AdminStaff() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', designation: '', qualification: '', subject: '', category: 'teaching', photo: '' });
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const fetchData = () => {
    fetch('/api/admin/staff').then(r => r.json()).then(data => { setItems(data); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(fetchData, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editItem ? 'PUT' : 'POST';
    const body = editItem ? { ...form, id: editItem.id } : form;
    const res = await fetch('/api/admin/staff', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) {
      showToast(editItem ? 'Staff updated!' : 'Staff added!');
      setShowForm(false); setEditItem(null);
      setForm({ name: '', designation: '', qualification: '', subject: '', category: 'teaching', photo: '' });
      fetchData();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this staff member?')) return;
    await fetch(`/api/admin/staff?id=${id}`, { method: 'DELETE' });
    showToast('Deleted!');
    fetchData();
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.length} selected items?`)) return;
    await fetch(`/api/admin/staff?ids=${selected.join(',')}`, { method: 'DELETE' });
    showToast(`${selected.length} items deleted!`);
    setSelected([]);
    fetchData();
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setForm({ name: item.name, designation: item.designation, qualification: item.qualification || '', subject: item.subject || '', category: item.category, photo: item.photo || '' });
    setShowForm(true);
  };

  const handleReorder = async (id, direction) => {
    const idx = items.findIndex(i => i.id === id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= items.length) return;
    await fetch('/api/admin/staff', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: items[idx].id, order: items[swapIdx].order }) });
    await fetch('/api/admin/staff', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: items[swapIdx].id, order: items[idx].order }) });
    fetchData();
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('gallery', 'false');
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const data = await res.json();
    setForm({ ...form, photo: data.url });
  };

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(i => i.id));

  const filtered = items.filter(i => {
    const q = search.toLowerCase();
    return i.name.toLowerCase().includes(q) || i.designation.toLowerCase().includes(q) || (i.subject || '').toLowerCase().includes(q);
  });

  return (
    <AdminLayout>
      <div className="admin-header">
        <h1>Staff Management</h1>
        <div className="admin-header-actions">
          <a href="/api/admin/export?type=staff" className="admin-btn admin-btn-outline admin-btn-sm"><i className="fas fa-download"></i> Export CSV</a>
          <button className="admin-btn admin-btn-primary" onClick={() => { setEditItem(null); setForm({ name: '', designation: '', qualification: '', subject: '', category: 'teaching', photo: '' }); setShowForm(true); }}>
            <i className="fas fa-plus"></i> Add Staff
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="admin-search">
        <i className="fas fa-search"></i>
        <input placeholder="Search by name, designation, or subject..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Bulk Actions */}
      {selected.length > 0 && (
        <div className="bulk-bar">
          <span><strong>{selected.length}</strong> selected</span>
          <div className="bulk-bar-actions">
            <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={handleBulkDelete}>
              <i className="fas fa-trash"></i> Delete Selected
            </button>
            <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => setSelected([])}>
              <i className="fas fa-times"></i> Clear
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="admin-card">
        <div className="admin-card-body" style={{ padding: 0 }}>
          {loading ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-400)' }}><i className="fas fa-spinner fa-spin"></i> Loading...</p>
          ) : filtered.length === 0 ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-400)' }}>No staff found.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th><input type="checkbox" className="admin-checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} /></th>
                  <th>Order</th>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Subject</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, idx) => (
                  <tr key={s.id}>
                    <td><input type="checkbox" className="admin-checkbox" checked={selected.includes(s.id)} onChange={() => toggleSelect(s.id)} /></td>
                    <td>
                      <div className="reorder-btns">
                        <button className="reorder-btn" onClick={() => handleReorder(s.id, 'up')} disabled={idx === 0}><i className="fas fa-chevron-up"></i></button>
                        <button className="reorder-btn" onClick={() => handleReorder(s.id, 'down')} disabled={idx === filtered.length - 1}><i className="fas fa-chevron-down"></i></button>
                      </div>
                    </td>
                    <td>
                      {s.photo ? (
                        <img src={s.photo} alt={s.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--navy)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>{s.name?.charAt(0)}</div>
                      )}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--navy)' }}>{s.name}</td>
                    <td>{s.designation}</td>
                    <td>{s.subject || '-'}</td>
                    <td><span className={`status-badge ${s.category === 'teaching' ? 'active' : 'reviewed'}`} style={{ textTransform: 'capitalize' }}>{s.category}</span></td>
                    <td>
                      <div className="admin-action-btns">
                        <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => handleEdit(s)}><i className="fas fa-edit"></i></button>
                        <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(s.id)}><i className="fas fa-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>{editItem ? 'Edit Staff Member' : 'Add New Staff Member'}</h3>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Designation *</label>
                  <input className="form-input" required value={form.designation} onChange={e => setForm({...form, designation: e.target.value})} />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="form-group">
                  <label className="form-label">Qualification</label>
                  <input className="form-input" value={form.qualification} onChange={e => setForm({...form, qualification: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input className="form-input" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  <option value="teaching">Teaching</option>
                  <option value="non-teaching">Non-Teaching</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Photo</label>
                {form.photo && <img src={form.photo} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '0.5rem', display: 'block' }} />}
                <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ fontSize: '0.82rem' }} />
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary">{editItem ? 'Update' : 'Add Staff'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className={`admin-toast ${toast.type}`}><i className={`fas fa-${toast.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i> {toast.msg}</div>}
    </AdminLayout>
  );
}
