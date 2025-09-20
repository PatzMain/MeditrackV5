import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = []
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-medical-blue">
        <div className="animate-pulse">
          <div className="text-medical-darkblue text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('ProtectedRoute check:', {
    user,
    requiredRole,
    userRole: user?.role,
    hasRequiredRole: requiredRole.length === 0 || (user && requiredRole.includes(user.role))
  });

  if (requiredRole.length > 0 && user && !requiredRole.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-medical-blue">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-medical-darkblue mb-4">
            Access Denied
          </h2>
          <p className="text-medical-darkgray mb-4">
            You don't have permission to access this page.
          </p>
          <div className="text-sm text-gray-600 bg-white p-4 rounded">
            <p>Your role: {user.role}</p>
            <p>Required roles: {requiredRole.join(', ')}</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;