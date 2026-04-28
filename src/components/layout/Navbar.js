'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '@/styles/navbar.css';

const navItems = [
  { label: 'Home', href: '/' },
  {
    label: 'About', href: '/about',
    children: [
      { label: 'Welcome', href: '/about' },
      { label: 'Mission & Vision', href: '/about/mission-vision' },
      { label: "President's Message", href: '/about/president-message' },
      { label: "Principal's Message", href: '/about/principal-message' },
      { label: 'Board of Directors', href: '/about/board-of-directors' },
      { label: 'General Information', href: '/about/general-info' },
      { label: 'Awards', href: '/about/awards' },
    ],
  },
  {
    label: 'Academics', href: '/academics',
    children: [
      { label: 'Curriculum', href: '/academics/curriculum' },
      { label: 'Academic Programs', href: '/academics/programs' },
      { label: 'Our Staff', href: '/academics/staff' },
      { label: 'Academic Calendar', href: '/academics/calendar' },
      { label: 'Policies & Rules', href: '/academics/policies' },
      { label: 'Teacher Training', href: '/academics/teacher-training' },
    ],
  },
  {
    label: 'Admissions', href: '/admissions',
    children: [
      { label: 'Admission Process', href: '/admissions/process' },
      { label: 'Fee Structure', href: '/admissions/fee-structure' },
      { label: 'Apply Online', href: '/admissions/apply' },
      { label: 'Track Application', href: '/admissions/track' },
    ],
  },
  {
    label: 'Campus Life', href: '#',
    children: [
      { label: 'Facilities', href: '/facilities' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Events', href: '/events' },
      { label: 'Stories & Achievements', href: '/stories' },
      { label: 'Student Section', href: '/student-section' },
      { label: 'Staff Details', href: '/staff-details' },
      { label: 'Public Disclosures', href: '/disclosures' },
      { label: 'Comprehensive Info', href: '/comprehensive-info' },
      { label: 'Alumni', href: '/alumni' },
    ],
  },
  { label: 'Why Vasundhara', href: '/why-vasundhara' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState({});

  const toggleMobileSub = (label) => {
    setMobileExpanded(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : 'transparent'}`}>
        <div className="navbar-inner">
          <Link href="/" className="nav-logo">
            <img src="/images/logo.png" alt="Vasundhara Academy" width="45" height="45" className="nav-logo-img" />
            <div className="nav-logo-text">
              <span className="nav-logo-name">Vasundhara Academy</span>
              <span className="nav-logo-sub">CBSE • Akole</span>
            </div>
          </Link>

          <div className="nav-links">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label} className="nav-dropdown">
                  <Link href={item.href} className="nav-link nav-dropdown-trigger">
                    {item.label} <i className="fas fa-chevron-down"></i>
                  </Link>
                  <div className="nav-dropdown-menu">
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href} className="nav-dropdown-item">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={item.href} href={item.href} className="nav-link">
                  {item.label}
                </Link>
              )
            )}
          </div>

          <Link href="/admissions/apply" className="nav-cta nav-cta-desktop">
            Apply Now
          </Link>

          <button
            className={`nav-toggle ${mobileOpen ? 'open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`nav-mobile-overlay ${mobileOpen ? 'open' : ''}`}>
        <div className="nav-mobile-header">
          <Link href="/" className="nav-logo" onClick={() => setMobileOpen(false)}>
            <img src="/images/logo.png" alt="Logo" width="40" height="40" className="nav-logo-img" />
            <div className="nav-logo-text">
              <span className="nav-logo-name">Vasundhara Academy</span>
              <span className="nav-logo-sub">CBSE • Akole</span>
            </div>
          </Link>
          <button 
            className="nav-mobile-close" 
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="nav-mobile-title-bar">
          <span>MENU</span>
        </div>

        <div className="nav-mobile-scroll">
          {navItems.map((item) => (
            <div key={item.label} className={`nav-mobile-item ${mobileExpanded[item.label] ? 'expanded' : ''}`}>
              <div className="nav-mobile-link-wrapper">
                <Link
                  href={item.href}
                  className="nav-mobile-link"
                  onClick={() => !item.children && setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <button 
                    className="nav-mobile-expand-toggle"
                    onClick={() => toggleMobileSub(item.label)}
                    aria-label={`Toggle ${item.label} sub-menu`}
                    aria-expanded={mobileExpanded[item.label]}
                  >
                    <i className={`fas fa-chevron-right`}></i>
                  </button>
                )}
              </div>
              
              {item.children && (
                <div className="nav-mobile-sub">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="nav-mobile-sub-link"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          <div className="nav-mobile-actions">
            <Link href="/admissions/apply" className="nav-cta" onClick={() => setMobileOpen(false)}>
              Apply Now
            </Link>
          </div>
        </div>

        <div className="nav-mobile-footer">
          <div className="nav-mobile-socials">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="Youtube"><i className="fab fa-youtube"></i></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
          </div>
          <p className="nav-mobile-copy">© 2026 Vasundhara Academy</p>
        </div>
      </div>
    </>
  );
}
