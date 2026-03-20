'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import '@/styles/about.css';
import '@/styles/phase5.css';

const defaultInfoCards = [
  {
    icon: 'fas fa-building',
    title: 'Infrastructure Details',
    content: [
      'Total campus area: Well-spread with academic and sports zones',
      'Smart classrooms with projectors and digital boards',
      'Fully equipped Science and Computer laboratories',
      'Library with 5000+ books and digital resources',
      'Assembly hall for events and gatherings',
      'Separate washrooms for boys and girls',
      'CCTV surveillance across campus',
      'Safe drinking water (RO purified)',
    ],
  },
  {
    icon: 'fas fa-chart-bar',
    title: 'Section-wise Student Strength',
    content: [
      'Grade 1: 2 sections — 60 students',
      'Grade 2: 2 sections — 55 students',
      'Grade 3: 2 sections — 58 students',
      'Grade 4: 2 sections — 52 students',
      'Grade 5: 2 sections — 50 students',
      'Grade 6: 2 sections — 55 students',
      'Grade 7: 2 sections — 48 students',
      'Grade 8: 1 section — 40 students',
      'Grade 9: 1 section — 38 students',
      'Grade 10: 1 section — 35 students',
    ],
  },
];

const defaultCommittees = [
  {
    name: 'Sakhi Savitri Committee',
    icon: 'fas fa-female',
    date: 'Constituted on 12th July 2025',
    members: [
      { name: 'Mr. Vikram Nawale', designation: 'President', category: 'President of School Management Committee' },
      { name: 'Mrs. Soniya Nawale', designation: 'Vice President', category: 'Teacher Representative' },
      { name: 'Prin. Dr. Jayashri Deshmukh', designation: 'Member Secretary', category: 'Principal of School' },
      { name: 'Mrs. Aarti Jadhav', designation: 'Member', category: 'Counselor' },
      { name: 'Dr. Vrushali Dhumal', designation: 'Member', category: 'Doctor' },
      { name: 'Mrs. Shital Talekar', designation: 'Member', category: 'Pre-School Teacher' },
      { name: 'Ms. Pranali Dhumal', designation: 'Member', category: 'Police Patil' },
      { name: 'Mrs. Sangita Sapike', designation: 'Member', category: 'Gramsevak' },
      { name: 'Mrs. Radhika Nawale', designation: 'Member', category: 'Parent Representative' },
      { name: 'Miss. Akshika Landge', designation: 'Member', category: 'Student Representative' },
      { name: 'Miss. Disha Dhage', designation: 'Member', category: 'Student Representative' },
      { name: 'Mast. Advait Gujar', designation: 'Member', category: 'Student Representative' },
      { name: 'Mast. Taksh Shaha', designation: 'Member', category: 'Student Representative' },
    ],
  },
  {
    name: 'School Management Committee',
    icon: 'fas fa-users-cog',
    date: 'Constituted on 12th July 2025 during Parent Teacher Coordination Meeting',
    members: [
      { name: 'Mr. Vikram Nawale', designation: 'President', category: 'Parent Representative' },
      { name: 'Mr. Sharad Nawale', designation: 'Vice President', category: 'Local Body Representative' },
      { name: 'Prin. Dr. Jayashri Deshmukh', designation: 'Member Secretary', category: 'Principal of School' },
      { name: 'Dr. Rahul Wale', designation: 'Member', category: 'Parent Representative' },
      { name: 'Mr. Mayur Rasane', designation: 'Member', category: 'Parent Representative' },
      { name: 'Mr. Sharad Satpute', designation: 'Member', category: 'Parent Representative' },
      { name: 'Mrs. Pournima Kadam', designation: 'Member', category: 'Parent Representative' },
      { name: 'Mr. Ganesh Kale', designation: 'Member', category: 'Parent Representative' },
      { name: 'Dr. Dipashri Shete', designation: 'Member', category: 'Parent Representative' },
      { name: 'Mr. Sakharam Ware', designation: 'Member', category: 'Parent Representative' },
      { name: 'Mr. Santosh Landge', designation: 'Member', category: 'Parent Representative' },
      { name: 'Mrs. Vrushali Shete', designation: 'Member', category: 'Parent Representative' },
      { name: 'Mrs. Prajakta Netke', designation: 'Member', category: 'Local Body Representative' },
    ],
  },
  {
    name: 'Student Safety & Physical Facilities Development Committee',
    icon: 'fas fa-shield-alt',
    date: 'Constituted on 12th July 2025',
    members: [
      { name: 'Mr. Sharad Nawale', designation: 'President', category: 'Councillor (Nagarsevak)' },
      { name: 'Mrs. Shital Vaidya', designation: 'Vice President', category: 'Local Body Representative' },
      { name: 'Prin. Dr. Jayashri Deshmukh', designation: 'Member Secretary', category: 'Principal of School' },
      { name: 'Mrs. Radhika Nawale', designation: 'Member', category: 'Teacher Representative' },
      { name: 'Mrs. Aarti Jadhav', designation: 'Member', category: 'Counselor' },
      { name: 'Mr. Ashabai Talpade', designation: 'Member', category: 'Health Worker' },
      { name: 'Mrs. Maya Aher', designation: 'Member', category: 'Pre-School Teacher' },
      { name: 'Mr. Pranali Dhumal', designation: 'Member', category: 'Police Patil' },
      { name: 'Dr. Vrushali Dhumal', designation: 'Member', category: 'Doctor' },
      { name: 'Ad. Sarojini Nehe', designation: 'Member', category: 'Lawyer' },
      { name: 'Mr. Santosh Landge', designation: 'Member', category: 'Parent Representative' },
      { name: 'Mr. Amit Mhaskule', designation: 'Member', category: 'Business Man' },
      { name: 'Mr. Vijay Bhangare', designation: 'Member', category: 'Kendrapramukh' },
      { name: 'Mr. Mohan Borse', designation: 'Invited Member', category: 'Police Inspector, Police Station, Akole' },
    ],
  },
  {
    name: "Women's Grievance Redressal / Internal Complaint Committee",
    icon: 'fas fa-exclamation-circle',
    date: 'Constituted on 30th June 2025',
    members: [
      { name: 'Dr. Jayashri Deshmukh', designation: 'President', category: 'Principal' },
      { name: 'Mrs. Radhika Nawale', designation: 'Member', category: 'Teacher Representative' },
      { name: 'Mrs. Soniya Nawale', designation: 'Member', category: 'Teacher Representative' },
      { name: 'Mrs. Sangita Varpe', designation: 'Member', category: 'Teacher Representative' },
      { name: 'Ad. Sarojini Nehe', designation: 'Member', category: 'Legal Advisor' },
      { name: 'Vrushali Shete', designation: 'Member', category: 'Parent Representative' },
      { name: 'Prajakta Solapure', designation: 'Member', category: 'Parent Representative' },
      { name: 'Shubhada Nikam', designation: 'Member', category: 'Parent Representative' },
      { name: 'Megha Naikwadi', designation: 'Member', category: 'Non-Teaching Staff Representative' },
      { name: 'Jyoti Salunke', designation: 'Member', category: 'Non-Teaching Staff Representative' },
      { name: 'Kasturi Dipak Raut', designation: 'Member', category: 'Student Representative' },
      { name: 'Anannya Vikas Wanave', designation: 'Member', category: 'Student Representative' },
      { name: 'Rajnandini Dipak Shete', designation: 'Member', category: 'Student Representative' },
    ],
  },
];

export default function ComprehensiveInfoPage() {
  const [dbCommittees, setDbCommittees] = useState([]);

  useEffect(() => {
    fetch('/api/public/committees')
      .then(r => r.json())
      .then(data => setDbCommittees(data))
      .catch(() => {});
  }, []);

  // Merge: for each default committee, check if DB has a version with members
  // Only use DB version if it actually has members, otherwise keep hardcoded data
  const allCommittees = defaultCommittees.map(dc => {
    const dbMatch = dbCommittees.find(dbc => dbc.name.toLowerCase().includes(dc.name.toLowerCase().split(' ')[0]));
    if (dbMatch && dbMatch.members && dbMatch.members.length > 0) {
      return { ...dc, members: dbMatch.members, id: dbMatch.id };
    }
    return dc;
  });
  // Also add any DB committees not in defaults
  dbCommittees.forEach(dbc => {
    const exists = defaultCommittees.some(dc => dbc.name.toLowerCase().includes(dc.name.toLowerCase().split(' ')[0]));
    if (!exists && dbc.members && dbc.members.length > 0) {
      allCommittees.push(dbc);
    }
  });

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-hero-title">Comprehensive Information</h1>
          <p className="page-hero-desc">Infrastructure, committees, student data, and safety details.</p>
        </div>
      </section>

      {/* Infrastructure & Student Strength */}
      <section className="comp-section">
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Information</span>
          <h2 className="section-title">School Details</h2>
        </div>
        <div className="comp-grid">
          {defaultInfoCards.map((card, i) => (
            <div key={i} className="comp-card">
              <h3><i className={card.icon}></i> {card.title}</h3>
              <ul>
                {card.content.map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Committees Section */}
      <section style={{ padding: '4rem 0', background: 'var(--off-white)' }}>
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Committees</span>
          <h2 className="section-title">School Committees</h2>
          <p className="section-desc" style={{ margin: '0 auto 2rem' }}>
            Various committees constituted for the welfare and governance of Vasundhara Academy.
          </p>
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
          {allCommittees.map((committee, ci) => (
            <div key={committee.id || ci} style={{ background: 'var(--white)', borderRadius: 'var(--radius-xl)', marginBottom: '2rem', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
              {/* Committee Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem 1.5rem', background: 'linear-gradient(135deg, var(--navy), var(--navy-light))', color: 'var(--white)' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(212,168,83,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className={committee.icon || 'fas fa-users'} style={{ color: 'var(--gold)', fontSize: '1rem' }}></i>
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-heading)', margin: 0 }}>{committee.name}</h3>
                  {committee.date && <p style={{ fontSize: '0.72rem', opacity: 0.7, margin: '0.2rem 0 0' }}>{committee.date}</p>}
                  {committee.description && <p style={{ fontSize: '0.72rem', opacity: 0.7, margin: '0.2rem 0 0' }}>{committee.description}</p>}
                </div>
                <div style={{ marginLeft: 'auto', background: 'rgba(212,168,83,0.2)', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 600 }}>
                  {committee.members?.length || 0} Members
                </div>
              </div>

              {/* Members Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--gold)' }}>
                      <th style={{ padding: '0.7rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '1px' }}>Sr.</th>
                      <th style={{ padding: '0.7rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '1px' }}>Name</th>
                      <th style={{ padding: '0.7rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '1px' }}>Category</th>
                      <th style={{ padding: '0.7rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '1px' }}>Designation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(committee.members || []).map((m, mi) => (
                      <tr key={m.id || mi} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.6rem 1rem', fontSize: '0.82rem', color: 'var(--gray-400)', fontWeight: 600 }}>{mi + 1}</td>
                        <td style={{ padding: '0.6rem 1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)' }}>{m.name}</td>
                        <td style={{ padding: '0.6rem 1rem', fontSize: '0.82rem', color: 'var(--gray-500)' }}>{m.category || m.phone || '-'}</td>
                        <td style={{ padding: '0.6rem 1rem' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.2rem 0.6rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            background: m.designation === 'President' ? 'rgba(212,168,83,0.15)' :
                                       m.designation === 'Vice President' ? 'rgba(37,99,235,0.1)' :
                                       m.designation === 'Member Secretary' ? 'rgba(5,150,105,0.1)' :
                                       m.designation === 'Invited Member' ? 'rgba(234,88,12,0.1)' : '#f1f5f9',
                            color: m.designation === 'President' ? 'var(--gold-dark)' :
                                  m.designation === 'Vice President' ? '#2563eb' :
                                  m.designation === 'Member Secretary' ? '#059669' :
                                  m.designation === 'Invited Member' ? '#ea580c' : 'var(--gray-500)',
                          }}>
                            {m.designation}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Google Location Map */}
      <section style={{ padding: '4rem 0', background: 'var(--white)' }}>
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Location</span>
          <h2 className="section-title">Find Us on Google Maps</h2>
          <p className="section-desc" style={{ margin: '0 auto 2rem' }}>
            Vasundhara Academy is located in Akole, Ahmednagar district, Maharashtra.
          </p>
        </div>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '3px solid var(--gold)' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3756.123!2d73.9992023!3d19.5281872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdd08c6b7493abd%3A0x68e4b86d59c33e2!2sAbhinav%20Education%20Society%2CAkole!5e0!3m2!1sen!2sin!4v1700000000000"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Vasundhara Academy Location"
            ></iframe>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <i className="fas fa-map-marker-alt" style={{ color: 'var(--gold)', fontSize: '1.2rem' }}></i>
              <p style={{ fontSize: '0.85rem', color: 'var(--navy)', fontWeight: 600, marginTop: '0.3rem' }}>Akole, Ahmednagar</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>Maharashtra, India</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <i className="fas fa-phone-alt" style={{ color: 'var(--gold)', fontSize: '1.2rem' }}></i>
              <p style={{ fontSize: '0.85rem', color: 'var(--navy)', fontWeight: 600, marginTop: '0.3rem' }}>+91 98819 45960</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>Mon–Sat, 8AM–5PM</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <i className="fas fa-envelope" style={{ color: 'var(--gold)', fontSize: '1.2rem' }}></i>
              <p style={{ fontSize: '0.85rem', color: 'var(--navy)', fontWeight: 600, marginTop: '0.3rem' }}>vasundhara.academy2016@gmail.com</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>Email us anytime</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
