import { Navigate } from 'react-router-dom';
import useAuth from '../context/useAuth.js';

/**
 * Allows users with jogosultsag_szint > 0 (including admin 255).
 * Everyone else is redirected to /dashboard.
 */
export default function ModeratorRoute({ children }) {
  const { isModerator, loading } = useAuth();

  if (loading) return null;

  if (!isModerator) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
