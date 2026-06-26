'use client';
import { useState, useEffect } from 'react';
import '@/styles/about.css';
import '@/styles/notifications.css';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/notifications')
      .then(r => r.json())
      .then(data => {
        setNotifications(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'urgent': return 'fa-exclamation-triangle';
      case 'news': return 'fa-newspaper';
      default: return 'fa-bullhorn';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'urgent': return 'Urgent';
      case 'news': return 'News';
      default: return 'Announcement';
    }
  };

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-hero-title">Notifications</h1>
          <p className="page-hero-desc">
            Stay updated with the latest announcements, news, and important notices from Vasundhara Academy.
          </p>
        </div>
      </section>

      <section className="notifications-section">
        <div className="notifications-inner">

          {loading ? (
            <div className="notif-loading">
              <div className="notif-loading-spinner"></div>
              <p>Loading notifications…</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="notif-empty">
              <div className="notif-empty-icon">
                <i className="fas fa-bell-slash"></i>
              </div>
              <h3>No Notifications</h3>
              <p>There are no active notifications at the moment. Please check back later.</p>
            </div>
          ) : (
            <>
              <div className="notifications-stats">
                <div className="notif-stat-chip">
                  <i className="fas fa-bell"></i>
                  <strong>{notifications.length}</strong> Active Notification{notifications.length !== 1 ? 's' : ''}
                </div>
              </div>

              {notifications.map((n) => (
                <div key={n.id} className={`notif-card ${n.type || 'announcement'}`}>
                  <div className="notif-card-header">
                    <h2 className="notif-card-title">{n.title}</h2>
                    <div className="notif-card-meta">
                      <span className={`notif-type-badge ${n.type || 'announcement'}`}>
                        <i className={`fas ${getTypeIcon(n.type)}`}></i>
                        {getTypeLabel(n.type)}
                      </span>
                      {n.startDate && (
                        <span className="notif-card-date">
                          <i className="far fa-calendar-alt"></i>
                          {formatDate(n.startDate)}
                        </span>
                      )}
                    </div>
                  </div>
                  {n.content && (
                    <div className="notif-card-content">
                      <p>{n.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </>
  );
}
