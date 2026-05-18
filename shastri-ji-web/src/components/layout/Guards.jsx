import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store';

export function getRoleDashboard(role) {
  if (role === 'PRIEST') return '/priest/dashboard';
  if (role === 'ADMIN') return '/admin';
  return '/home';
}

function FullPageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-bg">
      <div className="flex flex-col items-center gap-4">
        <img
          src="/logo.png"
          alt="Shastri Ji"
          className="w-16 h-16 rounded-full object-cover"
        />
        <p className="font-body text-text-light text-sm tracking-wide">
          Loading...
        </p>
      </div>
    </div>
  );
}

export function RequireAuth({ children }) {
  const { isLoading, isLoggedIn } = useAuthStore();
  const location = useLocation();

  if (isLoading) return <FullPageSpinner />;
  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

export function RequireRole({ role, children }) {
  const { isLoading, isLoggedIn, role: userRole } = useAuthStore();
  const location = useLocation();

  if (isLoading) return <FullPageSpinner />;
  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (userRole !== role) {
    return <Navigate to={getRoleDashboard(userRole)} replace />;
  }
  return children;
}

export function RedirectIfAuth({ children }) {
  const { isLoading, isLoggedIn, role } = useAuthStore();
  if (isLoading) return <FullPageSpinner />;
  if (isLoggedIn) {
    return <Navigate to={getRoleDashboard(role)} replace />;
  }
  return children;
}
