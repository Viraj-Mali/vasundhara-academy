'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

const categories = ['Achievement', 'Academic', 'Event', 'Sports', 'Cultural', 'Other'];
const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

const emptyForm = {
  title: '',
  description: '',
  category: 'Achievement',
  date: '',
  displayOrder: 0,
  isActive: true,
};

function dateInputValue(value) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
}

function isAllowedImage(file) {
  const name = (file?.name || '').toLowerCase();
  return allowedImageTypes.has(file?.type) && allowedImageExtensions.some((extension) => name.endsWith(extension));
}

export default function AdminStoriesAchievementsPage() {
  const [items, setItems] = useState([]);
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

  const loadItems = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/stories-achievements', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load stories and achievements.');
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      showToast(error.message || 'Unable to load stories and achievements.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
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
      category: categories.includes(item.category) ? item.category : 'Other',
      date: dateInputValue(item.date),
      displayOrder: item.displayOrder || 0,
      isActive: Boolean(item.isActive),
    });
    setImageFile(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const uploadImage = async (file) => {
    if (!isAllowedImage(file)) {
      throw new Error('Only JPG, JPEG, PNG, and WEBP images are allowed.');
    }
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('uploadContext', 'story-achievement-image');
    const response = await fetch('/api/admin/upload', { method: 'POST', body: uploadData });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.url) throw new Error(data.error || 'Image upload failed.');
    return data.url;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!editing && !imageFile) {
      showToast('Please choose an image.', 'error');
      return;
    }

    setSaving(true);
    try {
      const imageUrl = imageFile ? await uploadImage(imageFile) : editing.imageUrl;
      const response = await fetch('/api/admin/stories-achievements', {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(editing ? { id: editing.id } : {}),
          ...form,
          imageUrl,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Save failed.');

      resetForm();
      await loadItems();
      showToast(editing ? 'Story/Achievement updated.' : 'Story/Achievement added.');
    } catch (error) {
      showToast(error.message || 'Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (item) => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/stories-achievements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, isActive: !item.isActive }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Status update failed.');
      await loadItems();
      showToast('Status updated.');
    } catch (error) {
      showToast(error.message || 'Status update failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    try {
      const response = await fetch(`/api/admin/stories-achievements?id=${encodeURIComponent(item.id)}`, { method: 'DELETE' });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Delete failed.');
      await loadItems();
      showToast('Story/Achievement deleted.');
    } catch (error) {
      showToast(error.message || 'Delete failed.', 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="admin-header">
        <div>
          <h1>Stories & Achievements</h1>
          <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Add and manage cards displayed on the public Stories & Achievements page.
          </p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={showForm ? resetForm : openCreateForm}>
          <i className={`fas fa-${showForm ? 'times' : 'plus'}`}></i>
          {showForm ? 'Cancel' : 'Add Story / Achievement'}
        </button>
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <div className="admin-card-header">
            <h3>{editing ? 'Edit Story / Achievement' : 'Add Story / Achievement'}</h3>
          </div>
          <div className="admin-card-body">
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input className="form-input" required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
              </div>

              <div className="admin-form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                    {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input className="form-input" type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="form-group">
                  <label className="form-label">Display Order</label>
                  <input className="form-input" type="number" value={form.displayOrder} onChange={(event) => setForm({ ...form, displayOrder: event.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={form.isActive ? 'true' : 'false'} onChange={(event) => setForm({ ...form, isActive: event.target.value === 'true' })}>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              {editing?.imageUrl && (
                <div className="form-group">
                  <label className="form-label">Current Image</label>
                  <img src={editing.imageUrl} alt={editing.title} style={{ display: 'block', width: '180px', height: '110px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
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
                  {saving ? 'Saving...' : editing ? 'Update' : 'Add Story / Achievement'}
                </button>
                <button type="button" className="admin-btn admin-btn-outline" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Existing Stories & Achievements ({items.length})</h3>
          <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={loadItems}>
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr><th>Image</th><th>Story / Achievement</th><th>Category</th><th>Date</th><th>Order</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7">Loading stories and achievements...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan="7">No stories or achievements added yet.</td></tr>
              ) : items.map((item) => (
                <tr key={item.id}>
                  <td><img src={item.imageUrl} alt={item.title} style={{ width: '70px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} /></td>
                  <td>
                    <strong style={{ color: 'var(--navy)' }}>{item.title}</strong>
                    <p style={{ marginTop: '0.25rem', color: 'var(--gray-400)', maxWidth: '360px' }}>{item.description}</p>
                  </td>
                  <td><span className="status-badge active">{item.category}</span></td>
                  <td>{item.date ? new Date(item.date).toLocaleDateString('en-IN') : '-'}</td>
                  <td>{item.displayOrder}</td>
                  <td><span className={`status-badge ${item.isActive ? 'active' : 'read'}`}>{item.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <div className="admin-action-btns">
                      <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => openEditForm(item)}><i className="fas fa-edit"></i> Edit</button>
                      <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => toggleStatus(item)} disabled={saving}>
                        <i className={`fas fa-${item.isActive ? 'pause' : 'play'}`}></i> {item.isActive ? 'Inactive' : 'Active'}
                      </button>
                      <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(item)}><i className="fas fa-trash"></i> Delete</button>
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
