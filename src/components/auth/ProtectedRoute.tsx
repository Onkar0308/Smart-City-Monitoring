import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Set this to true during development to bypass authentication
const DEVELOPMENT_MODE = true;

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated && !DEVELOPMENT_MODE) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}