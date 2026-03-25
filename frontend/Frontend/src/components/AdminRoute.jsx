import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../context/useAuth.js';

/**
 * Only allows users with jogosultsag_szint === 255 (admin).
 * Everyone else is redirected to /dashboard.
 */
export default function AdminRoute({ children }) {
  const { isAdmin, loading } = useAuth();

  if (loading) return null;

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
