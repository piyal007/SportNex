import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';

// Generic role-based route component
const RoleBasedRoute = ({ children, allowedRoles = [], redirectTo = '/dashboard' }) => {
  const { user, userRole, loading, roleLoading } = useAuth();
  const location = useLocation();

  // Show loading while authentication or role is being determined
  if (loading || roleLoading) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-50">
        <ClipLoader size={40} color="#059669" />
        <p className="mt-4 text-lg text-gray-600 font-medium animate-pulse">
          {loading ? 'Authenticating...' : 'Loading user permissions...'}
        </p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Show toast notification for unauthorized access
    toast.error(`Access denied. ${allowedRoles.join(' or ')} role required.`);
    
    // Redirect based on user's current role
    const roleRedirects = {
      'admin': '/admin-dashboard',
      'member': '/member-dashboard',
      'user': '/dashboard'
    };
    
    const userRedirect = roleRedirects[userRole] || '/dashboard';
    return <Navigate to={userRedirect} replace />;
  }

  return children;
};

// Specific role-based route components
export const AdminRoute = ({ children }) => (
  <RoleBasedRoute allowedRoles={['admin']} redirectTo="/dashboard">
    {children}
  </RoleBasedRoute>
);

export const MemberRoute = ({ children }) => (
  <RoleBasedRoute allowedRoles={['member', 'admin']} redirectTo="/dashboard">
    {children}
  </RoleBasedRoute>
);

export const UserRoute = ({ children }) => (
  <RoleBasedRoute allowedRoles={['user', 'member', 'admin']} redirectTo="/login">
    {children}
  </RoleBasedRoute>
);

// Member or Admin route (for features that require membership)
export const MemberOrAdminRoute = ({ children }) => (
  <RoleBasedRoute allowedRoles={['member', 'admin']} redirectTo="/dashboard">
    {children}
  </RoleBasedRoute>
);

export default RoleBasedRoute;