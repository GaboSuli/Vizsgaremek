import React from 'react';
import { isAuthenticated } from '../services/authService.js';

export default function ProtectedRoute({ children }) {
  const authed = isAuthenticated();
  if (!authed) {
    window.location.href = '/';
    return null;
  }
  return children;
}
