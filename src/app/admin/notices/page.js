'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import '@/styles/admin.css';

const categories = ['general', 'exam', 'holiday', 'circular', 'result'];
const priorities = ['low', 'normal', 'high', 'urgent'];
const priorityColors = { low: '#94a3b8', normal: '#3b82f6', high: '#f59e0b', urgent: '#ef4444' };

export default function NoticesAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notices, setNotices] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', category: 'general', priority: 'normal', active: true });
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { if (status === 'unauthenticated') router.push('/admin'); }, [status, router]);
  useEffect(() => { fetchNotices(); }, []);

  const fetchNotices = () => fetch('/api/admin/notices').then(r => r.json()).then(setNotices);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const body = editing ? { ...form, id: editing } : form;
    await fetch('/api/admin/notices', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setForm({ title: '', content: '', category: 'general', priority: 'normal', active: true });
    setEditing(null);
    setShowForm(false);
    fetchNotices();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this notice?')) return;
    await fetch('/api/admin/notices', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    fetchNotices();
  };

  const handleEdit = (n) => {
    setForm({ title: n.title, content: n.content, category: n.category, priority: n.priority, active: n.active });
    setEditing(n.id);
    setShowForm(true);
  };

  const toggleActive = async (n) => {
    await fetch('/api/admin/notices', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: n.id, active: !n.active }) });
    fetchNotices();
  };

  if (status === 'loading') return null;

  return (
    <AdminLayout>
      <div className="admin-header">
        <div>
          <h1 className="admin-title"><i className="fas fa-clipboard-list"></i> Notice Board</h1>
          <p className="admin-subtitle">Manage school notices and circulars</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ title: '', content: '', category: 'general', priority: 'normal', active: true }); }}>
          <i className={showForm ? 'fas fa-times' : 'fas fa-plus'}></i> {showForm ? 'Cancel' : 'New Notice'}
        </button>
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--navy)' }}>{editing ? 'Edit Notice' : 'New Notice'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="form-input" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Notice title" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="form-select" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                  {priorities.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Content *</label>
              <textarea className="form-textarea" required value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder="Notice content..." style={{ minHeight: '150px' }}></textarea>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1rem' }}>
              <input type="checkbox" checked={form.active} onChange={e => setForm({...form, active: e.target.checked})} /> Active (visible on website)
            </label>
            <button type="submit" className="btn btn-primary">{editing ? 'Update Notice' : 'Create Notice'}</button>
          </form>
        </div>
      )}

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notices.map(n => (
              <tr key={n.id}>
                <td><strong>{n.title}</strong></td>
                <td><span style={{ textTransform: 'capitalize' }}>{n.category}</span></td>
                <td>
                  <span style={{ color: priorityColors[n.priority], fontWeight: 600, fontSize: '0.82rem', textTransform: 'uppercase' }}>
                    ● {n.priority}
                  </span>
                </td>
                <td>
                  <button onClick={() => toggleActive(n)} className={`badge ${n.active ? 'badge-success' : 'badge-warning'}`} style={{ cursor: 'pointer', border: 'none' }}>
                    {n.active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td>{new Date(n.createdAt).toLocaleDateString('en-IN')}</td>
                <td>
                  <button onClick={() => handleEdit(n)} className="btn btn-sm btn-outline" style={{ marginRight: '0.5rem' }}><i className="fas fa-edit"></i></button>
                  <button onClick={() => handleDelete(n.id)} className="btn btn-sm" style={{ color: 'var(--error)' }}><i className="fas fa-trash"></i></button>
                </td>
              </tr>
            ))}
            {notices.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>No notices yet</td></tr>}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
