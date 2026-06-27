'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

const initialForm = {
  displayOrder: 0,
  isActive: true,
};

export default function AdminHeroBackgroundSlider() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [editing, setEditing] = useState(null);
  const [replacementFile, setReplacementFile] = useState(null);
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
      const res = await fetch('/api/admin/hero-background-slider');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      showToast('Unable to load slider images.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const appendFormFields = (fd, values) => {
    fd.append('displayOrder', String(values.displayOrder || 0));
    fd.append('isActive', String(Boolean(values.isActive)));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    if (!imageFile) {
      showToast('Please choose a hero background image.', 'error');
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('image', imageFile);
      appendFormFields(fd, form);

      const res = await fetch('/api/admin/hero-background-slider', { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Upload failed.');

      setForm(initialForm);
      setImageFile(null);
      event.target.reset();
      await loadItems();
      showToast('Hero background image uploaded.');
    } catch (error) {
      showToast(error.message || 'Upload failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!editing) return;

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('id', editing.id);
      if (replacementFile) fd.append('image', replacementFile);
      appendFormFields(fd, editing);

      const res = await fetch('/api/admin/hero-background-slider', { method: 'PATCH', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Update failed.');

      setEditing(null);
      setReplacementFile(null);
      await loadItems();
      showToast('Hero background image updated.');
    } catch (error) {
      showToast(error.message || 'Update failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateItem = async (item, changes) => {
    const fd = new FormData();
    fd.append('id', item.id);
    appendFormFields(fd, { ...item, ...changes });

    const res = await fetch('/api/admin/hero-background-slider', { method: 'PATCH', body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Update failed.');
    await loadItems();
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Delete this hero background image?')) return;

    try {
      const res = await fetch(`/api/admin/hero-background-slider?id=${encodeURIComponent(item.id)}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Delete failed.');
      await loadItems();
      showToast('Hero background image deleted.');
    } catch (error) {
      showToast(error.message || 'Delete failed.', 'error');
    }
  };

  const handleMove = async (index, direction) => {
    const otherIndex = index + direction;
    if (otherIndex < 0 || otherIndex >= items.length) return;

    try {
      const reordered = [...items];
      const [moved] = reordered.splice(index, 1);
      reordered.splice(otherIndex, 0, moved);

      await Promise.all(reordered.map((item, orderIndex) => {
        const fd = new FormData();
        fd.append('id', item.id);
        appendFormFields(fd, { ...item, displayOrder: orderIndex + 1 });
        return fetch('/api/admin/hero-background-slider', { method: 'PATCH', body: fd }).then(async (res) => {
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || 'Order update failed.');
          }
        });
      }));
      await loadItems();
      showToast('Display order updated.');
    } catch (error) {
      showToast(error.message || 'Order update failed.', 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="admin-header">
        <div>
          <h1>Hero Background Slider</h1>
          <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Manage homepage hero background images.
          </p>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3><i className="fas fa-cloud-upload-alt" style={{ color: 'var(--gold)', marginRight: '0.5rem' }}></i>Upload Hero Background Image</h3>
        </div>
        <div className="admin-card-body">
          <form className="admin-form" onSubmit={handleCreate}>
            <div className="form-group">
              <label className="form-label">Hero Background Image</label>
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

            <div className="admin-form-row">
              <div className="form-group">
                <label className="form-label">Display Order</label>
                <input
                  className="form-input"
                  type="number"
                  value={form.displayOrder}
                  onChange={(event) => setForm({ ...form, displayOrder: event.target.value })}
                />
              </div>
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

            <button className="admin-btn admin-btn-primary" type="submit" disabled={saving}>
              <i className={`fas fa-${saving ? 'spinner fa-spin' : 'upload'}`}></i>
              {saving ? 'Uploading...' : 'Upload Image'}
            </button>
          </form>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Uploaded Slider Images</h3>
          <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={loadItems}>
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Preview Image</th>
                <th>Image URL / Filename</th>
                <th>Display Order</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6">Loading slider images...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan="6">No hero background images uploaded yet.</td></tr>
              ) : items.map((item, index) => (
                <tr key={item.id}>
                  <td><img src={item.image} alt="Hero background preview" className="image-preview hero-slider-preview" /></td>
                  <td style={{ maxWidth: '260px', wordBreak: 'break-all' }}>{decodeURIComponent(item.image.split('/').pop() || item.image)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>{item.displayOrder}</span>
                      <div className="reorder-btns">
                        <button className="reorder-btn" onClick={() => handleMove(index, -1)} disabled={index === 0} aria-label="Move up">
                          <i className="fas fa-chevron-up"></i>
                        </button>
                        <button className="reorder-btn" onClick={() => handleMove(index, 1)} disabled={index === items.length - 1} aria-label="Move down">
                          <i className="fas fa-chevron-down"></i>
                        </button>
                      </div>
                    </div>
                  </td>
                  <td><span className={`status-badge ${item.isActive ? 'active' : 'read'}`}>{item.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-action-btns">
                      <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => setEditing(item)}>
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      <button
                        className="admin-btn admin-btn-outline admin-btn-sm"
                        onClick={() => updateItem(item, { isActive: !item.isActive }).then(() => showToast('Status updated.')).catch((error) => showToast(error.message, 'error'))}
                      >
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

      {editing && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h3>Edit Hero Background Image</h3>
            <form className="admin-form" onSubmit={handleUpdate}>
              <div className="form-group">
                <label className="form-label">Current Image</label>
                <img src={editing.image} alt="Current hero background" className="hero-slider-edit-preview" />
              </div>
              <div className="form-group">
                <label className="form-label">Replace Hero Background Image</label>
                <input
                  className="form-input"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={(event) => setReplacementFile(event.target.files?.[0] || null)}
                />
              </div>
              <div className="admin-form-row">
                <div className="form-group">
                  <label className="form-label">Display Order</label>
                  <input
                    className="form-input"
                    type="number"
                    value={editing.displayOrder}
                    onChange={(event) => setEditing({ ...editing, displayOrder: event.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={editing.isActive ? 'true' : 'false'}
                    onChange={(event) => setEditing({ ...editing, isActive: event.target.value === 'true' })}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => { setEditing(null); setReplacementFile(null); }}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  <i className={`fas fa-${saving ? 'spinner fa-spin' : 'save'}`}></i>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <div className={`admin-toast ${toast.type}`}>{toast.message}</div>}
    </AdminLayout>
  );
}
