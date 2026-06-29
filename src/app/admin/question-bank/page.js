'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

const classes = ['Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];

const emptyForm = {
  title: '',
  className: 'Class 5',
  isActive: true,
};

export default function AdminQuestionBankPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [pdfFile, setPdfFile] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/question-bank');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      showToast('Unable to load Question Bank PDFs.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setPdfFile(null);
    setEditing(null);
    setShowForm(false);
  };

  const openCreateForm = () => {
    setForm(emptyForm);
    setPdfFile(null);
    setEditing(null);
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditing(item);
    setForm({
      title: item.title || '',
      className: classes.includes(item.className) ? item.className : 'Class 5',
      isActive: Boolean(item.isActive),
    });
    setPdfFile(null);
    setShowForm(true);
  };

  const validatePdf = (file, required) => {
    if (!file) return required ? 'Please choose a PDF file.' : '';
    if (!file.name.toLowerCase().endsWith('.pdf') || (file.type && file.type !== 'application/pdf')) {
      return 'Only PDF files are allowed.';
    }
    return '';
  };

  const appendFields = (fd) => {
    fd.append('title', form.title);
    fd.append('className', form.className);
    fd.append('isActive', String(form.isActive));
    if (pdfFile) fd.append('pdfFile', pdfFile);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const fileError = validatePdf(pdfFile, !editing);
    if (fileError) {
      showToast(fileError, 'error');
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      if (editing) fd.append('id', editing.id);
      appendFields(fd);

      const res = await fetch('/api/admin/question-bank', {
        method: editing ? 'PATCH' : 'POST',
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Save failed.');

      resetForm();
      await fetchItems();
      showToast(editing ? 'Question Bank PDF updated.' : 'Question Bank PDF added.');
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
      fd.append('className', item.className);
      fd.append('isActive', String(!item.isActive));

      const res = await fetch('/api/admin/question-bank', { method: 'PATCH', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Status update failed.');

      await fetchItems();
      showToast('Status updated.');
    } catch (error) {
      showToast(error.message || 'Status update failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Delete this Question Bank PDF?')) return;

    try {
      const res = await fetch(`/api/admin/question-bank?id=${encodeURIComponent(item.id)}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Delete failed.');

      await fetchItems();
      showToast('Question Bank PDF deleted.');
    } catch (error) {
      showToast(error.message || 'Delete failed.', 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="admin-header">
        <div>
          <h1>Question Bank</h1>
          <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Add and manage Class 5 to Class 10 Question Bank PDFs.
          </p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={showForm ? resetForm : openCreateForm}>
          <i className={`fas fa-${showForm ? 'times' : 'plus'}`}></i>
          {showForm ? 'Cancel' : 'Add PDF'}
        </button>
      </div>

      {showForm && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>{editing ? 'Edit Question Bank PDF' : 'Add Question Bank PDF'}</h3>
          </div>
          <div className="admin-card-body">
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="admin-form-row">
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    className="form-input"
                    required
                    value={form.title}
                    onChange={(event) => setForm({ ...form, title: event.target.value })}
                    placeholder="e.g., Mathematics Question Bank"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Class</label>
                  <select
                    className="form-select"
                    value={form.className}
                    onChange={(event) => setForm({ ...form, className: event.target.value })}
                  >
                    {classes.map((className) => (
                      <option key={className} value={className}>{className}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="admin-form-row">
                <div className="form-group">
                  <label className="form-label">PDF File</label>
                  <input
                    className="form-input"
                    type="file"
                    accept="application/pdf,.pdf"
                    required={!editing}
                    onChange={(event) => setPdfFile(event.target.files?.[0] || null)}
                  />
                  {editing?.pdfUrl && (
                    <a href={editing.pdfUrl} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-outline admin-btn-sm" style={{ marginTop: '0.75rem' }}>
                      <i className="fas fa-file-pdf"></i> Current PDF
                    </a>
                  )}
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

              <div className="admin-header-actions">
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  <i className={`fas fa-${saving ? 'spinner fa-spin' : 'save'}`}></i>
                  {saving ? 'Saving...' : editing ? 'Update PDF' : 'Add PDF'}
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
          <h3>All Question Bank PDFs</h3>
          <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={fetchItems}>
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Class</th>
                <th>Status</th>
                <th>PDF</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6">Loading Question Bank PDFs...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan="6">No Question Bank PDFs added yet.</td></tr>
              ) : items.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600, color: 'var(--navy)' }}>{item.title}</td>
                  <td><span className="status-badge active">{item.className}</span></td>
                  <td><span className={`status-badge ${item.isActive ? 'active' : 'read'}`}>{item.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-outline admin-btn-sm">
                      <i className="fas fa-file-pdf"></i> View
                    </a>
                  </td>
                  <td>{new Date(item.createdAt).toLocaleDateString('en-IN')}</td>
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
