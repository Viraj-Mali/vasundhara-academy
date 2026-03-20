'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import '@/styles/admin.css';

export default function AdminCommittees() {
  const [committees, setCommittees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [memberForm, setMemberForm] = useState({ name: '', designation: '', phone: '' });
  const [addingMemberId, setAddingMemberId] = useState(null);
  const [editMember, setEditMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const loadCommittees = () => {
    fetch('/api/admin/committees').then(r => r.json()).then(data => {
      setCommittees(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { loadCommittees(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/admin/committees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ name: '', description: '' });
      setShowForm(false);
      showToast('Committee created!');
      loadCommittees();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this committee and all its members?')) return;
    await fetch(`/api/admin/committees?id=${id}`, { method: 'DELETE' });
    showToast('Committee deleted!');
    loadCommittees();
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/admin/committees/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...memberForm, committeeId: addingMemberId }),
    });
    if (res.ok) {
      setMemberForm({ name: '', designation: '', phone: '' });
      setAddingMemberId(null);
      showToast('Member added!');
      loadCommittees();
    }
  };

  const handleEditMember = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/admin/committees/members', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editMember),
    });
    if (res.ok) {
      setEditMember(null);
      showToast('Member updated!');
      loadCommittees();
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (!confirm('Remove this member?')) return;
    await fetch(`/api/admin/committees/members?id=${memberId}`, { method: 'DELETE' });
    showToast('Member removed!');
    loadCommittees();
  };

  return (
    <AdminLayout>
      <div className="admin-header">
        <h1>Committees</h1>
        <button className="admin-btn admin-btn-primary" onClick={() => setShowForm(!showForm)}>
          <i className={`fas fa-${showForm ? 'times' : 'plus'}`}></i> {showForm ? 'Cancel' : 'Add Committee'}
        </button>
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <div className="admin-card-body">
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label className="form-label">Committee Name *</label>
                <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="e.g., Sakhi Savitri Committee" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Brief description..." style={{ minHeight: '80px' }} />
              </div>
              <button type="submit" className="admin-btn admin-btn-primary"><i className="fas fa-save"></i> Save Committee</button>
            </form>
          </div>
        </div>
      )}

      {loading && <p style={{ textAlign: 'center', color: 'var(--gray-400)' }}><i className="fas fa-spinner fa-spin"></i> Loading...</p>}

      {committees.map(c => (
        <div key={c.id} className="admin-card" style={{ marginBottom: '1rem' }}>
          <div className="admin-card-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-people-arrows" style={{ color: 'var(--gold)' }}></i> {c.name}
              <span style={{ fontSize: '0.72rem', color: 'var(--gray-400)', fontWeight: 400 }}>({c.members?.length || 0} members)</span>
            </h3>
            <div className="admin-action-btns">
              <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={() => { setAddingMemberId(addingMemberId === c.id ? null : c.id); setMemberForm({ name: '', designation: '', phone: '' }); }}>
                <i className="fas fa-user-plus"></i> Add Member
              </button>
              <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(c.id)}>
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
          <div className="admin-card-body" style={{ padding: 0 }}>
            {/* Add Member Form */}
            {addingMemberId === c.id && (
              <div style={{ padding: '1rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                <form onSubmit={handleAddMember} style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <div className="form-group" style={{ flex: 1, minWidth: '150px', marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.72rem' }}>Name *</label>
                    <input className="form-input" value={memberForm.name} onChange={e => setMemberForm({...memberForm, name: e.target.value})} required placeholder="Member name" />
                  </div>
                  <div className="form-group" style={{ flex: 1, minWidth: '150px', marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.72rem' }}>Designation *</label>
                    <input className="form-input" value={memberForm.designation} onChange={e => setMemberForm({...memberForm, designation: e.target.value})} required placeholder="e.g., President, Member" />
                  </div>
                  <div className="form-group" style={{ flex: 1, minWidth: '150px', marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.72rem' }}>Category</label>
                    <input className="form-input" value={memberForm.phone} onChange={e => setMemberForm({...memberForm, phone: e.target.value})} placeholder="e.g., Teacher Representative" />
                  </div>
                  <button type="submit" className="admin-btn admin-btn-primary admin-btn-sm"><i className="fas fa-plus"></i> Add</button>
                </form>
              </div>
            )}

            {/* Members List */}
            {c.members && c.members.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {c.members.map(m => (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 600, color: 'var(--navy)' }}>{m.name}</td>
                      <td>
                        <span style={{
                          display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 600,
                          background: m.designation === 'President' ? 'rgba(212,168,83,0.15)' :
                                     m.designation === 'Vice President' ? 'rgba(37,99,235,0.1)' :
                                     m.designation === 'Member Secretary' ? 'rgba(5,150,105,0.1)' : '#f1f5f9',
                          color: m.designation === 'President' ? 'var(--gold-dark)' :
                                m.designation === 'Vice President' ? '#2563eb' :
                                m.designation === 'Member Secretary' ? '#059669' : 'var(--gray-500)',
                        }}>{m.designation}</span>
                      </td>
                      <td style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>{m.phone || '-'}</td>
                      <td>
                        <div className="admin-action-btns">
                          <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => setEditMember({ ...m })}>
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDeleteMember(m.id)}>
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ padding: '1rem 1.5rem', color: 'var(--gray-400)', fontSize: '0.82rem' }}>No members added. Click &quot;Add Member&quot; to add.</p>
            )}
          </div>
        </div>
      ))}

      {/* Edit Member Modal */}
      {editMember && (
        <div className="admin-modal-overlay" onClick={() => setEditMember(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>Edit Committee Member</h3>
            <form onSubmit={handleEditMember} className="admin-form">
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input className="form-input" required value={editMember.name} onChange={e => setEditMember({...editMember, name: e.target.value})} />
              </div>
              <div className="admin-form-row">
                <div className="form-group">
                  <label className="form-label">Designation *</label>
                  <select className="form-select" value={editMember.designation} onChange={e => setEditMember({...editMember, designation: e.target.value})}>
                    <option value="President">President</option>
                    <option value="Vice President">Vice President</option>
                    <option value="Member Secretary">Member Secretary</option>
                    <option value="Member">Member</option>
                    <option value="Invited Member">Invited Member</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input className="form-input" value={editMember.phone || ''} onChange={e => setEditMember({...editMember, phone: e.target.value})} placeholder="e.g., Teacher Representative" />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setEditMember(null)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary">Update Member</button>
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
