import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../context/useAuth.js';

// PublicRoute is used for pages such as login/register/first page that
// should only be viewed by unauthenticated visitors. If a user is already
// logged in we send them to the dashboard (or whatever the main app page
// is). A loading state is handled similarly to ProtectedRoute.
export default function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}