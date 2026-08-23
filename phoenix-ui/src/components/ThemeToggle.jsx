'use client';

import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('phoenix_theme') || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
    if (saved === 'light') {
      document.documentElement.classList.add('theme-light');
    } else {
      document.documentElement.classList.remove('theme-light');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('phoenix_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.add('theme-light');
    } else {
      document.documentElement.classList.remove('theme-light');
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-white/5 hover:bg-white/15 border border-white/15 text-slate-200 hover:text-white transition-all flex items-center gap-1.5 shadow-sm"
      title="Toggle Light / Dark Mode"
    >
      <span>{theme === 'dark' ? '☀️ Bright Light Mode' : '🌙 Sleek Dark Mode'}</span>
    </button>
  );
}
