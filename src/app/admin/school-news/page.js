'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

const emptyForm = {
  title: '',
  description: '',
  isActive: true,
};

export default function AdminSchoolNewsPage() {
  const [news, setNews] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/school-news');
      const data = await res.json();
      setNews(Array.isArray(data) ? data : []);
    } catch (error) {
      showToast('Unable to load school news.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setImageFile(null);
    setEditing(null);
    setShowForm(false);
  };

  const openCreateForm = () => {
    setForm(emptyForm);
    setImageFile(null);
    setEditing(null);
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditing(item);
    setForm({
      title: item.title || '',
      description: item.description || '',
      isActive: Boolean(item.isActive),
    });
    setImageFile(null);
    setShowForm(true);
  };

  const appendFields = (fd) => {
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('isActive', String(form.isActive));
    if (imageFile) fd.append('image', imageFile);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!editing && !imageFile) {
      showToast('Please choose a news image.', 'error');
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      if (editing) fd.append('id', editing.id);
      appendFields(fd);

      const res = await fetch('/api/admin/school-news', {
        method: editing ? 'PATCH' : 'POST',
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Save failed.');

      resetForm();
      await fetchNews();
      showToast(editing ? 'School news updated.' : 'School news added.');
    } catch (error) {
      showToast(error.message || 'Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (item) => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('id', item.id);
      fd.append('title', item.title);
      fd.append('description', item.description);
      fd.append('isActive', String(!item.isActive));

      const res = await fetch('/api/admin/school-news', { method: 'PATCH', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Status update failed.');

      await fetchNews();
      showToast('Status updated.');
    } catch (error) {
      showToast(error.message || 'Status update failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Delete this school news item?')) return;

    try {
      const res = await fetch(`/api/admin/school-news?id=${encodeURIComponent(item.id)}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Delete failed.');

      await fetchNews();
      showToast('School news deleted.');
    } catch (error) {
      showToast(error.message || 'Delete failed.', 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="admin-header">
        <div>
          <h1>School News</h1>
          <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Add and manage public school news cards.
          </p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={showForm ? resetForm : openCreateForm}>
          <i className={`fas fa-${showForm ? 'times' : 'plus'}`}></i>
          {showForm ? 'Cancel' : 'Add News'}
        </button>
      </div>

      {showForm && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>{editing ? 'Edit School News' : 'Add School News'}</h3>
          </div>
          <div className="admin-card-body">
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  className="form-input"
                  required
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  required
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                />
              </div>

              <div className="admin-form-row">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={form.isActive ? 'true' : 'false'}
                    onChange={(event) => setForm({ ...form, isActive: event.target.value === 'true' })}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              {editing?.image && (
                <div className="form-group">
                  <label className="form-label">Current Image</label>
                  <img src={editing.image} alt="Current school news" className="school-news-admin-current" />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">{editing ? 'Replace Image' : 'Image'}</label>
                <label className="image-upload-area" style={{ display: 'block' }}>
                  <i className="fas fa-image"></i>
                  <p>{imageFile ? imageFile.name : 'Choose JPG, JPEG, PNG, or WEBP image'}</p>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={(event) => setImageFile(event.target.files?.[0] || null)}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              <div className="admin-header-actions">
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  <i className={`fas fa-${saving ? 'spinner fa-spin' : 'save'}`}></i>
                  {saving ? 'Saving...' : editing ? 'Update News' : 'Add News'}
                </button>
                <button type="button" className="admin-btn admin-btn-outline" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <h3>All School News</h3>
          <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={fetchNews}>
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4">Loading school news...</td></tr>
              ) : news.length === 0 ? (
                <tr><td colSpan="4">No school news added yet.</td></tr>
              ) : news.map((item) => (
                <tr key={item.id}>
                  <td><img src={item.image} alt={item.title} className="school-news-admin-thumb" /></td>
                  <td>
                    <strong style={{ color: 'var(--navy)' }}>{item.title}</strong>
                    <p style={{ marginTop: '0.25rem', color: 'var(--gray-400)', maxWidth: '360px' }}>
                      {item.description}
                    </p>
                  </td>
                  <td><span className={`status-badge ${item.isActive ? 'active' : 'read'}`}>{item.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <div className="admin-action-btns">
                      <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => openEditForm(item)}>
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => toggleStatus(item)} disabled={saving}>
                        <i className={`fas fa-${item.isActive ? 'pause' : 'play'}`}></i>
                        {item.isActive ? 'Inactive' : 'Active'}
                      </button>
                      <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(item)}>
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {toast && <div className={`admin-toast ${toast.type}`}>{toast.message}</div>}
    </AdminLayout>
  );
}
