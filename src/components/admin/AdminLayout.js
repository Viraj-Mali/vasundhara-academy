'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import '@/styles/admin.css';

const sidebarItems = [
  { label: 'Overview', items: [
    { label: 'Dashboard', href: '/admin/dashboard', icon: 'fas fa-tachometer-alt' },
    { label: 'Activity Log', href: '/admin/activity', icon: 'fas fa-history' },
  ]},
  { label: 'Content', items: [
    { label: 'Notifications', href: '/admin/notifications', icon: 'fas fa-bell', badgeKey: 'notifications' },
    { label: 'Notice Board', href: '/admin/notices', icon: 'fas fa-bullhorn' },
    { label: 'Blog & News', href: '/admin/blog', icon: 'fas fa-newspaper' },
    { label: 'Events', href: '/admin/events', icon: 'fas fa-calendar-alt', badgeKey: 'events' },
    { label: 'Messages', href: '/admin/messages', icon: 'fas fa-envelope' },
    { label: 'Gallery', href: '/admin/gallery', icon: 'fas fa-images', badgeKey: 'gallery' },
  ]},
  { label: 'People', items: [
    { label: 'Board Members', href: '/admin/board', icon: 'fas fa-users' },
    { label: 'Staff', href: '/admin/staff', icon: 'fas fa-chalkboard-teacher', badgeKey: 'staff' },
    { label: 'Committees', href: '/admin/committees', icon: 'fas fa-people-arrows' },
  ]},
  { label: 'Forms', items: [
    { label: 'Admissions', href: '/admin/admissions', icon: 'fas fa-file-alt', badgeKey: 'admissions', badgeType: 'urgent' },
    { label: 'Enquiries', href: '/admin/enquiries', icon: 'fas fa-question-circle', badgeKey: 'enquiries', badgeType: 'urgent' },
    { label: 'Contact Messages', href: '/admin/contacts', icon: 'fas fa-address-book' },
    { label: 'Alumni', href: '/admin/alumni', icon: 'fas fa-graduation-cap' },
  ]},
  { label: 'Documents', items: [
    { label: 'Public Disclosures', href: '/admin/documents', icon: 'fas fa-file-contract' },
  ]},
];

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [badges, setBadges] = useState({});

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  // Fetch badge counts
  useEffect(() => {
    fetch('/api/admin/badges')
      .then(r => r.json())
      .then(data => setBadges(data))
      .catch(() => {});
    // Refresh badges every 30 seconds
    const interval = setInterval(() => {
      fetch('/api/admin/badges').then(r => r.json()).then(data => setBadges(data)).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);


  if (status === 'loading') {
    return (
      <div className="admin-login-page">
        <div style={{ color: 'var(--gold)', fontSize: '1.2rem' }}>
          <i className="fas fa-spinner fa-spin"></i> Loading...
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="admin-layout">
      {/* Mobile hamburger button */}
      <button className="admin-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
        <i className={`fas fa-${mobileOpen ? 'times' : 'bars'}`}></i>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && <div className="admin-mobile-overlay" onClick={() => setMobileOpen(false)} />}

      <aside className={`admin-sidebar ${mobileOpen ? 'admin-sidebar-open' : ''}`}>
        <div className="admin-sidebar-header">
          <img src="/images/logo.png" alt="Logo" />
          <div>
            <h3>Admin Panel</h3>
            <p>Vasundhara Academy</p>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          {sidebarItems.map((group) => (
            <div key={group.label}>
              <div className="admin-nav-label">{group.label}</div>
              {group.items.map((item) => {
                const badgeCount = item.badgeKey ? badges[item.badgeKey] : 0;
                const isUrgent = item.badgeType === 'urgent';
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`admin-nav-item ${pathname === item.href ? 'active' : ''}`}
                  >
                    <i className={item.icon}></i>
                    {item.label}
                    {badgeCount > 0 && (
                      <span className={`nav-badge ${isUrgent ? 'nav-badge-urgent' : ''}`}>
                        {badgeCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
            <i className="fas fa-user" style={{ marginRight: '0.3rem' }}></i> {session.user?.name || session.user?.email}
          </div>
          <button onClick={() => signOut({ callbackUrl: '/admin/login' })} className="admin-logout-btn">
            <i className="fas fa-sign-out-alt"></i> Sign Out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
