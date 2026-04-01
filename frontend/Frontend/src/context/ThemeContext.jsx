import React, { createContext, useState, useEffect } from 'react';

// ── Color palettes ───────────────────────────────────────────────────
const lightTheme = {
  background:     '#f1f5f9',
  surface:        '#ffffff',
  surfaceAlt:     '#f8fafc',
  primary:        '#6366f1',
  primaryDark:    '#4f46e5',
  primaryLight:   '#e0e7ff',
  secondary:      '#8b5cf6',
  text:           '#1e293b',
  textSecondary:  '#475569',
  textMuted:      '#94a3b8',
  border:         '#e2e8f0',
  borderStrong:   '#cbd5e1',
  danger:         '#ef4444',
  dangerDark:     '#dc2626',
  dangerLight:    '#fee2e2',
  success:        '#10b981',
  warning:        '#f59e0b',
  inputBg:        '#ffffff',
};

const darkTheme = {
  background:     '#0f172a',
  surface:        '#1e293b',
  surfaceAlt:     '#334155',
  primary:        '#818cf8',
  primaryDark:    '#6366f1',
  primaryLight:   'rgba(99,102,241,0.2)',
  secondary:      '#a78bfa',
  text:           '#e2e8f0',
  textSecondary:  '#cbd5e1',
  textMuted:      '#94a3b8',
  border:         '#334155',
  borderStrong:   '#475569',
  danger:         '#f87171',
  dangerDark:     '#ef4444',
  dangerLight:    'rgba(248,113,113,0.15)',
  success:        '#10b981',
  warning:        '#fbbf24',
  inputBg:        '#0f172a',
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try {
      const stored = localStorage.getItem('theme_mode');
      if (stored === 'dark' || stored === 'light') return stored;
    } catch { /* ignore */ }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const isDarkMode = mode === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;

  // Apply theme to DOM as data-theme attribute + CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    try {
      localStorage.setItem('theme_mode', mode);
    } catch { /* ignore */ }
  }, [isDarkMode, mode]);

  const toggleTheme = () => {
    setMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const value = {
    isDarkMode,
    mode,
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeContext };

