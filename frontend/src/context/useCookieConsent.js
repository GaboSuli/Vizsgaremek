import { useContext } from 'react';
import { CookieContext } from './CookieContext.jsx';

export default function useCookieConsent() {
  const ctx = useContext(CookieContext);
  if (!ctx) {
    throw new Error('useCookieConsent must be used within a CookieProvider');
  }
  return ctx;
}
