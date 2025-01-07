import { Navigate, useLocation } from 'react-router-dom';
import { getUser, hasPermission, ROLES } from '@/utils/auth';

export const ProtectedRoute = ({ children, allowedRoles, redirectPath = '/login' }) => {
  const location = useLocation();
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasPermission(allowedRoles)) {
    if (user.role === ROLES.USER) {
      return <Navigate to="/" replace />;
    }
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export const UserRoute = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={[ROLES.USER,ROLES.ADMIN]} redirectPath="/">
      {children}
    </ProtectedRoute>
  );
};

export const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute 
      allowedRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]} 
      redirectPath="/dashboard"
    >
      {children}
    </ProtectedRoute>
  );
};

export const SuperAdminRoute = ({ children }) => {
  return (
    <ProtectedRoute 
      allowedRoles={[ROLES.SUPERADMIN]} 
      redirectPath="/dashboard"
    >
      {children}
    </ProtectedRoute>
  );
};