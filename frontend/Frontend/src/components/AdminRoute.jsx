import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../context/useAuth.js';

/**
 * Only allows users with jogosultsag_szint >= 255 (admin).
 * Everyone else is redirected to /dashboard.
 */
export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  const isAdmin = user && (user.jogosultsag_szint >= 255 || user.Jogosultsag_szint >= 255);

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
