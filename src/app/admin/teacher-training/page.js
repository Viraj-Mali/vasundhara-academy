'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

const categories = [
  'ICT Training',
  'NEP Workshop',
  'Pedagogical Skills',
  'Child Psychology',
  'Inclusive Education',
  'Safety & First Aid',
  'Other',
];
const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

const emptyForm = {
  title: '',
  description: '',
  trainingDate: '',
  category: 'ICT Training',
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

export default function AdminTeacherTrainingPage() {
  const [trainings, setTrainings] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [coverFile, setCoverFile] = useState(null);
  const [trainingFiles, setTrainingFiles] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadTrainings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/teacher-training', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load teacher training cards.');
      setTrainings(Array.isArray(data) ? data : []);
    } catch (error) {
      showToast(error.message || 'Unable to load teacher training cards.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainings();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setCoverFile(null);
    setTrainingFiles([]);
    setEditing(null);
    setShowForm(false);
  };

  const openCreateForm = () => {
    setForm(emptyForm);
    setCoverFile(null);
    setTrainingFiles([]);
    setEditing(null);
    setShowForm(true);
  };

  const openEditForm = (training) => {
    setEditing(training);
    setForm({
      title: training.title || '',
      description: training.description || '',
      trainingDate: dateInputValue(training.trainingDate),
      category: categories.includes(training.category) ? training.category : 'Other',
      displayOrder: training.displayOrder || 0,
      isActive: Boolean(training.isActive),
    });
    setCoverFile(null);
    setTrainingFiles([]);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const uploadImage = async (file) => {
    if (!isAllowedImage(file)) throw new Error(`${file.name}: only JPG, JPEG, PNG, and WEBP images are allowed.`);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadContext', 'teacher-training-image');
    const response = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.url) throw new Error(data.error || `Unable to upload ${file.name}.`);
    return data.url;
  };

  const chooseCover = (file) => {
    if (file && !isAllowedImage(file)) {
      showToast('Only JPG, JPEG, PNG, and WEBP images are allowed.', 'error');
      return;
    }
    setCoverFile(file || null);
  };

  const chooseTrainingImages = (files) => {
    const selectedFiles = Array.from(files || []);
    if (selectedFiles.some((file) => !isAllowedImage(file))) {
      showToast('Only JPG, JPEG, PNG, and WEBP images are allowed.', 'error');
      return;
    }
    setTrainingFiles(selectedFiles);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const coverImageUrl = coverFile ? await uploadImage(coverFile) : editing?.coverImageUrl || null;
      const imageUrls = await Promise.all(trainingFiles.map(uploadImage));
      const response = await fetch('/api/admin/teacher-training', {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(editing ? { id: editing.id, newImageUrls: imageUrls } : { imageUrls }),
          ...form,
          coverImageUrl,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Save failed.');

      resetForm();
      await loadTrainings();
      showToast(editing ? 'Teacher training card updated.' : 'Teacher training card added.');
    } catch (error) {
      showToast(error.message || 'Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (training) => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/teacher-training', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: training.id, isActive: !training.isActive }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Status update failed.');
      await loadTrainings();
      showToast('Status updated.');
    } catch (error) {
      showToast(error.message || 'Status update failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteTraining = async (training) => {
    if (!window.confirm(`Delete "${training.title}" and all of its training images?`)) return;
    try {
      const response = await fetch(`/api/admin/teacher-training?id=${encodeURIComponent(training.id)}`, { method: 'DELETE' });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Delete failed.');
      if (editing?.id === training.id) resetForm();
      await loadTrainings();
      showToast('Teacher training card deleted.');
    } catch (error) {
      showToast(error.message || 'Delete failed.', 'error');
    }
  };

  const deleteTrainingImage = async (image) => {
    if (!window.confirm('Delete this training image?')) return;
    try {
      const response = await fetch(`/api/admin/teacher-training?imageId=${encodeURIComponent(image.id)}`, { method: 'DELETE' });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Image delete failed.');
      setEditing((current) => current ? { ...current, images: current.images.filter((item) => item.id !== image.id) } : current);
      await loadTrainings();
      showToast('Training image deleted.');
    } catch (error) {
      showToast(error.message || 'Image delete failed.', 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="admin-header">
        <div>
          <h1>Teacher Training</h1>
          <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Manage Teacher Training & Development cards and their photo galleries.
          </p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={showForm ? resetForm : openCreateForm}>
          <i className={`fas fa-${showForm ? 'times' : 'plus'}`}></i> {showForm ? 'Cancel' : 'Add Training Card'}
        </button>
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <div className="admin-card-header"><h3>{editing ? 'Edit Training Card' : 'Add Training Card'}</h3></div>
          <div className="admin-card-body">
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Training Title</label>
                <input className="form-input" required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Short Description</label>
                <textarea className="form-textarea" required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
              </div>

              <div className="admin-form-row">
                <div className="form-group">
                  <label className="form-label">Training Date</label>
                  <input className="form-input" type="date" value={form.trainingDate} onChange={(event) => setForm({ ...form, trainingDate: event.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                    {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                  </select>
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
                    <option value="true">Active</option><option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              {editing?.coverImageUrl && (
                <div className="form-group">
                  <label className="form-label">Current Cover Image</label>
                  <img src={editing.coverImageUrl} alt={editing.title} style={{ display: 'block', width: '200px', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">{editing ? 'Replace Cover Image' : 'Cover Image (Optional)'}</label>
                <label className="image-upload-area" style={{ display: 'block' }}>
                  <i className="fas fa-image"></i><p>{coverFile ? coverFile.name : 'Choose one JPG, JPEG, PNG, or WEBP image'}</p>
                  <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={(event) => chooseCover(event.target.files?.[0])} style={{ display: 'none' }} />
                </label>
              </div>

              {editing?.images?.length > 0 && (
                <div className="form-group">
                  <label className="form-label">Current Training Images</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.75rem' }}>
                    {editing.images.map((image) => (
                      <div key={image.id} style={{ position: 'relative' }}>
                        <img src={image.imageUrl} alt="Training" style={{ width: '100%', height: '95px', objectFit: 'cover', borderRadius: 'var(--radius-md)', display: 'block' }} />
                        <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => deleteTrainingImage(image)} style={{ position: 'absolute', top: '0.3rem', right: '0.3rem', zIndex: 2 }} aria-label="Delete training image">
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">{editing ? 'Add More Training Images' : 'Multiple Training Images'}</label>
                <label className="image-upload-area" style={{ display: 'block' }}>
                  <i className="fas fa-images"></i>
                  <p>{trainingFiles.length > 0 ? `${trainingFiles.length} image(s) selected` : 'Choose multiple JPG, JPEG, PNG, or WEBP images'}</p>
                  <input type="file" multiple accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={(event) => chooseTrainingImages(event.target.files)} style={{ display: 'none' }} />
                </label>
                {trainingFiles.length > 0 && <p style={{ marginTop: '0.5rem', color: 'var(--gray-400)', fontSize: '0.78rem' }}>{trainingFiles.map((file) => file.name).join(', ')}</p>}
              </div>

              <div className="admin-header-actions">
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}><i className={`fas fa-${saving ? 'spinner fa-spin' : 'save'}`}></i> {saving ? 'Saving...' : editing ? 'Update Training Card' : 'Add Training Card'}</button>
                <button type="button" className="admin-btn admin-btn-outline" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Existing Training Cards ({trainings.length})</h3>
          <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={loadTrainings}><i className="fas fa-sync-alt"></i> Refresh</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead><tr><th>Cover</th><th>Training</th><th>Category / Date</th><th>Photos</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7">Loading teacher training cards...</td></tr>
              ) : trainings.length === 0 ? (
                <tr><td colSpan="7">No teacher training cards added yet.</td></tr>
              ) : trainings.map((training) => (
                <tr key={training.id}>
                  <td>{training.coverImageUrl ? <img src={training.coverImageUrl} alt={training.title} style={{ width: '75px', height: '52px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} /> : <i className="fas fa-chalkboard-teacher" style={{ color: 'var(--gold)', fontSize: '1.4rem' }}></i>}</td>
                  <td><strong style={{ color: 'var(--navy)' }}>{training.title}</strong><p style={{ marginTop: '0.25rem', color: 'var(--gray-400)', maxWidth: '330px' }}>{training.description}</p></td>
                  <td><span className="status-badge active">{training.category}</span><p style={{ marginTop: '0.35rem', color: 'var(--gray-400)' }}>{training.trainingDate ? new Date(training.trainingDate).toLocaleDateString('en-IN') : 'No date'}</p></td>
                  <td>{training.images?.length || 0}</td>
                  <td>{training.displayOrder}</td>
                  <td><span className={`status-badge ${training.isActive ? 'active' : 'read'}`}>{training.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td><div className="admin-action-btns">
                    <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => openEditForm(training)}><i className="fas fa-edit"></i> Edit</button>
                    <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => toggleStatus(training)} disabled={saving}><i className={`fas fa-${training.isActive ? 'pause' : 'play'}`}></i> {training.isActive ? 'Inactive' : 'Active'}</button>
                    <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => deleteTraining(training)}><i className="fas fa-trash"></i> Delete</button>
                  </div></td>
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
