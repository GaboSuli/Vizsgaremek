import React from 'react';
import useTheme from '../../context/useTheme.js';
import './ToggleSwitch.css';

/**
 * Dark / Light mode toggle switch.
 *
 * Props:
 *   showLabel {boolean}  – show "Sötét mód" text next to the switch (default true)
 *   size      {'sm'|'md'} – size variant (default 'md')
 */
export default function ToggleSwitch({ showLabel = true, size = 'md' }) {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className={`toggle-switch toggle-switch--${size} ${isDarkMode ? 'toggle-switch--on' : ''}`}
      onClick={toggleTheme}
      aria-label={isDarkMode ? 'Váltás világos módra' : 'Váltás sötét módra'}
      aria-pressed={isDarkMode}
      title={isDarkMode ? 'Világos mód' : 'Sötét mód'}
    >
      <span className="toggle-switch__track">
        <span className="toggle-switch__thumb">
          <span className="toggle-switch__icon" aria-hidden="true">
            {isDarkMode ? '🌙' : '☀️'}
          </span>
        </span>
      </span>
      {showLabel && (
        <span className="toggle-switch__label">
          {isDarkMode ? 'Sötét mód' : 'Világos mód'}
        </span>
      )}
    </button>
  );
}
