'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import '@/styles/admin.css';

const categories = ['news', 'announcement', 'article', 'achievement'];

export default function BlogAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', excerpt: '', category: 'news', published: false, featured: false, author: '' });
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { if (status === 'unauthenticated') router.push('/admin'); }, [status, router]);
  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = () => fetch('/api/admin/blog').then(r => r.json()).then(setPosts);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const body = editing ? { ...form, id: editing } : form;
    await fetch('/api/admin/blog', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setForm({ title: '', content: '', excerpt: '', category: 'news', published: false, featured: false, author: '' });
    setEditing(null);
    setShowForm(false);
    fetchPosts();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    await fetch('/api/admin/blog', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    fetchPosts();
  };

  const handleEdit = (p) => {
    setForm({ title: p.title, content: p.content, excerpt: p.excerpt || '', category: p.category, published: p.published, featured: p.featured, author: p.author || '' });
    setEditing(p.id);
    setShowForm(true);
  };

  const togglePublish = async (p) => {
    await fetch('/api/admin/blog', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: p.id, published: !p.published }) });
    fetchPosts();
  };

  if (status === 'loading') return null;

  return (
    <AdminLayout>
      <div className="admin-header">
        <div>
          <h1 className="admin-title"><i className="fas fa-newspaper"></i> Blog & News</h1>
          <p className="admin-subtitle">Create and manage blog posts and news articles</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ title: '', content: '', excerpt: '', category: 'news', published: false, featured: false, author: '' }); }}>
          <i className={showForm ? 'fas fa-times' : 'fas fa-plus'}></i> {showForm ? 'Cancel' : 'New Post'}
        </button>
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--navy)' }}>{editing ? 'Edit Post' : 'New Blog Post'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="form-input" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Post title" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Author</label>
                <input className="form-input" value={form.author} onChange={e => setForm({...form, author: e.target.value})} placeholder="Author name" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Excerpt (short preview)</label>
              <input className="form-input" value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} placeholder="Brief summary for cards" />
            </div>
            <div className="form-group">
              <label className="form-label">Content *</label>
              <textarea className="form-textarea" required value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder="Full post content..." style={{ minHeight: '200px' }}></textarea>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.published} onChange={e => setForm({...form, published: e.target.checked})} /> Publish
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} /> Featured
              </label>
            </div>
            <button type="submit" className="btn btn-primary">{editing ? 'Update Post' : 'Create Post'}</button>
          </form>
        </div>
      )}

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(p => (
              <tr key={p.id}>
                <td>
                  <strong>{p.title}</strong>
                  {p.featured && <span className="badge badge-gold" style={{ marginLeft: '0.5rem' }}>Featured</span>}
                </td>
                <td><span style={{ textTransform: 'capitalize' }}>{p.category}</span></td>
                <td>
                  <button onClick={() => togglePublish(p)} className={`badge ${p.published ? 'badge-success' : 'badge-warning'}`} style={{ cursor: 'pointer', border: 'none' }}>
                    {p.published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td>{new Date(p.createdAt).toLocaleDateString('en-IN')}</td>
                <td>
                  <button onClick={() => handleEdit(p)} className="btn btn-sm btn-outline" style={{ marginRight: '0.5rem' }}><i className="fas fa-edit"></i></button>
                  <button onClick={() => handleDelete(p.id)} className="btn btn-sm" style={{ color: 'var(--error)' }}><i className="fas fa-trash"></i></button>
                </td>
              </tr>
            ))}
            {posts.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>No blog posts yet</td></tr>}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
