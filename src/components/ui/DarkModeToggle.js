'use client';
import { useState, useEffect } from 'react';

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      setDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggle}
      className="dark-mode-toggle"
      title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle dark mode"
    >
      <i className={dark ? 'fas fa-sun' : 'fas fa-moon'}></i>
    </button>
  );
}
