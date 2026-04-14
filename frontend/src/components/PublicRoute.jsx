import { Navigate } from 'react-router-dom';
import useAuth from '../context/useAuth.js';

export default function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return children;

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}