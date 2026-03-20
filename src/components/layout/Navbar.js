'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
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
            <img src="/images/logo.png" alt="Vasundhara Academy" className="nav-logo-img" />
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

          <DarkModeToggle />
          <Link href="/admissions/apply" className="nav-cta nav-cta-desktop">
            Apply Now
          </Link>

          <div
            className={`nav-toggle ${mobileOpen ? 'open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`nav-mobile-overlay ${mobileOpen ? 'open' : ''}`}>
        {navItems.map((item) => (
          <div key={item.label}>
            <Link
              href={item.href}
              className="nav-link"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          </div>
        ))}
        <Link
          href="/admissions/apply"
          className="nav-cta"
          onClick={() => setMobileOpen(false)}
        >
          Apply Now
        </Link>
      </div>
    </>
  );
}
