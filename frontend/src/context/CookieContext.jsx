import React, { createContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'cookie_consent';

const defaultPreferences = {
  necessary: true,
  functional: false,
  analytics: false,
  optional: false,
};

export const CookieContext = createContext(null);

export function CookieProvider({ children }) {
  const [consent, setConsent] = useState(null); // null = not yet decided
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Load saved preferences on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.necessary === 'boolean') {
          setPreferences({ ...defaultPreferences, ...parsed });
          setConsent('saved');
          setShowBanner(false);
          return;
        }
      }
    } catch {
      // corrupted data — reset
      localStorage.removeItem(STORAGE_KEY);
    }
    // No valid saved consent → show banner
    setShowBanner(true);
  }, []);

  const savePreferences = useCallback((prefs) => {
    const merged = { ...defaultPreferences, ...prefs, necessary: true };
    setPreferences(merged);
    setConsent('saved');
    setShowBanner(false);
    setShowSettings(false);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch {
      // storage full — preferences still applied in memory
    }
  }, []);

  const acceptAll = useCallback(() => {
    savePreferences({
      necessary: true,
      functional: true,
      analytics: true,
      optional: true,
    });
  }, [savePreferences]);

  const acceptNecessaryOnly = useCallback(() => {
    savePreferences({
      necessary: true,
      functional: false,
      analytics: false,
      optional: false,
    });
  }, [savePreferences]);

  const openSettings = useCallback(() => {
    setShowSettings(true);
  }, []);

  const closeSettings = useCallback(() => {
    setShowSettings(false);
  }, []);

  const hasConsent = useCallback((category) => {
    return preferences[category] === true;
  }, [preferences]);

  return (
    <CookieContext.Provider
      value={{
        consent,
        preferences,
        showBanner,
        showSettings,
        acceptAll,
        acceptNecessaryOnly,
        savePreferences,
        openSettings,
        closeSettings,
        hasConsent,
      }}
    >
      {children}
    </CookieContext.Provider>
  );
}
