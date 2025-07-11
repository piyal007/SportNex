import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ClipLoader } from 'react-spinners';

/**
 * Component that redirects users to their appropriate dashboard based on role
 * Used after login or when accessing root dashboard routes
 */
const RoleBasedRedirect = () => {
  const { user, userRole, loading, roleLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect if still loading
    if (loading || roleLoading) return;

    // Redirect to login if not authenticated
    if (!user) {
      navigate('/login', { state: { from: location }, replace: true });
      return;
    }

    // Redirect based on user role
    if (userRole) {
      const roleRedirects = {
        'admin': '/admin-dashboard',
        'member': '/member-dashboard',
        'user': '/dashboard'
      };

      const redirectPath = roleRedirects[userRole] || '/dashboard';
      
      // Get the intended destination from location state (after login redirect)
      const from = location.state?.from?.pathname;
      
      // If user was trying to access a specific page, redirect there if they have permission
      if (from && from !== location.pathname) {
        // Check if the intended destination matches user's role
        if (
          (userRole === 'admin' && from.startsWith('/admin-dashboard')) ||
          (userRole === 'member' && (from.startsWith('/member-dashboard') || from.startsWith('/admin-dashboard'))) ||
          (userRole === 'user' && from.startsWith('/dashboard'))
        ) {
          navigate(from, { replace: true });
          return;
        }
      }
      
      // Default redirect to role-appropriate dashboard
      navigate(redirectPath, { replace: true });
    }
  }, [user, userRole, loading, roleLoading, navigate, location]);

  // Show loading while determining redirect
  if (loading || roleLoading) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-50">
        <ClipLoader size={40} color="#059669" />
        <p className="mt-4 text-lg text-gray-600 font-medium animate-pulse">
          Redirecting to your dashboard...
        </p>
      </div>
    );
  }

  // This component doesn't render anything visible - it just handles redirects
  return null;
};

export default RoleBasedRedirect;