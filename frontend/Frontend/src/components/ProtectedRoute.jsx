import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../context/useAuth.js';

// Wrap routes that require a logged in user. If auth state is still
// loading we render nothing (caller may choose to show a spinner). If
// the user is not present we redirect to /login and record the origin
// so the login page can send them back.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // could render a spinner or skeleton layout
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
