'use client';
import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  appendixDocumentCategories,
  appendixDocumentSections,
  defaultResultYears,
  generalInformationRows,
  getDocumentForAppendixRow,
  infrastructureRows,
  normalizePublicDisclosureInfo,
  resultClassOptions,
  staffTeachingRows,
} from '@/lib/publicDisclosureConfig';
import '@/styles/admin.css';

const blankResultForm = {
  resultClass: 'Class X',
  year: '2024',
  registeredStudents: '',
  studentsPassed: '',
  passPercentage: '',
  remarks: '',
};

const disclosureSectionOptions = [
  { value: 'general', label: 'A: General Information' },
  { value: 'pdf', label: 'B & C: PDF Documents' },
  { value: 'results', label: 'C: Result Tables' },
  { value: 'staff', label: 'D: Staff Teaching' },
  { value: 'infrastructure', label: 'E: School Infrastructure' },
];

const pdfMimeTypes = new Set(['application/pdf', 'application/x-pdf']);

async function isValidPublicDisclosurePdf(file) {
  if (!file?.name?.toLowerCase().endsWith('.pdf')) return false;

  try {
    const signature = await file.slice(0, 4).text();
    return signature === '%PDF';
  } catch {
    const mimeType = (file.type || '').toLowerCase();
    return !mimeType || pdfMimeTypes.has(mimeType) || mimeType === 'application/octet-stream';
  }
}

function FieldGrid({ rows, form, onChange }) {
  return (
    <div className="public-disclosure-admin-grid">
      {rows.map((row) => (
        <div className="form-group" key={row.key}>
          <label className="form-label">{row.label}</label>
          {row.key === 'address' ? (
            <textarea
              className="form-textarea"
              value={form[row.key] || ''}
              onChange={(event) => onChange(row.key, event.target.value)}
              rows={3}
            />
          ) : row.key === 'internetFacility' ? (
            <select
              className="form-select"
              value={form[row.key] || ''}
              onChange={(event) => onChange(row.key, event.target.value)}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          ) : (
            <input
              className="form-input"
              type={row.type === 'url' ? 'url' : 'text'}
              value={form[row.key] || ''}
              onChange={(event) => onChange(row.key, event.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function AdminDocuments() {
  const [documents, setDocuments] = useState([]);
  const [form, setForm] = useState(normalizePublicDisclosureInfo());
  const [loading, setLoading] = useState(true);
  const [savingInfo, setSavingInfo] = useState(false);
  const [uploadingCategory, setUploadingCategory] = useState('');
  const [resultForm, setResultForm] = useState(blankResultForm);
  const [editingResultId, setEditingResultId] = useState('');
  const [selectedSection, setSelectedSection] = useState('general');
  const [toast, setToast] = useState(null);

  const docsByCategory = useMemo(() => {
    const map = new Map();
    appendixDocumentSections.forEach((section) => {
      section.rows.forEach((row) => {
        map.set(row.category, getDocumentForAppendixRow(documents, row));
      });
    });
    return map;
  }, [documents]);

  const legacyDocuments = useMemo(() => {
    const matchedIds = new Set(
      appendixDocumentSections
        .flatMap((section) => section.rows)
        .map((row) => getDocumentForAppendixRow(documents, row)?.id)
        .filter(Boolean)
    );
    return documents.filter((doc) => !appendixDocumentCategories.includes(doc.category) && !matchedIds.has(doc.id));
  }, [documents]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  };

  const refreshDocuments = async () => {
    const res = await fetch('/api/admin/documents', { cache: 'no-store' });
    const data = await res.json();
    setDocuments(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/public-disclosures', { cache: 'no-store' }).then((res) => res.json()),
      fetch('/api/admin/documents', { cache: 'no-store' }).then((res) => res.json()),
    ])
      .then(([infoData, docData]) => {
        setForm(normalizePublicDisclosureInfo(infoData.info));
        setDocuments(Array.isArray(docData) ? docData : []);
      })
      .catch(() => showToast('Unable to load Public Disclosures data.', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const saveDisclosureInfo = async (nextForm, successMessage) => {
    if (savingInfo) return;

    setSavingInfo(true);
    try {
      const res = await fetch('/api/admin/public-disclosures', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ info: nextForm }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Unable to save disclosure information.');
      setForm(normalizePublicDisclosureInfo(data.info));
      showToast(successMessage);
    } catch (error) {
      showToast(error.message || 'Unable to save disclosure information.', 'error');
    } finally {
      setSavingInfo(false);
    }
  };

  const handleSaveInfo = async (event) => {
    event.preventDefault();
    await saveDisclosureInfo(form, 'Public Disclosure information saved.');
  };

  const updateResultField = (key, value) => {
    setResultForm((current) => ({ ...current, [key]: value }));
  };

  const resetResultForm = () => {
    setResultForm(blankResultForm);
    setEditingResultId('');
  };

  const saveResultRow = async () => {
    if (!resultForm.year.trim()) {
      showToast('Year is required for result rows.', 'error');
      return;
    }

    const row = {
      ...resultForm,
      id: editingResultId || `result-${Date.now()}`,
      year: resultForm.year.trim(),
      registeredStudents: resultForm.registeredStudents.trim(),
      studentsPassed: resultForm.studentsPassed.trim(),
      passPercentage: resultForm.passPercentage.trim(),
      remarks: resultForm.remarks.trim(),
    };

    const nextRows = editingResultId
      ? form.resultRows.map((item) => (item.id === editingResultId ? row : item))
      : [...form.resultRows, row];
    const nextForm = { ...form, resultRows: nextRows };
    setForm(nextForm);
    await saveDisclosureInfo(nextForm, editingResultId ? 'Result row updated.' : 'Result row added.');
    resetResultForm();
  };

  const editResultRow = (row) => {
    setResultForm({
      resultClass: row.resultClass || 'Class X',
      year: row.year || '2024',
      registeredStudents: row.registeredStudents || '',
      studentsPassed: row.studentsPassed || '',
      passPercentage: row.passPercentage || '',
      remarks: row.remarks || '',
    });
    setEditingResultId(row.id);
  };

  const deleteResultRow = async (id) => {
    if (!confirm('Delete this result row?')) return;
    const nextForm = { ...form, resultRows: form.resultRows.filter((row) => row.id !== id) };
    setForm(nextForm);
    await saveDisclosureInfo(nextForm, 'Result row deleted.');
    if (editingResultId === id) resetResultForm();
  };

  const uploadPdf = async (row, file) => {
    if (!file) return;
    if (!(await isValidPublicDisclosurePdf(file))) {
      showToast('Only PDF files are allowed for Public Disclosures.', 'error');
      return;
    }

    setUploadingCategory(row.category);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('uploadContext', 'public-disclosure-pdf');

      const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const uploadData = await uploadRes.json().catch(() => ({}));
      if (!uploadRes.ok || !uploadData.url) {
        throw new Error(uploadData.error || 'File upload failed.');
      }

      const existing = docsByCategory.get(row.category);
      const saveRes = await fetch('/api/admin/documents', {
        method: existing && existing.category === row.category ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: existing?.category === row.category ? existing.id : undefined,
          title: row.label,
          category: row.category,
          fileUrl: uploadData.url,
          fileName: uploadData.originalName || file.name,
          mimeType: uploadData.contentType || file.type,
        }),
      });
      const saved = await saveRes.json().catch(() => ({}));
      if (!saveRes.ok) throw new Error(saved.error || 'Document could not be saved.');

      await refreshDocuments();
      showToast(existing ? 'PDF replaced successfully.' : 'PDF uploaded successfully.');
    } catch (error) {
      showToast(error.message || 'Document upload failed.', 'error');
    } finally {
      setUploadingCategory('');
    }
  };

  const deleteDocument = async (doc) => {
    if (!doc?.id) return;
    if (!confirm('Delete this PDF from Public Disclosures?')) return;

    try {
      const res = await fetch(`/api/admin/documents?id=${encodeURIComponent(doc.id)}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Unable to delete PDF.');
      await refreshDocuments();
      showToast('PDF deleted successfully.');
    } catch (error) {
      showToast(error.message || 'Unable to delete PDF.', 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="admin-header">
        <div>
          <h1>Public Disclosures</h1>
          <p className="admin-page-subtitle">Manage CBSE Appendix IX information, PDFs, and infrastructure video link.</p>
        </div>
      </div>

      {toast && <div className={`admin-toast ${toast.type}`}>{toast.message}</div>}

      <div className="admin-card">
        <div className="admin-card-body">
          <div className="admin-form public-disclosure-admin-form">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Select Section</label>
              <select className="form-select" value={selectedSection} onChange={(event) => setSelectedSection(event.target.value)}>
                {disclosureSectionOptions.map((section) => (
                  <option key={section.value} value={section.value}>{section.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="admin-card">
          <div className="admin-card-body" style={{ textAlign: 'center', color: 'var(--gray-400)' }}>
            <i className="fas fa-spinner fa-spin"></i> Loading...
          </div>
        </div>
      ) : (
        <>
          <form onSubmit={handleSaveInfo} className="admin-form public-disclosure-admin-form">
            {selectedSection === 'general' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <h3>A: General Information</h3>
              </div>
              <div className="admin-card-body">
                <FieldGrid rows={generalInformationRows} form={form} onChange={updateField} />
              </div>
            </div>
            )}

            {selectedSection === 'pdf' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <h3>B & C: PDF Documents</h3>
              </div>
              <div className="admin-card-body public-disclosure-admin-table-wrap">
                {appendixDocumentSections.map((section) => (
                  <div key={section.key} className="public-disclosure-admin-subsection">
                    <h4>{section.title}</h4>
                    <table className="admin-table public-disclosure-admin-table">
                      <thead>
                        <tr>
                          <th>SL No.</th>
                          <th>Documents / Information</th>
                          <th>Uploaded PDF</th>
                          <th>Replace / Upload</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.rows.map((row, index) => {
                          const doc = docsByCategory.get(row.category);
                          const isUploading = uploadingCategory === row.category;
                          return (
                            <tr key={row.category}>
                              <td>{index + 1}</td>
                              <td style={{ fontWeight: 600, color: 'var(--navy)' }}>{row.label}</td>
                              <td>
                                {doc?.fileUrl ? (
                                  <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-outline admin-btn-sm">
                                    <i className="fas fa-file-pdf"></i> View
                                  </a>
                                ) : (
                                  <span className="status-badge read">Not Uploaded</span>
                                )}
                              </td>
                              <td>
                                <label className={`admin-btn admin-btn-primary admin-btn-sm ${isUploading ? 'disabled' : ''}`}>
                                  <i className={`fas fa-${isUploading ? 'spinner fa-spin' : 'upload'}`}></i>
                                  {isUploading ? 'Uploading...' : doc ? 'Replace PDF' : 'Upload PDF'}
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
                                {doc?.id ? (
                                  <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => deleteDocument(doc)}>
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
                  </div>
                ))}
                {legacyDocuments.length > 0 && (
                  <div className="public-disclosure-admin-subsection">
                    <h4>Existing Public Disclosure Documents</h4>
                    <table className="admin-table public-disclosure-admin-table">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Category</th>
                          <th>File</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {legacyDocuments.map((doc) => (
                          <tr key={doc.id}>
                            <td style={{ fontWeight: 600, color: 'var(--navy)' }}>{doc.title}</td>
                            <td><span className="status-badge active">{doc.category}</span></td>
                            <td>
                              {doc.fileUrl ? (
                                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-outline admin-btn-sm">
                                  <i className="fas fa-file-pdf"></i> View
                                </a>
                              ) : 'No file'}
                            </td>
                            <td>
                              <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => deleteDocument(doc)}>
                                <i className="fas fa-trash"></i> Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            )}

            {selectedSection === 'results' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <h3>C: Result Tables</h3>
              </div>
              <div className="admin-card-body">
                <div className="public-disclosure-admin-grid">
                  <div className="form-group">
                    <label className="form-label">Result Class</label>
                    <select className="form-select" value={resultForm.resultClass} onChange={(event) => updateResultField('resultClass', event.target.value)}>
                      {resultClassOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Year</label>
                    <select className="form-select" value={resultForm.year} onChange={(event) => updateResultField('year', event.target.value)}>
                      {defaultResultYears.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">No. of Registered Students</label>
                    <input className="form-input" value={resultForm.registeredStudents} onChange={(event) => updateResultField('registeredStudents', event.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">No. of Students Passed</label>
                    <input className="form-input" value={resultForm.studentsPassed} onChange={(event) => updateResultField('studentsPassed', event.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pass Percentage</label>
                    <input className="form-input" value={resultForm.passPercentage} onChange={(event) => updateResultField('passPercentage', event.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Remarks</label>
                    <input className="form-input" value={resultForm.remarks} onChange={(event) => updateResultField('remarks', event.target.value)} />
                  </div>
                </div>

                <div className="admin-action-btns" style={{ marginBottom: '1rem' }}>
                  <button type="button" className="admin-btn admin-btn-primary" onClick={saveResultRow} disabled={savingInfo}>
                    <i className={`fas fa-${savingInfo ? 'spinner fa-spin' : 'save'}`}></i>
                    {editingResultId ? 'Update Result Row' : 'Add Result Row'}
                  </button>
                  {editingResultId && (
                    <button type="button" className="admin-btn admin-btn-outline" onClick={resetResultForm}>
                      Cancel Edit
                    </button>
                  )}
                </div>

                <div className="public-disclosure-admin-table-wrap">
                  <table className="admin-table public-disclosure-admin-table">
                    <thead>
                      <tr>
                        <th>Class</th>
                        <th>Year</th>
                        <th>Registered</th>
                        <th>Passed</th>
                        <th>Pass %</th>
                        <th>Remarks</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.resultRows.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center', color: 'var(--gray-400)' }}>No result rows added yet.</td>
                        </tr>
                      ) : (
                        [...form.resultRows]
                          .sort((a, b) => a.resultClass.localeCompare(b.resultClass) || a.year.localeCompare(b.year))
                          .map((row) => (
                            <tr key={row.id}>
                              <td>{row.resultClass}</td>
                              <td>{row.year}</td>
                              <td>{row.registeredStudents || '--'}</td>
                              <td>{row.studentsPassed || '--'}</td>
                              <td>{row.passPercentage || '--'}</td>
                              <td>{row.remarks || 'NA'}</td>
                              <td>
                                <div className="admin-action-btns">
                                  <button type="button" className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => editResultRow(row)}>
                                    <i className="fas fa-edit"></i> Edit
                                  </button>
                                  <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => deleteResultRow(row.id)}>
                                    <i className="fas fa-trash"></i> Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            )}

            {selectedSection === 'staff' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <h3>D: Staff Teaching</h3>
              </div>
              <div className="admin-card-body">
                <FieldGrid rows={staffTeachingRows} form={form} onChange={updateField} />
              </div>
            </div>
            )}

            {selectedSection === 'infrastructure' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <h3>E: School Infrastructure</h3>
              </div>
              <div className="admin-card-body">
                <FieldGrid rows={infrastructureRows} form={form} onChange={updateField} />
              </div>
            </div>
            )}

            {['general', 'staff', 'infrastructure'].includes(selectedSection) && (
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={savingInfo}
              style={{ marginBottom: '1.5rem', opacity: savingInfo ? 0.7 : 1 }}
            >
              <i className={`fas fa-${savingInfo ? 'spinner fa-spin' : 'save'}`}></i>
              {savingInfo ? 'Saving...' : 'Save Text Information'}
            </button>
            )}
          </form>
        </>
      )}
    </AdminLayout>
  );
}
