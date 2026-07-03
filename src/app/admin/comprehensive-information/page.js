'use client';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import '@/styles/admin.css';

const pdfMimeTypes = new Set(['application/pdf', 'application/x-pdf']);

async function isValidComprehensiveInformationPdf(file) {
  if (!file?.name?.toLowerCase().endsWith('.pdf')) return false;

  try {
    const signature = await file.slice(0, 4).text();
    return signature === '%PDF';
  } catch {
    const mimeType = (file.type || '').toLowerCase();
    return !mimeType || pdfMimeTypes.has(mimeType) || mimeType === 'application/octet-stream';
  }
}

export default function AdminComprehensiveInformationPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingRowKey, setUploadingRowKey] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  };

  const loadRows = async () => {
    const res = await fetch('/api/admin/comprehensive-information', { cache: 'no-store' });
    const data = await res.json();
    setRows(Array.isArray(data.rows) ? data.rows : []);
  };

  useEffect(() => {
    loadRows()
      .catch(() => showToast('Unable to load Comprehensive Information rows.', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const uploadPdf = async (row, file) => {
    if (!file) return;
    if (!(await isValidComprehensiveInformationPdf(file))) {
      showToast('Only PDF files are allowed.', 'error');
      return;
    }

    setUploadingRowKey(row.rowKey);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('uploadContext', 'comprehensive-information-pdf');

      const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const uploadData = await uploadRes.json().catch(() => ({}));
      if (!uploadRes.ok || !uploadData.url) {
        throw new Error(uploadData.error || 'File upload failed.');
      }

      const saveRes = await fetch('/api/admin/comprehensive-information', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rowKey: row.rowKey,
          fileUrl: uploadData.url,
          fileName: uploadData.originalName || file.name,
          mimeType: uploadData.contentType || file.type,
        }),
      });
      const saveData = await saveRes.json().catch(() => ({}));
      if (!saveRes.ok) throw new Error(saveData.error || 'PDF could not be saved.');

      setRows(Array.isArray(saveData.rows) ? saveData.rows : []);
      showToast(row.pdfUrl ? 'PDF replaced successfully.' : 'PDF uploaded successfully.');
    } catch (error) {
      showToast(error.message || 'PDF upload failed.', 'error');
    } finally {
      setUploadingRowKey('');
    }
  };

  const deletePdf = async (row) => {
    if (!row?.pdfUrl) return;
    if (!confirm('Delete this PDF from Comprehensive Information?')) return;

    try {
      const res = await fetch(`/api/admin/comprehensive-information?rowKey=${encodeURIComponent(row.rowKey)}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Unable to delete PDF.');

      setRows(Array.isArray(data.rows) ? data.rows : []);
      showToast('PDF deleted successfully.');
    } catch (error) {
      showToast(error.message || 'Unable to delete PDF.', 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="admin-header">
        <div>
          <h1>Comprehensive Information</h1>
          <p className="admin-page-subtitle">Upload and manage PDFs for the 2026-27 Comprehensive Information format.</p>
        </div>
      </div>

      {toast && <div className={`admin-toast ${toast.type}`}>{toast.message}</div>}

      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Comprehensive Information PDFs</h3>
        </div>
        <div className="admin-card-body public-disclosure-admin-table-wrap">
          {loading ? (
            <p style={{ padding: '1rem', textAlign: 'center', color: 'var(--gray-400)' }}>
              <i className="fas fa-spinner fa-spin"></i> Loading...
            </p>
          ) : (
            <table className="admin-table public-disclosure-admin-table">
              <thead>
                <tr>
                  <th>SL No.</th>
                  <th>Information</th>
                  <th>Uploaded PDF</th>
                  <th>Replace / Upload</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const isUploading = uploadingRowKey === row.rowKey;
                  return (
                    <tr key={row.rowKey}>
                      <td>{row.slNo}</td>
                      <td style={{ fontWeight: 600, color: 'var(--navy)' }}>{row.title}</td>
                      <td>
                        {row.pdfUrl ? (
                          <a
                            href={`/api/public/comprehensive-information/${encodeURIComponent(row.rowKey)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-btn admin-btn-outline admin-btn-sm"
                          >
                            <i className="fas fa-file-pdf"></i> View
                          </a>
                        ) : (
                          <span className="status-badge read">Not Uploaded</span>
                        )}
                      </td>
                      <td>
                        <label className={`admin-btn admin-btn-primary admin-btn-sm ${isUploading ? 'disabled' : ''}`}>
                          <i className={`fas fa-${isUploading ? 'spinner fa-spin' : 'upload'}`}></i>
                          {isUploading ? 'Uploading...' : row.pdfUrl ? 'Replace PDF' : 'Upload PDF'}
                          <input
                            type="file"
                            accept=".pdf,application/pdf"
                            style={{ display: 'none' }}
                            disabled={isUploading}
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              event.target.value = '';
                              uploadPdf(row, file);
                            }}
                          />
                        </label>
                      </td>
                      <td>
                        {row.pdfUrl ? (
                          <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => deletePdf(row)}>
                            <i className="fas fa-trash"></i> Delete
                          </button>
                        ) : (
                          <span style={{ color: 'var(--gray-400)' }}>NA</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
