'use client';

import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  appendixDocumentSections,
  EXTRA_B_CATEGORIES,
  EXTRA_C_CATEGORIES,
  generalInformationRows,
  getDocumentForAppendixRow,
  infrastructureRows,
  normalizePublicDisclosureInfo,
  resultClassOptions,
  staffTeachingRows,
} from '@/lib/publicDisclosureConfig';
import '@/styles/admin.css';

const SECTION_OPTIONS = [
  { key: 'A', label: 'A: General Information' },
  { key: 'B', label: 'B: Documents and Information' },
  { key: 'C', label: 'C: Result and Academics' },
  { key: 'D', label: 'D: Staff Teaching' },
  { key: 'E', label: 'E: School Infrastructure' },
];

const EXTRA_CATEGORY = {
  B: 'public-disclosure-b-extra',
  C: 'public-disclosure-c-extra',
};

const emptyExtraForm = { title: '', order: 0, file: null };
const emptyResultForm = {
  resultClass: 'Class X',
  year: '',
  registeredStudents: '',
  studentsPassed: '',
  passPercentage: '',
  remarks: '',
};

async function isValidPdf(file) {
  if (!file?.name?.toLowerCase().endsWith('.pdf')) return false;
  const mimeType = (file.type || '').toLowerCase();
  const allowedMime = !mimeType
    || mimeType === 'application/pdf'
    || mimeType === 'application/x-pdf'
    || mimeType === 'application/octet-stream';
  if (!allowedMime) return false;

  try {
    return await file.slice(0, 4).text() === '%PDF';
  } catch {
    return allowedMime;
  }
}

function sectionRows(section) {
  return appendixDocumentSections.find((item) => item.key === section)?.rows || [];
}

export default function AdminDocuments() {
  const [selectedSection, setSelectedSection] = useState('A');
  const [info, setInfo] = useState(normalizePublicDisclosureInfo());
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [editingFixedCategory, setEditingFixedCategory] = useState(null);
  const [editingFixedTitle, setEditingFixedTitle] = useState('');
  const [busyFixedCategory, setBusyFixedCategory] = useState(null);
  const [extraForm, setExtraForm] = useState(emptyExtraForm);
  const [editingExtraId, setEditingExtraId] = useState(null);
  const [replacingExtraId, setReplacingExtraId] = useState(null);
  const [extraFileKey, setExtraFileKey] = useState(0);
  const [resultForm, setResultForm] = useState(emptyResultForm);
  const [editingResultId, setEditingResultId] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3500);
  };

  const fetchData = async () => {
    const [infoResponse, documentsResponse] = await Promise.all([
      fetch('/api/admin/public-disclosures', { cache: 'no-store' }),
      fetch('/api/admin/documents', { cache: 'no-store' }),
    ]);
    const infoData = await infoResponse.json().catch(() => ({}));
    const documentData = await documentsResponse.json().catch(() => []);
    if (!infoResponse.ok) throw new Error(infoData.error || 'Unable to load disclosure information.');
    if (!documentsResponse.ok) throw new Error('Unable to load disclosure documents.');
    setInfo(normalizePublicDisclosureInfo(infoData.info));
    setDocuments(Array.isArray(documentData) ? documentData : []);
  };

  useEffect(() => {
    fetchData()
      .catch((error) => showToast(error.message, 'error'))
      .finally(() => setLoading(false));
  }, []);

  const persistInfo = async (nextInfo, successMessage) => {
    setSaving(true);
    try {
      const normalized = normalizePublicDisclosureInfo(nextInfo);
      const response = await fetch('/api/admin/public-disclosures', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ info: normalized }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Unable to save Public Disclosures.');
      setInfo(normalizePublicDisclosureInfo(data.info));
      showToast(successMessage);
      return true;
    } catch (error) {
      showToast(error.message, 'error');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleSaveInfoSection = async (event, name) => {
    event.preventDefault();
    await persistInfo(info, `${name} updated.`);
  };

  const uploadPdf = async (file) => {
    if (!(await isValidPdf(file))) throw new Error('Only valid PDF files are allowed.');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadContext', 'public-disclosure-pdf');
    const response = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.url) throw new Error(data.error || 'PDF upload failed.');
    return data.url;
  };

  const saveDocument = async (body, method = 'POST') => {
    const response = await fetch('/api/admin/documents', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Unable to save document.');
    return data;
  };

  const refreshDocuments = async () => {
    const response = await fetch('/api/admin/documents', { cache: 'no-store' });
    const data = await response.json().catch(() => []);
    if (!response.ok) throw new Error('Unable to refresh documents.');
    setDocuments(Array.isArray(data) ? data : []);
  };

  const startFixedTitleEdit = (row, document) => {
    setEditingFixedCategory(row.category);
    setEditingFixedTitle(document?.title || row.label);
  };

  const saveFixedTitle = async (row) => {
    const title = editingFixedTitle.trim();
    if (!title) return showToast('Document name is required.', 'error');
    const document = getDocumentForAppendixRow(documents, row);
    const exactDocument = document?.category === row.category;
    setBusyFixedCategory(row.category);
    try {
      await saveDocument({
        ...(exactDocument ? { id: document.id } : {}),
        title,
        category: row.category,
        fileUrl: document?.fileUrl || '',
        order: 0,
      }, exactDocument ? 'PUT' : 'POST');
      await refreshDocuments();
      setEditingFixedCategory(null);
      setEditingFixedTitle('');
      showToast('Document name updated.');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setBusyFixedCategory(null);
    }
  };

  const uploadFixedPdf = async (row, file) => {
    if (!file) return;
    setBusyFixedCategory(row.category);
    try {
      const fileUrl = await uploadPdf(file);
      const document = getDocumentForAppendixRow(documents, row);
      const exactDocument = document?.category === row.category;
      await saveDocument({
        ...(exactDocument ? { id: document.id } : {}),
        title: document?.title || row.label,
        category: row.category,
        fileUrl,
        fileName: file.name,
        mimeType: file.type,
        order: 0,
      }, exactDocument ? 'PUT' : 'POST');
      await refreshDocuments();
      showToast(document?.fileUrl ? 'PDF replaced.' : 'PDF uploaded.');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setBusyFixedCategory(null);
    }
  };

  const removeFixedPdf = async (row) => {
    const document = getDocumentForAppendixRow(documents, row);
    if (!document?.fileUrl) return;
    if (!window.confirm('Remove this PDF? The fixed row and its name will remain visible.')) return;
    const exactDocument = document.category === row.category;
    setBusyFixedCategory(row.category);
    try {
      await saveDocument({
        ...(exactDocument ? { id: document.id } : {}),
        title: document.title || row.label,
        category: row.category,
        fileUrl: '',
        order: 0,
      }, exactDocument ? 'PUT' : 'POST');
      await refreshDocuments();
      showToast('PDF removed. The fixed row was preserved.');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setBusyFixedCategory(null);
    }
  };

  const resetExtraForm = () => {
    setExtraForm(emptyExtraForm);
    setEditingExtraId(null);
    setExtraFileKey((key) => key + 1);
  };

  const saveExtraDocument = async (event, section) => {
    event.preventDefault();
    if (!extraForm.title.trim()) return showToast('Document name is required.', 'error');
    const existing = documents.find((document) => document.id === editingExtraId);
    if (!existing && !extraForm.file) return showToast('Please choose a PDF file.', 'error');
    setSaving(true);
    try {
      const fileUrl = extraForm.file ? await uploadPdf(extraForm.file) : existing.fileUrl;
      await saveDocument({
        ...(existing ? { id: existing.id } : {}),
        title: extraForm.title.trim(),
        category: existing?.category || EXTRA_CATEGORY[section],
        fileUrl,
        fileName: extraForm.file?.name,
        mimeType: extraForm.file?.type,
        order: Number.parseInt(extraForm.order, 10) || 0,
      }, existing ? 'PUT' : 'POST');
      await refreshDocuments();
      resetExtraForm();
      showToast(existing ? 'Extra document updated.' : 'Extra document added.');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const editExtraDocument = (document) => {
    setEditingExtraId(document.id);
    setExtraForm({ title: document.title, order: document.order || 0, file: null });
    setExtraFileKey((key) => key + 1);
  };

  const replaceExtraPdf = async (document, file) => {
    if (!file) return;
    setReplacingExtraId(document.id);
    try {
      const fileUrl = await uploadPdf(file);
      await saveDocument({
        id: document.id,
        title: document.title,
        category: document.category,
        fileUrl,
        fileName: file.name,
        mimeType: file.type,
        order: document.order || 0,
      }, 'PUT');
      await refreshDocuments();
      showToast('PDF replaced.');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setReplacingExtraId(null);
    }
  };

  const deleteExtraDocument = async (document) => {
    if (!window.confirm('Delete this extra document and its PDF?')) return;
    try {
      const response = await fetch(`/api/admin/documents?id=${encodeURIComponent(document.id)}`, { method: 'DELETE' });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Unable to delete document.');
      await refreshDocuments();
      if (editingExtraId === document.id) resetExtraForm();
      showToast('Extra document deleted.');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const saveResultRow = async (event) => {
    event.preventDefault();
    if (!resultForm.year.trim()) return showToast('Result year is required.', 'error');
    const id = editingResultId || `result-${Date.now()}`;
    const row = { ...resultForm, id };
    const resultRows = editingResultId
      ? info.resultRows.map((item) => item.id === editingResultId ? row : item)
      : [...info.resultRows, row];
    const saved = await persistInfo({ ...info, resultRows }, editingResultId ? 'Result row updated.' : 'Result row added.');
    if (saved) {
      setResultForm(emptyResultForm);
      setEditingResultId(null);
    }
  };

  const editResultRow = (row) => {
    setEditingResultId(row.id);
    setResultForm({
      resultClass: row.resultClass,
      year: row.year,
      registeredStudents: row.registeredStudents,
      studentsPassed: row.studentsPassed,
      passPercentage: row.passPercentage,
      remarks: row.remarks,
    });
  };

  const deleteResultRow = async (row) => {
    if (!window.confirm(`Delete the ${row.resultClass} result row for ${row.year}?`)) return;
    await persistInfo({ ...info, resultRows: info.resultRows.filter((item) => item.id !== row.id) }, 'Result row deleted.');
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
    setEditingFixedCategory(null);
    resetExtraForm();
    setEditingResultId(null);
    setResultForm(emptyResultForm);
  };

  const renderInfoForm = (rows, sectionName) => (
    <div className="admin-card">
      <div className="admin-card-header"><h3>{sectionName}</h3></div>
      <div className="admin-card-body">
        <form className="admin-form public-disclosure-admin-form" onSubmit={(event) => handleSaveInfoSection(event, sectionName)}>
          <div className="public-disclosure-admin-grid">
            {rows.map((row) => (
              <div className="form-group" key={row.key}>
                <label className="form-label">{row.label}</label>
                {row.key === 'address' || row.key === 'contactDetails' || row.key === 'specialEducator' || row.key === 'counsellor' ? (
                  <textarea
                    className="form-textarea"
                    value={info[row.key]}
                    onChange={(event) => setInfo({ ...info, [row.key]: event.target.value })}
                  />
                ) : (
                  <input
                    className="form-input"
                    type={row.type === 'url' ? 'url' : 'text'}
                    value={info[row.key]}
                    onChange={(event) => setInfo({ ...info, [row.key]: event.target.value })}
                    placeholder={row.type === 'url' ? 'https://www.youtube.com/...' : ''}
                  />
                )}
              </div>
            ))}
          </div>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            <i className={`fas fa-${saving ? 'spinner fa-spin' : 'save'}`}></i> {saving ? 'Saving...' : `Save ${sectionName}`}
          </button>
        </form>
      </div>
    </div>
  );

  const renderFixedTable = (section) => {
    const rows = sectionRows(section === 'B' ? 'documents' : 'academics');
    return (
      <div className="admin-card">
        <div className="admin-card-header"><h3>{section}: Fixed Documents</h3></div>
        <div className="admin-card-body public-disclosure-admin-table-wrap">
          <table className="admin-table public-disclosure-admin-table">
            <thead><tr><th>SL No.</th><th>Document Name</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {rows.map((row, index) => {
                const document = getDocumentForAppendixRow(documents, row);
                const hasFile = Boolean(document?.fileUrl);
                const editing = editingFixedCategory === row.category;
                const busy = busyFixedCategory === row.category;
                return (
                  <tr key={row.category}>
                    <td>{index + 1}</td>
                    <td>
                      {editing ? (
                        <input className="form-input" value={editingFixedTitle} onChange={(event) => setEditingFixedTitle(event.target.value)} />
                      ) : <strong>{document?.title || row.label}</strong>}
                    </td>
                    <td><span className={`status-badge ${hasFile ? 'active' : 'read'}`}>{hasFile ? 'Uploaded' : 'Not Uploaded'}</span></td>
                    <td>
                      <div className="admin-action-btns">
                        {editing ? (
                          <>
                            <button className="admin-btn admin-btn-primary admin-btn-sm" type="button" disabled={busy} onClick={() => saveFixedTitle(row)}>Save Name</button>
                            <button className="admin-btn admin-btn-outline admin-btn-sm" type="button" onClick={() => setEditingFixedCategory(null)}>Cancel</button>
                          </>
                        ) : (
                          <button className="admin-btn admin-btn-outline admin-btn-sm" type="button" onClick={() => startFixedTitleEdit(row, document)}><i className="fas fa-edit"></i> Edit Name</button>
                        )}
                        {hasFile && <a className="admin-btn admin-btn-outline admin-btn-sm" href={document.fileUrl} target="_blank" rel="noopener noreferrer"><i className="fas fa-eye"></i> View PDF</a>}
                        <label className={`admin-btn admin-btn-primary admin-btn-sm ${busy ? 'disabled' : ''}`}>
                          <i className={`fas fa-${busy ? 'spinner fa-spin' : 'upload'}`}></i> {hasFile ? 'Replace PDF' : 'Upload PDF'}
                          <input type="file" accept=".pdf,application/pdf,application/x-pdf" disabled={busy} style={{ display: 'none' }} onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ''; uploadFixedPdf(row, file); }} />
                        </label>
                        {hasFile && <button className="admin-btn admin-btn-danger admin-btn-sm" type="button" disabled={busy} onClick={() => removeFixedPdf(row)}><i className="fas fa-unlink"></i> Remove PDF</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderExtraDocuments = (section) => {
    const categories = section === 'B' ? EXTRA_B_CATEGORIES : EXTRA_C_CATEGORIES;
    const extraDocuments = documents
      .filter((document) => categories.includes(document.category))
      .sort((a, b) => (a.order || 0) - (b.order || 0) || String(a.createdAt).localeCompare(String(b.createdAt)));
    return (
      <>
        <div className="admin-card">
          <div className="admin-card-header"><h3>{editingExtraId ? `Edit Extra ${section} Section Document` : `Add Extra ${section} Section Document`}</h3></div>
          <div className="admin-card-body">
            <form className="admin-form" onSubmit={(event) => saveExtraDocument(event, section)}>
              <div className="admin-form-row">
                <div className="form-group">
                  <label className="form-label">Document Name</label>
                  <input className="form-input" required value={extraForm.title} onChange={(event) => setExtraForm({ ...extraForm, title: event.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Display Order</label>
                  <input className="form-input" type="number" min="0" value={extraForm.order} onChange={(event) => setExtraForm({ ...extraForm, order: event.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Upload PDF {editingExtraId && '(optional when keeping current PDF)'}</label>
                <input key={extraFileKey} className="form-input" type="file" accept=".pdf,application/pdf,application/x-pdf" onChange={(event) => setExtraForm({ ...extraForm, file: event.target.files?.[0] || null })} />
              </div>
              <div className="admin-header-actions">
                <button className="admin-btn admin-btn-primary" type="submit" disabled={saving}><i className={`fas fa-${saving ? 'spinner fa-spin' : 'save'}`}></i> {saving ? 'Saving...' : 'Save Document'}</button>
                {editingExtraId && <button className="admin-btn admin-btn-outline" type="button" onClick={resetExtraForm}>Cancel</button>}
              </div>
            </form>
          </div>
        </div>
        <div className="admin-card">
          <div className="admin-card-header"><h3>Extra {section} Section Documents</h3></div>
          <div className="admin-card-body public-disclosure-admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Document Name</th><th>PDF</th><th>Actions</th></tr></thead>
              <tbody>
                {extraDocuments.length === 0 ? <tr><td colSpan="4">No extra {section} documents added.</td></tr> : extraDocuments.map((document) => (
                  <tr key={document.id}>
                    <td>{document.order || 0}</td><td><strong>{document.title}</strong></td>
                    <td>{document.fileUrl ? <span className="status-badge active">Uploaded</span> : <span className="status-badge read">Not Uploaded</span>}</td>
                    <td><div className="admin-action-btns">
                      {document.fileUrl && <a className="admin-btn admin-btn-outline admin-btn-sm" href={document.fileUrl} target="_blank" rel="noopener noreferrer"><i className="fas fa-eye"></i> View PDF</a>}
                      <button className="admin-btn admin-btn-outline admin-btn-sm" type="button" onClick={() => editExtraDocument(document)}><i className="fas fa-edit"></i> Edit</button>
                      <label className={`admin-btn admin-btn-primary admin-btn-sm ${replacingExtraId === document.id ? 'disabled' : ''}`}><i className={`fas fa-${replacingExtraId === document.id ? 'spinner fa-spin' : 'upload'}`}></i> Replace PDF<input type="file" accept=".pdf,application/pdf,application/x-pdf" disabled={replacingExtraId === document.id} style={{ display: 'none' }} onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ''; replaceExtraPdf(document, file); }} /></label>
                      <button className="admin-btn admin-btn-danger admin-btn-sm" type="button" onClick={() => deleteExtraDocument(document)}><i className="fas fa-trash"></i> Delete</button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  const sortedResultRows = useMemo(() => [...info.resultRows].sort((a, b) => a.resultClass.localeCompare(b.resultClass) || a.year.localeCompare(b.year)), [info.resultRows]);

  const renderResults = () => (
    <div className="admin-card">
      <div className="admin-card-header"><h3>Result Tables Management</h3></div>
      <div className="admin-card-body">
        <form className="admin-form" onSubmit={saveResultRow}>
          <div className="public-disclosure-admin-grid">
            <div className="form-group"><label className="form-label">Result Class</label><select className="form-select" value={resultForm.resultClass} onChange={(event) => setResultForm({ ...resultForm, resultClass: event.target.value })}>{resultClassOptions.map((option) => <option key={option}>{option}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Year</label><input className="form-input" required value={resultForm.year} onChange={(event) => setResultForm({ ...resultForm, year: event.target.value })} /></div>
            <div className="form-group"><label className="form-label">No. of Registered Students</label><input className="form-input" value={resultForm.registeredStudents} onChange={(event) => setResultForm({ ...resultForm, registeredStudents: event.target.value })} /></div>
            <div className="form-group"><label className="form-label">No. of Students Passed</label><input className="form-input" value={resultForm.studentsPassed} onChange={(event) => setResultForm({ ...resultForm, studentsPassed: event.target.value })} /></div>
            <div className="form-group"><label className="form-label">Pass Percentage</label><input className="form-input" value={resultForm.passPercentage} onChange={(event) => setResultForm({ ...resultForm, passPercentage: event.target.value })} /></div>
            <div className="form-group"><label className="form-label">Remarks</label><input className="form-input" value={resultForm.remarks} onChange={(event) => setResultForm({ ...resultForm, remarks: event.target.value })} /></div>
          </div>
          <div className="admin-header-actions"><button className="admin-btn admin-btn-primary" type="submit" disabled={saving}><i className={`fas fa-${saving ? 'spinner fa-spin' : 'save'}`}></i> {editingResultId ? 'Update Result' : 'Add Result'}</button>{editingResultId && <button className="admin-btn admin-btn-outline" type="button" onClick={() => { setEditingResultId(null); setResultForm(emptyResultForm); }}>Cancel</button>}</div>
        </form>
        <div className="public-disclosure-admin-table-wrap" style={{ marginTop: '1.5rem' }}>
          <table className="admin-table"><thead><tr><th>Class</th><th>Year</th><th>Registered</th><th>Passed</th><th>Pass %</th><th>Remarks</th><th>Actions</th></tr></thead>
            <tbody>{sortedResultRows.length === 0 ? <tr><td colSpan="7">No result rows added.</td></tr> : sortedResultRows.map((row) => <tr key={row.id}><td>{row.resultClass}</td><td>{row.year || 'NA'}</td><td>{row.registeredStudents || 'NA'}</td><td>{row.studentsPassed || 'NA'}</td><td>{row.passPercentage || 'NA'}</td><td>{row.remarks || 'NA'}</td><td><div className="admin-action-btns"><button className="admin-btn admin-btn-outline admin-btn-sm" type="button" onClick={() => editResultRow(row)}><i className="fas fa-edit"></i> Edit</button><button className="admin-btn admin-btn-danger admin-btn-sm" type="button" onClick={() => deleteResultRow(row)}><i className="fas fa-trash"></i> Delete</button></div></td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="admin-header"><div><h1>Public Disclosures</h1><p style={{ color: 'var(--gray-400)', marginTop: '0.25rem' }}>Manage Appendix IX sections A, B, C, D and E.</p></div></div>
      {toast && <div className={`admin-toast ${toast.type}`}>{toast.message}</div>}
      <div className="admin-card">
        <div className="admin-card-body"><div className="form-group" style={{ maxWidth: '520px', marginBottom: 0 }}><label className="form-label">Select Section</label><select className="form-select" value={selectedSection} onChange={(event) => handleSectionChange(event.target.value)}>{SECTION_OPTIONS.map((option) => <option key={option.key} value={option.key}>{option.label}</option>)}</select></div></div>
      </div>
      {loading ? <div className="admin-card"><div className="admin-card-body" style={{ textAlign: 'center', padding: '3rem' }}><i className="fas fa-spinner fa-spin"></i> Loading Public Disclosures...</div></div> : (
        <>
          {selectedSection === 'A' && renderInfoForm(generalInformationRows, 'A: General Information')}
          {selectedSection === 'B' && <>{renderFixedTable('B')}{renderExtraDocuments('B')}</>}
          {selectedSection === 'C' && <>{renderFixedTable('C')}{renderExtraDocuments('C')}{renderResults()}</>}
          {selectedSection === 'D' && renderInfoForm(staffTeachingRows, 'D: Staff Teaching')}
          {selectedSection === 'E' && renderInfoForm(infrastructureRows, 'E: School Infrastructure')}
        </>
      )}
    </AdminLayout>
  );
}
