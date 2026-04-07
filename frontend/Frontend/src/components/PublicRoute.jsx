import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../context/useAuth.js';

// PublicRoute wraps pages only for unauthenticated visitors.
// While the initial token verification is running we still render the public
// content — if the user turns out to be authenticated the redirect fires
// immediately after loading completes, with no intermediate blank screen.
export default function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  // Still verifying the stored token: optimistically show the public page.
  // If the user IS authenticated the effect below will redirect them away.
  if (loading) return children;

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}