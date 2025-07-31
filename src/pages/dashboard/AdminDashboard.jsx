import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { ScaleLoader } from 'react-spinners';
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { RefreshCw } from 'lucide-react';

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const [showLoader, setShowLoader] = useState(true);
  const queryClient = useQueryClient();

  // TanStack Query for admin statistics
  const {
    data: statsData,
    isLoading: statsLoading,
    isError: statsError,
    error: statsErrorDetails,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      if (!user) throw new Error('No user found');
      
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
      
      if (!userStatsResponse.ok || !courtsResponse.ok) {
        throw new Error('Failed to fetch statistics');
      }
      
      const userStats = await userStatsResponse.json();
      const courtsData = await courtsResponse.json();
      
      return {
        totalUsers: userStats.totalUsers || 0,
        totalMembers: userStats.totalMembers || 0,
        totalCourts: courtsData.pagination?.total || courtsData.data?.length || 0
      };
    },
    enabled: !!user && !loading, // Only run when user is available and auth is loaded
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
    retry: 2,
    onError: (error) => {
      console.error('Error fetching admin statistics:', error);
      toast.error('Failed to load statistics');
    }
  });

  // Handle refresh functionality
  // const handleRefresh = () => {
  //   // Invalidate all admin-related queries
  //   queryClient.invalidateQueries({ queryKey: ['admin'] });
  //   queryClient.invalidateQueries({ queryKey: ['users'] });
  //   queryClient.invalidateQueries({ queryKey: ['courts'] });
  //   queryClient.invalidateQueries({ queryKey: ['bookings'] });
  //   queryClient.invalidateQueries({ queryKey: ['announcements'] });
  //   refetchStats();
  //   toast.success('Dashboard refreshed');
  // };

  useEffect(() => {
    // Add a minimum loading time for better UX, but make it responsive to auth state
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, loading ? 1500 : 300);

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-yellow-900 mb-2">Authentication Required</h2>
            <p className="text-yellow-700 mb-4">Please log in to access the dashboard.</p>
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium px-4 py-2 rounded-lg transition cursor-pointer"
            >
              Go to Login
            </button>
          </div>
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
        {/* Refresh Button - Mobile First */}
        {/* <div className="mb-4 flex justify-end">
          <button
            onClick={handleRefresh}
            disabled={statsLoading}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-3 py-2 md:px-4 md:py-2 rounded-lg shadow transition cursor-pointer text-sm md:text-base"
            title="Refresh Dashboard Data"
          >
            <RefreshCw className={`w-4 h-4 ${statsLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div> */}

        {/* Error State for Statistics */}
        {statsError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-red-700">
                  Failed to load dashboard statistics. {statsErrorDetails?.message || ''}
                </p>
              </div>
              <button
                onClick={refetchStats}
                className="flex-shrink-0 text-red-600 hover:text-red-800 transition cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Outlet for nested routes */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;