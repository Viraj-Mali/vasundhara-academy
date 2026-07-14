'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

const grades = Array.from({ length: 10 }, (_, index) => ({
  key: `grade${index + 1}`,
  label: `Grade ${index + 1}`,
}));

function emptyLinks() {
  return Object.fromEntries(grades.map((grade) => [grade.key, '']));
}

export default function AdminQuestionBankPage() {
  const [links, setLinks] = useState(emptyLinks());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/question-bank', { cache: 'no-store' });
      const data = await res.json();
      setLinks({ ...emptyLinks(), ...(data && typeof data === 'object' ? data : {}) });
    } catch {
      showToast('Unable to load Question Bank Drive links.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const updateLink = (key, value) => {
    setLinks((current) => ({ ...current, [key]: value }));
  };

  const clearLink = (key) => {
    setLinks((current) => ({ ...current, [key]: '' }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/question-bank', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ links }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Unable to save Drive links.');
      setLinks({ ...emptyLinks(), ...data });
      showToast('Question Bank Drive links saved.');
    } catch (error) {
      showToast(error.message || 'Unable to save Drive links.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-header">
        <div>
          <h1>Question Bank</h1>
          <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Manage Grade-wise Google Drive folders for Question Bank PDFs.
          </p>
        </div>
        <button className="admin-btn admin-btn-outline" onClick={fetchLinks} disabled={loading || saving}>
          <i className="fas fa-sync-alt"></i> Refresh
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Grade-wise Drive Folder Links</h3>
        </div>
        <div className="admin-card-body">
          <form className="admin-form" style={{ maxWidth: '100%' }} onSubmit={handleSave}>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {grades.map((grade) => (
                <div key={grade.key} className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">{grade.label} Drive Folder Link</label>
                  <div className="question-bank-link-row">
                    <input
                      className="form-input"
                      type="url"
                      value={links[grade.key] || ''}
                      onChange={(event) => updateLink(grade.key, event.target.value)}
                      placeholder={`Paste ${grade.label} Google Drive folder link`}
                    />
                    {links[grade.key] ? (
                      <a href={links[grade.key]} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-outline admin-btn-sm">
                        <i className="fas fa-external-link-alt"></i> Open
                      </a>
                    ) : (
                      <span className="admin-btn admin-btn-outline admin-btn-sm" style={{ opacity: 0.55, cursor: 'default' }}>
                        <i className="fas fa-folder"></i> Empty
                      </span>
                    )}
                    <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => clearLink(grade.key)} disabled={!links[grade.key]}>
                      <i className="fas fa-times"></i> Clear
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="admin-modal-footer" style={{ justifyContent: 'space-between' }}>
              <p style={{ color: 'var(--gray-400)', fontSize: '0.8rem', margin: 0 }}>
                Staff can upload subject-wise PDFs directly inside each saved Google Drive Grade folder.
              </p>
              <button type="submit" className="admin-btn admin-btn-primary" disabled={saving || loading}>
                <i className={`fas fa-${saving ? 'spinner fa-spin' : 'save'}`}></i>
                {saving ? 'Saving...' : 'Save All Links'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {toast && <div className={`admin-toast ${toast.type}`}>{toast.message}</div>}
    </AdminLayout>
  );
}
