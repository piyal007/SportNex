import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { ScaleLoader } from 'react-spinners';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const [showLoader, setShowLoader] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMembers: 0,
    totalCourts: 0,
    loading: true
  });

  // Fetch admin statistics
  const fetchAdminStats = async () => {
    try {
      if (!user) return;
      
      const token = await user.getIdToken();
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      
      // Fetch user statistics
      const userStatsResponse = await fetch(`${API_BASE_URL}/api/users/stats/overview`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Fetch courts data to count total courts
      const courtsResponse = await fetch(`${API_BASE_URL}/api/courts`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (userStatsResponse.ok && courtsResponse.ok) {
        const userStats = await userStatsResponse.json();
        const courtsData = await courtsResponse.json();
        
        setStats({
          totalUsers: userStats.totalUsers || 0,
          totalMembers: userStats.totalMembers || 0,
          totalCourts: courtsData.pagination?.total || courtsData.data?.length || 0,
          loading: false
        });
      } else {
        throw new Error('Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Error fetching admin statistics:', error);
      toast.error('Failed to load statistics');
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    // Add a minimum loading time for better UX, but make it responsive to auth state
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, loading ? 2000 : 500); // Shorter delay if auth is already loaded

    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    if (user && !loading) {
      fetchAdminStats();
    }
  }, [user, loading]);

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
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;