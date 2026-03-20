'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import '@/styles/admin.css';

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/enquiries').then(r => r.json()).then(data => {
      setContacts(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="admin-header">
        <h1>Contact Messages</h1>
        <span style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>
          Messages from Contact Us and Enquiry forms
        </span>
      </div>

      <div className="admin-card">
        <div className="admin-card-body" style={{ padding: 0 }}>
          {loading ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-400)' }}><i className="fas fa-spinner fa-spin"></i> Loading...</p>
          ) : contacts.length === 0 ? (
            <p style={{ padding: '3rem', textAlign: 'center', color: 'var(--gray-400)' }}>
              <i className="fas fa-inbox" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}></i>
              No contact messages yet. They&apos;ll appear here when visitors submit the contact form.
            </p>
          ) : (
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Subject</th><th>Message</th><th>Date</th></tr></thead>
              <tbody>
                {contacts.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600, color: 'var(--navy)' }}>{c.name}</td>
                    <td>{c.phone}</td>
                    <td>{c.email || '-'}</td>
                    <td>{c.subject || '-'}</td>
                    <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.message}</td>
                    <td style={{ fontSize: '0.78rem' }}>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
