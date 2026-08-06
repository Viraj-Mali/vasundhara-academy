'use client';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import '@/styles/admin.css';

const CATEGORY = 'public-disclosure-b-additional';
const pdfMimeTypes = new Set(['application/pdf', 'application/x-pdf']);

async function isValidPdf(file) {
  if (!file?.name?.toLowerCase().endsWith('.pdf')) return false;
  try {
    const signature = await file.slice(0, 4).text();
    return signature === '%PDF';
  } catch {
    const mimeType = (file.type || '').toLowerCase();
    return !mimeType || pdfMimeTypes.has(mimeType) || mimeType === 'application/octet-stream';
  }
}

export default function AdminDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [replacingId, setReplacingId] = useState(null);
  const [toast, setToast] = useState(null);

  const [docName, setDocName] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [pdfFile, setPdfFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  };

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/admin/documents', { cache: 'no-store' });
      const data = await res.json();
      const all = Array.isArray(data) ? data : [];
      setDocuments(all.filter((d) => d.category === CATEGORY));
    } catch {
      showToast('Unable to load documents.', 'error');
    }
  };

  useEffect(() => {
    fetchDocuments().finally(() => setLoading(false));
  }, []);

  const resetForm = () => {
    setDocName('');
    setDisplayOrder(0);
    setPdfFile(null);
    setEditingId(null);
  };

  const uploadFile = async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('uploadContext', 'public-disclosure-pdf');
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (!res.ok || !data.url) throw new Error(data.error || 'Upload failed.');
    return data;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!docName.trim()) {
      showToast('Document Name is required.', 'error');
      return;
    }
    if (!editingId && !pdfFile) {
      showToast('Please upload a PDF file.', 'error');
      return;
    }
    if (pdfFile && !(await isValidPdf(pdfFile))) {
      showToast('Only PDF files are allowed.', 'error');
      return;
    }

    setSaving(true);
    try {
      let fileUrl;
      if (pdfFile) {
        const upload = await uploadFile(pdfFile);
        fileUrl = upload.url;
      }

      const body = {
        title: docName.trim(),
        category: CATEGORY,
        order: parseInt(displayOrder) || 0,
      };

      if (editingId) {
        body.id = editingId;
        if (fileUrl) {
          body.fileUrl = fileUrl;
          body.fileName = pdfFile.name;
          body.mimeType = pdfFile.type;
        } else {
          const existing = documents.find((d) => d.id === editingId);
          body.fileUrl = existing?.fileUrl;
        }
      } else {
        body.fileUrl = fileUrl;
        body.fileName = pdfFile.name;
        body.mimeType = pdfFile.type;
      }

      const res = await fetch('/api/admin/documents', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save document.');
      }

      showToast(editingId ? 'Document updated.' : 'Document saved.');
      resetForm();
      await fetchDocuments();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (doc) => {
    setEditingId(doc.id);
    setDocName(doc.title);
    setDisplayOrder(doc.order || 0);
    setPdfFile(null);
  };

  const handleReplace = async (doc, file) => {
    if (!file) return;
    if (!(await isValidPdf(file))) {
      showToast('Only PDF files are allowed.', 'error');
      return;
    }

    setReplacingId(doc.id);
    try {
      const upload = await uploadFile(file);
      const res = await fetch('/api/admin/documents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: doc.id,
          title: doc.title,
          category: doc.category,
          fileUrl: upload.url,
          fileName: file.name,
          mimeType: file.type,
          order: doc.order || 0,
        }),
      });

      if (!res.ok) throw new Error('Failed to replace PDF.');
      showToast('PDF replaced successfully.');
      await fetchDocuments();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setReplacingId(null);
    }
  };

  const handleView = (doc) => {
    if (doc.fileUrl) {
      window.open(doc.fileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDelete = async (doc) => {
    if (!confirm('Delete this document?')) return;
    try {
      const res = await fetch(`/api/admin/documents?id=${encodeURIComponent(doc.id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete document.');
      showToast('Document deleted.');
      await fetchDocuments();
      if (editingId === doc.id) resetForm();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const sortedDocuments = [...documents].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <AdminLayout>
      <div className="admin-header">
        <div>
          <h1>Public Disclosures</h1>
        </div>
      </div>

      {toast && <div className={`admin-toast ${toast.type}`}>{toast.message}</div>}

      <div className="admin-card">
        <div className="admin-card-body">
          <form onSubmit={handleSave} className="admin-form">
            <div className="form-group">
              <label className="form-label">Document Name</label>
              <input
                className="form-input"
                type="text"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="Enter document name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Upload PDF</label>
              <input
                className="form-input"
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                key={editingId || 'new'}
              />
              {editingId && !pdfFile && (
                <small style={{ color: 'var(--gray-400)', marginTop: '0.25rem', display: 'block' }}>
                  Leave empty to keep existing PDF.
                </small>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Display Order</label>
              <input
                className="form-input"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                min="0"
              />
            </div>

            <div className="admin-action-btns">
              <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                <i className={`fas fa-${saving ? 'spinner fa-spin' : 'save'}`}></i>
                {saving ? 'Saving...' : editingId ? 'Update Document' : 'Save Document'}
              </button>
              {editingId && (
                <button type="button" className="admin-btn admin-btn-outline" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Documents List</h3>
        </div>
        <div className="admin-card-body">
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '2rem' }}>
              <i className="fas fa-spinner fa-spin"></i> Loading...
            </div>
          ) : sortedDocuments.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '2rem' }}>
              No documents added yet.
            </div>
          ) : (
            <div className="public-disclosure-admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>SL No.</th>
                    <th>Document Name</th>
                    <th>Uploaded PDF</th>
                    <th>Display Order</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDocuments.map((doc, index) => (
                    <tr key={doc.id}>
                      <td>{index + 1}</td>
                      <td style={{ fontWeight: 600, color: 'var(--navy)' }}>{doc.title}</td>
                      <td>
                        {doc.fileUrl ? (
                          <span className="status-badge active">Uploaded</span>
                        ) : (
                          <span className="status-badge read">No File</span>
                        )}
                      </td>
                      <td>{doc.order || 0}</td>
                      <td>
                        <div className="admin-action-btns">
                          {doc.fileUrl && (
                            <button type="button" className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => handleView(doc)}>
                              <i className="fas fa-eye"></i> View
                            </button>
                          )}
                          <button type="button" className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => handleEdit(doc)}>
                            <i className="fas fa-edit"></i> Edit
                          </button>
                          <label className={`admin-btn admin-btn-primary admin-btn-sm ${replacingId === doc.id ? 'disabled' : ''}`}>
                            <i className={`fas fa-${replacingId === doc.id ? 'spinner fa-spin' : 'sync-alt'}`}></i>
                            {replacingId === doc.id ? 'Replacing...' : 'Replace PDF'}
                            <input
                              type="file"
                              accept=".pdf,application/pdf"
                              style={{ display: 'none' }}
                              disabled={replacingId === doc.id}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                e.target.value = '';
                                handleReplace(doc, file);
                              }}
                            />
                          </label>
                          <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(doc)}>
                            <i className="fas fa-trash"></i> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
