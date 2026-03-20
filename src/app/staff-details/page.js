'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import '@/styles/about.css';
import '@/styles/phase5.css';

export default function StaffDetailsPage() {
  const [staff, setStaff] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/public/staff')
      .then(r => r.json())
      .then(data => { setStaff(data); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
<h1 className="page-hero-title">Staff Statement</h1>
          <p className="page-hero-desc">Complete staff details of Vasundhara Academy.</p>
        </div>
      </section>

      <section className="table-section">
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Staff Statement</span>
          <h2 className="section-title">Teaching & Non-Teaching Staff</h2>
        </div>
        <div className="table-wrap">
          {!loaded ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}><i className="fas fa-spinner fa-spin"></i> Loading...</p>
          ) : staff.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>Staff details coming soon.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Sr.</th>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Qualification</th>
                  <th>Subject</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s, i) => (
                  <tr key={s.id}>
                    <td>{i + 1}</td>
                    <td>
                      {s.photo ? (
                        <img src={s.photo} alt={s.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--navy)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                          {s.name?.charAt(0)}
                        </div>
                      )}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--navy)' }}>{s.name}</td>
                    <td>{s.designation}</td>
                    <td>{s.qualification || '-'}</td>
                    <td>{s.subject || '-'}</td>
                    <td>
                      <span className={`badge ${s.category === 'teaching' ? 'badge-gold' : 'badge-success'}`} style={{ textTransform: 'capitalize' }}>
                        {s.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </>
  );
}
