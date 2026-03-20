'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import '@/styles/admin.css';

const categoryOptions = [
  { value: 'general', label: '📁 General' },
  { value: 'events', label: '🎉 Events' },
  { value: 'sports', label: '⚽ Sports' },
  { value: 'awards', label: '🏆 Awards' },
  { value: 'campus', label: '🏫 Campus' },
  { value: 'celebration', label: '🎊 Celebrations' },
  // Facility categories — photos appear under the matching facility on /facilities page
  { value: 'classroom', label: '📚 Smart Classrooms (Facility)' },
  { value: 'science-lab', label: '🔬 Science Lab (Facility)' },
  { value: 'computer-lab', label: '💻 Computer Lab (Facility)' },
  { value: 'library', label: '📖 Library (Facility)' },
  { value: 'hostel', label: '🏠 Hostel (Facility)' },
  { value: 'counseling', label: '🤝 Counseling (Facility)' },
  { value: 'healthcare', label: '❤️ Healthcare (Facility)' },
  { value: 'sports-ground', label: '🏟️ Sports Grounds (Facility)' },
  { value: 'indoor-games', label: '♟️ Indoor Games (Facility)' },
  { value: 'outings', label: '🏔️ Outings & Trips (Facility)' },
  { value: 'assembly', label: '📢 Assembly Ground (Facility)' },
  { value: 'transport', label: '🚌 Transport (Facility)' },
];

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadCategory, setUploadCategory] = useState('general');
  const [uploadTitle, setUploadTitle] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selected, setSelected] = useState([]);
  const [toast, setToast] = useState(null);
  const [uploading, setUploading] = useState(false);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const loadImages = () => {
    fetch('/api/admin/gallery').then(r => r.json()).then(data => {
      setImages(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };
  useEffect(loadImages, []);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    setUploading(true);

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', uploadCategory);
      formData.append('title', uploadTitle || file.name.replace(/\.[^.]+$/, ''));

      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        setImages(prev => [data, ...prev]);
      }
    }
    setUploadTitle('');
    setUploading(false);
    e.target.value = '';
    showToast(`${files.length} photo(s) uploaded!`);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this image?')) return;
    await fetch(`/api/admin/gallery?id=${id}`, { method: 'DELETE' });
    setImages(images.filter(i => i.id !== id));
    showToast('Deleted!');
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.length} selected images?`)) return;
    await fetch(`/api/admin/gallery?ids=${selected.join(',')}`, { method: 'DELETE' });
    setImages(images.filter(i => !selected.includes(i.id)));
    setSelected([]);
    showToast(`${selected.length} images deleted!`);
  };

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const filtered = filterCategory === 'all' ? images : images.filter(i => i.category === filterCategory);
  const categories = [...new Set(images.map(i => i.category))];

  return (
    <AdminLayout>
      <div className="admin-header">
        <h1>Gallery Management</h1>
        <span style={{ fontSize: '0.82rem', color: 'var(--gray-400)' }}>{images.length} total photos</span>
      </div>

      {/* Upload Section */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-card-header">
          <h3><i className="fas fa-cloud-upload-alt" style={{ color: 'var(--gold)', marginRight: '0.5rem' }}></i>Upload Photos</h3>
        </div>
        <div className="admin-card-body">
          <div className="admin-form">
            <div className="admin-form-row">
              <div className="form-group">
                <label className="form-label">Photo Title / Caption</label>
                <input className="form-input" value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} placeholder="e.g., Award Winner 2025, Sports Day 2026" />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={uploadCategory} onChange={e => setUploadCategory(e.target.value)}>
                  <optgroup label="General Categories">
                    {categoryOptions.filter(c => !c.label.includes('Facility')).map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="🏗️ Facility Photos (appear on Facilities page)">
                    {categoryOptions.filter(c => c.label.includes('Facility')).map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Facility hint */}
            {uploadCategory && categoryOptions.find(c => c.value === uploadCategory)?.label.includes('Facility') && (
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-md)', padding: '0.6rem 1rem', marginBottom: '1rem', fontSize: '0.78rem', color: '#1e40af' }}>
                <i className="fas fa-info-circle"></i> Photos with this category will automatically appear under the <strong>{uploadCategory.replace('-', ' ')}</strong> section on the public <strong>Facilities</strong> page.
              </div>
            )}

            <label className="image-upload-area" style={{ cursor: uploading ? 'wait' : 'pointer', display: 'block' }}>
              {uploading ? (
                <>
                  <i className="fas fa-spinner fa-spin" style={{ display: 'block', fontSize: '2rem' }}></i>
                  <p>Uploading...</p>
                </>
              ) : (
                <>
                  <i className="fas fa-cloud-upload-alt" style={{ display: 'block', fontSize: '2rem' }}></i>
                  <p>Click to select photos or drag and drop</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--gray-300)', marginTop: '0.3rem' }}>JPG, PNG, WebP — Multiple files supported</p>
                </>
              )}
              <input type="file" multiple accept="image/*" onChange={handleUpload} style={{ display: 'none' }} disabled={uploading} />
            </label>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--gray-500)', marginRight: '0.5rem' }}>Filter:</span>
        <button className={`admin-btn admin-btn-sm ${filterCategory === 'all' ? 'admin-btn-primary' : 'admin-btn-outline'}`} onClick={() => setFilterCategory('all')}>
          All ({images.length})
        </button>
        {categories.map(cat => (
          <button key={cat} className={`admin-btn admin-btn-sm ${filterCategory === cat ? 'admin-btn-primary' : 'admin-btn-outline'}`} onClick={() => setFilterCategory(cat)} style={{ textTransform: 'capitalize' }}>
            {cat} ({images.filter(i => i.category === cat).length})
          </button>
        ))}
      </div>

      {/* Bulk Actions */}
      {selected.length > 0 && (
        <div className="bulk-bar">
          <span><strong>{selected.length}</strong> selected</span>
          <div className="bulk-bar-actions">
            <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={handleBulkDelete}><i className="fas fa-trash"></i> Delete Selected</button>
            <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => setSelected([])}><i className="fas fa-times"></i></button>
          </div>
        </div>
      )}

      {/* Images Grid */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Photos ({filtered.length})</h3>
        </div>
        <div className="admin-card-body">
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--gray-400)' }}><i className="fas fa-spinner fa-spin"></i> Loading...</p>
          ) : filtered.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '2rem 0' }}>No images found.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
              {filtered.map(img => (
                <div key={img.id} style={{ position: 'relative', background: 'var(--off-white)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: selected.includes(img.id) ? '2px solid var(--gold)' : '2px solid transparent', transition: 'border 0.2s' }}>
                  {/* Select checkbox */}
                  <div style={{ position: 'absolute', top: '0.3rem', left: '0.3rem', zIndex: 2 }}>
                    <input type="checkbox" className="admin-checkbox" checked={selected.includes(img.id)} onChange={() => toggleSelect(img.id)} />
                  </div>
                  <img src={img.url} alt={img.title || 'Gallery'} style={{ width: '100%', height: '150px', objectFit: 'cover', cursor: 'pointer' }} onClick={() => toggleSelect(img.id)} />
                  <div style={{ padding: '0.5rem 0.8rem' }}>
                    <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--navy)', lineHeight: 1.3 }}>{img.title || 'Untitled'}</p>
                    <p style={{ fontSize: '0.65rem', color: 'var(--gray-400)', textTransform: 'capitalize' }}>
                      {categoryOptions.find(c => c.value === img.category)?.label.replace(' (Facility)', '') || img.category}
                    </p>
                  </div>
                  <button
                    className="admin-btn admin-btn-danger admin-btn-sm"
                    style={{ position: 'absolute', top: '0.3rem', right: '0.3rem' }}
                    onClick={() => handleDelete(img.id)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && <div className={`admin-toast ${toast.type}`}><i className={`fas fa-${toast.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i> {toast.msg}</div>}
    </AdminLayout>
  );
}
