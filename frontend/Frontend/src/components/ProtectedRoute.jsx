import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../context/useAuth.js';

// Wrap routes that require a logged-in user.
// While the initial token verification is in flight we show the cached user's
// content optimistically (no blank flash). If they have no cached user we
// display a minimal spinner. Once loading finishes, any invalid token causes
// a redirect to /login.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // If we have a cached user from localStorage, show content immediately.
    // The verify effect will correct the state if the token is invalid.
    if (user) return children;
    // No cached user — show a lightweight spinner until verification finishes.
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
