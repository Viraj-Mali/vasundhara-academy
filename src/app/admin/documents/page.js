'use client';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { appendixDocumentSections, getDocumentForAppendixRow } from '@/lib/publicDisclosureConfig';
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
  const [dbDocuments, setDbDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [replacingId, setReplacingId] = useState(null);
  const [uploadingFixedRowCategory, setUploadingFixedRowCategory] = useState(null);
  const [toast, setToast] = useState(null);

  // States for fixed rows editing name
  const [editingRowCategory, setEditingRowCategory] = useState(null);
  const [editingRowTitle, setEditingRowTitle] = useState('');

  // States for extra B documents form
  const [docName, setDocName] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [pdfFile, setPdfFile] = useState(null);
  const [editingExtraId, setEditingExtraId] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  };

  const fetchAllDocuments = async () => {
    try {
      const res = await fetch('/api/admin/documents', { cache: 'no-store' });
      const data = await res.json();
      setDbDocuments(Array.isArray(data) ? data : []);
    } catch {
      showToast('Unable to load documents.', 'error');
    }
  };

  useEffect(() => {
    fetchAllDocuments().finally(() => setLoading(false));
  }, []);

  const resetForm = () => {
    setDocName('');
    setDisplayOrder(0);
    setPdfFile(null);
    setEditingExtraId(null);
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

  // Fixed B Rows from config
  const fixedBRows = appendixDocumentSections.find((s) => s.key === 'documents')?.rows || [];

  // Extra B documents filter
  const extraDocuments = dbDocuments
    .filter((d) => d.category === CATEGORY)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Handler to toggle edit name mode for fixed row
  const startEditFixedRowName = (category, currentTitle) => {
    setEditingRowCategory(category);
    setEditingRowTitle(currentTitle);
  };

  // Handler to save edited name of fixed row
  const handleSaveFixedRowName = async (category) => {
    if (!editingRowTitle.trim()) {
      showToast('Document name cannot be empty.', 'error');
      return;
    }

    const doc = getDocumentForAppendixRow(dbDocuments, { category });
    setSaving(true);
    try {
      const body = {
        title: editingRowTitle.trim(),
        category: category,
        order: 0,
      };

      if (doc?.id) {
        body.id = doc.id;
        body.fileUrl = doc.fileUrl; // Keep current fileUrl
      } else {
        body.fileUrl = ''; // Creating empty entry first (no PDF)
      }

      const res = await fetch('/api/admin/documents', {
        method: doc?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to update document name.');
      }

      showToast('Document name updated.');
      setEditingRowCategory(null);
      setEditingRowTitle('');
      await fetchAllDocuments();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Handler to upload or replace PDF for fixed row
  const handleUploadFixedRowPdf = async (category, file) => {
    if (!file) return;
    if (!(await isValidPdf(file))) {
      showToast('Only PDF files are allowed.', 'error');
      return;
    }

    setUploadingFixedRowCategory(category);
    try {
      const upload = await uploadFile(file);
      const doc = getDocumentForAppendixRow(dbDocuments, { category });
      const currentTitle = doc?.title || fixedBRows.find((r) => r.category === category)?.label || '';

      const body = {
        title: currentTitle,
        category: category,
        fileUrl: upload.url,
        fileName: file.name,
        mimeType: file.type,
        order: 0,
      };

      if (doc?.id) {
        body.id = doc.id;
      }

      const res = await fetch('/api/admin/documents', {
        method: doc?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save PDF.');
      }

      showToast('PDF uploaded successfully.');
      await fetchAllDocuments();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setUploadingFixedRowCategory(null);
    }
  };

  // Handler to delete/remove PDF only from fixed row without deleting the row
  const handleRemoveFixedRowPdf = async (category) => {
    const doc = getDocumentForAppendixRow(dbDocuments, { category });
    if (!doc?.id) return;

    if (!confirm('Remove the PDF for this document? The fixed row itself will remain visible.')) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/documents?id=${encodeURIComponent(doc.id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to remove PDF.');
      
      showToast('PDF removed successfully.');
      await fetchAllDocuments();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handler to save/edit extra B documents
  const handleSaveExtraDoc = async (e) => {
    e.preventDefault();
    if (!docName.trim()) {
      showToast('Document Name is required.', 'error');
      return;
    }
    if (!editingExtraId && !pdfFile) {
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

      if (editingExtraId) {
        body.id = editingExtraId;
        if (fileUrl) {
          body.fileUrl = fileUrl;
          body.fileName = pdfFile.name;
          body.mimeType = pdfFile.type;
        } else {
          const existing = extraDocuments.find((d) => d.id === editingExtraId);
          body.fileUrl = existing?.fileUrl;
        }
      } else {
        body.fileUrl = fileUrl;
        body.fileName = pdfFile.name;
        body.mimeType = pdfFile.type;
      }

      const res = await fetch('/api/admin/documents', {
        method: editingExtraId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save document.');
      }

      showToast(editingExtraId ? 'Extra document updated.' : 'Extra document saved.');
      resetForm();
      await fetchAllDocuments();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Handler to edit extra document (populates extra form)
  const handleEditExtra = (doc) => {
    setEditingExtraId(doc.id);
    setDocName(doc.title);
    setDisplayOrder(doc.order || 0);
    setPdfFile(null);
  };

  // Handler to replace PDF for extra document directly in table
  const handleReplaceExtraPdf = async (doc, file) => {
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
      await fetchAllDocuments();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setReplacingId(null);
    }
  };

  // Handler to view PDF in new window
  const handleViewPdf = (fileUrl) => {
    if (fileUrl) {
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Handler to delete extra document completely
  const handleDeleteExtra = async (doc) => {
    if (!confirm('Delete this extra document?')) return;
    try {
      const res = await fetch(`/api/admin/documents?id=${encodeURIComponent(doc.id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete document.');
      showToast('Document deleted.');
      await fetchAllDocuments();
      if (editingExtraId === doc.id) resetForm();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="admin-header">
        <div>
          <h1>Public Disclosures</h1>
        </div>
      </div>

      {toast && <div className={`admin-toast ${toast.type}`}>{toast.message}</div>}

      {/* SECTION B FIXED ROWS TABLE */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>B: Documents and Information (Fixed Rows)</h3>
        </div>
        <div className="admin-card-body">
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '2rem' }}>
              <i className="fas fa-spinner fa-spin"></i> Loading...
            </div>
          ) : (
            <div className="public-disclosure-admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>SL No.</th>
                    <th>Document / Information Name</th>
                    <th>Uploaded PDF</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fixedBRows.map((row, index) => {
                    const doc = getDocumentForAppendixRow(dbDocuments, row);
                    const isEditingName = editingRowCategory === row.category;
                    const hasFile = doc?.fileUrl && doc.fileUrl.trim() !== '';
                    const displayTitle = doc?.title || row.label;

                    return (
                      <tr key={row.category}>
                        <td>{index + 1}</td>
                        <td>
                          {isEditingName ? (
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                              <input
                                className="form-input"
                                type="text"
                                value={editingRowTitle}
                                onChange={(e) => setEditingRowTitle(e.target.value)}
                                style={{ margin: 0, flex: 1 }}
                              />
                              <button
                                type="button"
                                className="admin-btn admin-btn-primary admin-btn-sm"
                                onClick={() => handleSaveFixedRowName(row.category)}
                                disabled={saving}
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                className="admin-btn admin-btn-outline admin-btn-sm"
                                onClick={() => {
                                  setEditingRowCategory(null);
                                  setEditingRowTitle('');
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{displayTitle}</span>
                          )}
                        </td>
                        <td>
                          {hasFile ? (
                            <span className="status-badge active">Uploaded</span>
                          ) : (
                            <span className="status-badge read">Not Uploaded</span>
                          )}
                        </td>
                        <td>
                          <div className="admin-action-btns">
                            {!isEditingName && (
                              <button
                                type="button"
                                className="admin-btn admin-btn-outline admin-btn-sm"
                                onClick={() => startEditFixedRowName(row.category, displayTitle)}
                              >
                                <i className="fas fa-edit"></i> Edit Name
                              </button>
                            )}

                            {hasFile && (
                              <button
                                type="button"
                                className="admin-btn admin-btn-outline admin-btn-sm"
                                onClick={() => handleViewPdf(doc.fileUrl)}
                              >
                                <i className="fas fa-eye"></i> View PDF
                              </button>
                            )}

                            <label
                              className={`admin-btn admin-btn-primary admin-btn-sm ${
                                uploadingFixedRowCategory === row.category ? 'disabled' : ''
                              }`}
                            >
                              <i
                                className={`fas fa-${
                                  uploadingFixedRowCategory === row.category ? 'spinner fa-spin' : 'upload'
                                }`}
                              ></i>
                              {uploadingFixedRowCategory === row.category
                                ? 'Uploading...'
                                : hasFile
                                ? 'Replace PDF'
                                : 'Upload PDF'}
                              <input
                                type="file"
                                accept=".pdf,application/pdf"
                                style={{ display: 'none' }}
                                disabled={uploadingFixedRowCategory === row.category}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  e.target.value = '';
                                  handleUploadFixedRowPdf(row.category, file);
                                }}
                              />
                            </label>

                            {hasFile && (
                              <button
                                type="button"
                                className="admin-btn admin-btn-danger admin-btn-sm"
                                onClick={() => handleRemoveFixedRowPdf(row.category)}
                              >
                                <i className="fas fa-trash"></i> Remove PDF
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* FORM FOR ADDING EXTRA DOCUMENTS */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>{editingExtraId ? 'Edit Extra B Section Document' : 'Add Extra B Section Document'}</h3>
        </div>
        <div className="admin-card-body">
          <form onSubmit={handleSaveExtraDoc} className="admin-form">
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
                key={editingExtraId || 'new'}
              />
              {editingExtraId && !pdfFile && (
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
                {saving ? 'Saving...' : editingExtraId ? 'Update Document' : 'Save Document'}
              </button>
              {editingExtraId && (
                <button type="button" className="admin-btn admin-btn-outline" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* TABLE FOR EXTRA DOCUMENTS */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Extra B Section Documents</h3>
        </div>
        <div className="admin-card-body">
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '2rem' }}>
              <i className="fas fa-spinner fa-spin"></i> Loading...
            </div>
          ) : extraDocuments.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '2rem' }}>
              No extra documents added yet.
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
                  {extraDocuments.map((doc, index) => (
                    <tr key={doc.id}>
                      <td>{index + 9}</td>
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
                            <button
                              type="button"
                              className="admin-btn admin-btn-outline admin-btn-sm"
                              onClick={() => handleViewPdf(doc.fileUrl)}
                            >
                              <i className="fas fa-eye"></i> View PDF
                            </button>
                          )}
                          <button
                            type="button"
                            className="admin-btn admin-btn-outline admin-btn-sm"
                            onClick={() => handleEditExtra(doc)}
                          >
                            <i className="fas fa-edit"></i> Edit
                          </button>
                          <label
                            className={`admin-btn admin-btn-primary admin-btn-sm ${
                              replacingId === doc.id ? 'disabled' : ''
                            }`}
                          >
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
                                handleReplaceExtraPdf(doc, file);
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            className="admin-btn admin-btn-danger admin-btn-sm"
                            onClick={() => handleDeleteExtra(doc)}
                          >
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
