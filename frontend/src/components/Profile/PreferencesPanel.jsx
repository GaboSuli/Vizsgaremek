import React, { useState, useEffect, useRef } from 'react';
import useAuth from '../../context/useAuth.js';
import * as authService from '../../services/authService.js';
import useTheme from '../../context/useTheme.js';
import ToggleSwitch from '../ui/ToggleSwitch.jsx';
import './PreferencesPanel.css';

export default function PreferencesPanel() {
  const auth = useAuth();
  const themeCtx = useTheme();
  const isDarkMode = themeCtx?.isDarkMode ?? false;

  const [error, setError] = useState('');
  const savedRef = useRef(isDarkMode);

  useEffect(() => {
    if (savedRef.current === isDarkMode) return;
    savedRef.current = isDarkMode;
    const newTemaId = isDarkMode ? 2 : 1;
    authService.updateUser({ tema_id: newTemaId })
      .then(async (resp) => {
        if (resp.success) await auth.refreshUser();
      })
      .catch(() => {
        setError('Nem sikerült menteni a beállítást.');
      });
  }, [isDarkMode]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="pref-panel">
      <div className="pref-panel__header">
        <h3 className="pref-panel__title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          Beállítások
        </h3>
      </div>
      <div className="pref-panel__body">
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="pref-panel__item">
          <div className="pref-panel__item-info">
            <span className="pref-panel__item-icon">
              {isDarkMode ? '🌙' : '☀️'}
            </span>
            <div>
              <p className="pref-panel__item-title">
                {isDarkMode ? 'Sötét mód' : 'Világos mód'}
              </p>
              <p className="pref-panel__item-desc">
                {isDarkMode
                  ? 'Sötét háttér, kíméletes az éjszakai használathoz'
                  : 'Világos háttér, könnyű olvasás nappal'}
              </p>
            </div>
          </div>
          <ToggleSwitch showLabel={false} size="md" />
        </div>
      </div>
    </div>
  );
}
