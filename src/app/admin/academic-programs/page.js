'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

const categories = ['Enrichment', 'Competitive', 'Physical', 'Academic', 'Co-curricular', 'Sports', 'Other'];
const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

const emptyForm = {
  title: '',
  category: 'Enrichment',
  description: '',
  displayOrder: 0,
  isActive: true,
};

function isAllowedImage(file) {
  const name = (file?.name || '').toLowerCase();
  return allowedImageTypes.has(file?.type) && allowedImageExtensions.some((extension) => name.endsWith(extension));
}

export default function AdminAcademicProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadPrograms = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/academic-programs', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load academic programs.');
      setPrograms(Array.isArray(data) ? data : []);
    } catch (error) {
      showToast(error.message || 'Unable to load academic programs.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();
  }, []);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview('');
      return undefined;
    }
    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

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

  const openEditForm = (program) => {
    setEditing(program);
    setForm({
      title: program.title || '',
      category: categories.includes(program.category) ? program.category : 'Other',
      description: program.description || '',
      displayOrder: program.displayOrder || 0,
      isActive: Boolean(program.isActive),
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
    uploadData.append('uploadContext', 'academic-program-image');
    const response = await fetch('/api/admin/upload', { method: 'POST', body: uploadData });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.url) throw new Error(data.error || 'Image upload failed.');
    return data.url;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!editing && !imageFile) {
      showToast('Please choose a program image.', 'error');
      return;
    }

    setSaving(true);
    try {
      const imageUrl = imageFile ? await uploadImage(imageFile) : editing.imageUrl;
      const response = await fetch('/api/admin/academic-programs', {
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

      const wasEditing = Boolean(editing);
      resetForm();
      await loadPrograms();
      showToast(wasEditing ? 'Academic program updated.' : 'Academic program added.');
    } catch (error) {
      showToast(error.message || 'Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (program) => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/academic-programs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: program.id, isActive: !program.isActive }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Status update failed.');
      await loadPrograms();
      showToast('Program status updated.');
    } catch (error) {
      showToast(error.message || 'Status update failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (program) => {
    if (!window.confirm(`Delete "${program.title}"?`)) return;
    try {
      const response = await fetch(`/api/admin/academic-programs?id=${encodeURIComponent(program.id)}`, { method: 'DELETE' });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Delete failed.');
      await loadPrograms();
      showToast('Academic program deleted.');
    } catch (error) {
      showToast(error.message || 'Delete failed.', 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="admin-header">
        <div>
          <h1>Academic Programs</h1>
          <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Add and manage cards displayed on the public Academic Programs page.
          </p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={showForm ? resetForm : openCreateForm}>
          <i className={`fas fa-${showForm ? 'times' : 'plus'}`}></i>
          {showForm ? 'Cancel' : 'Add Program'}
        </button>
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <div className="admin-card-header">
            <h3>{editing ? 'Edit Academic Program' : 'Add Academic Program'}</h3>
          </div>
          <div className="admin-card-body">
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Program Title</label>
                <input className="form-input" required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
              </div>

              <div className="admin-form-row">
                <div className="form-group">
                  <label className="form-label">Category / Tag</label>
                  <select className="form-select" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                    {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Display Order</label>
                  <input className="form-input" type="number" value={form.displayOrder} onChange={(event) => setForm({ ...form, displayOrder: event.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.isActive ? 'true' : 'false'} onChange={(event) => setForm({ ...form, isActive: event.target.value === 'true' })}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              {(imagePreview || editing?.imageUrl) && (
                <div className="form-group">
                  <label className="form-label">Image Preview</label>
                  <img
                    src={imagePreview || editing.imageUrl}
                    alt="Academic program preview"
                    style={{ display: 'block', width: '220px', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">{editing ? 'Replace Image' : 'Image Upload'}</label>
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
                  {saving ? 'Saving...' : editing ? 'Update Program' : 'Add Program'}
                </button>
                <button type="button" className="admin-btn admin-btn-outline" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Existing Academic Programs ({programs.length})</h3>
          <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={loadPrograms}>
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr><th>Image</th><th>Program</th><th>Category</th><th>Order</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6">Loading academic programs...</td></tr>
              ) : programs.length === 0 ? (
                <tr><td colSpan="6">No academic programs added yet.</td></tr>
              ) : programs.map((program) => (
                <tr key={program.id}>
                  <td><img src={program.imageUrl} alt={program.title} style={{ width: '70px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} /></td>
                  <td>
                    <strong style={{ color: 'var(--navy)' }}>{program.title}</strong>
                    <p style={{ marginTop: '0.25rem', color: 'var(--gray-400)', maxWidth: '360px' }}>{program.description}</p>
                  </td>
                  <td><span className="status-badge active">{program.category}</span></td>
                  <td>{program.displayOrder}</td>
                  <td><span className={`status-badge ${program.isActive ? 'active' : 'read'}`}>{program.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <div className="admin-action-btns">
                      <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => openEditForm(program)}><i className="fas fa-edit"></i> Edit</button>
                      <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => toggleStatus(program)} disabled={saving}>
                        <i className={`fas fa-${program.isActive ? 'pause' : 'play'}`}></i> {program.isActive ? 'Inactive' : 'Active'}
                      </button>
                      <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(program)}><i className="fas fa-trash"></i> Delete</button>
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
