'use client';

import { useState, useEffect } from 'react';
import '@/styles/navbar.css';

export default function NotificationBanner() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch('/api/public/notifications')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setNotifications(data);
        } else {
          // Fallback default notifications
          setNotifications([
            { id: 1, title: 'Admissions Open for 2026-27' },
            { id: 2, title: 'Expert Abacus State Level Winners' },
            { id: 3, title: 'SOF Olympiad Achievers' },
          ]);
        }
      })
      .catch(() => {
        setNotifications([
          { id: 1, title: 'Admissions Open for 2026-27' },
          { id: 2, title: 'Expert Abacus State Level Winners' },
          { id: 3, title: 'SOF Olympiad Achievers' },
        ]);
      });
  }, []);

  const icons = ['fa-bullhorn', 'fa-trophy', 'fa-medal', 'fa-calendar', 'fa-star'];

  return (
    <div className="notification-banner">
      <div className="notification-track" key={notifications.length}>
        <div className="notification-content">
          {notifications.map((n, i) => (
            <span key={n.id}>
              <i className={`fas ${icons[i % icons.length]}`}></i> {n.title}
              <span className="notification-dot">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
