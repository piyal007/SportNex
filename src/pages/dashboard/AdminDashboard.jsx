import { useAuth } from '../../contexts/AuthContext';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { ScaleLoader } from 'react-spinners';
import { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Add a minimum loading time for better UX, but make it responsive to auth state
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, loading ? 2000 : 500); // Shorter delay if auth is already loaded

    return () => clearTimeout(timer);
  }, [loading]);

  if (loading || showLoader) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <ScaleLoader color="#10b981" height={50} width={6} radius={3} margin={3} />
          <p className="mt-6 text-xl text-gray-700 font-medium animate-pulse">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please log in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Header */}
      <DashboardHeader />

      {/* Main Content */}
      <main className="pt-20 lg:pt-24 lg:ml-64 p-4 lg:p-8 min-h-screen overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome, Administrator!</h2>
            <p className="text-gray-600">
              This is your admin dashboard. Admin-specific functionality will be implemented here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;