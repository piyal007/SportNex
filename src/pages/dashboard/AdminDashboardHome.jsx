import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { ScaleLoader } from 'react-spinners';

const AdminDashboardHome = () => {
  const { user } = useAuth();
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
    if (user) {
      fetchAdminStats();
    }
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      
      {/* Admin Profile Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Admin Profile</h2>
        
        {/* Profile Info */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <img
              className="h-20 w-20 md:h-24 md:w-24 rounded-full object-cover border-4 border-emerald-100"
              src={user?.photoURL || 'https://i.pravatar.cc/150?img=12'}
              alt={user?.displayName || 'Admin'}
            />
          </div>
          
          {/* Basic Info */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {user?.displayName || 'Administrator'}
            </h3>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Email:</span> {user?.email || 'admin@sportnex.com'}
            </p>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              Administrator
            </div>
          </div>
        </div>
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Courts */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium mb-1">Total Courts</p>
                <p className="text-3xl font-bold text-blue-900 min-h-[2.25rem] flex items-center">
                  {stats.loading ? (
                    <ScaleLoader color="#1e40af" height={20} width={3} radius={2} margin={2} />
                  ) : (
                    stats.totalCourts
                  )}
                </p>
              </div>
              <div className="bg-blue-500 rounded-full p-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Total Users */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium mb-1">Total Users</p>
                <p className="text-3xl font-bold text-green-900 min-h-[2.25rem] flex items-center">
                  {stats.loading ? (
                    <ScaleLoader color="#166534" height={20} width={3} radius={2} margin={2} />
                  ) : (
                    stats.totalUsers
                  )}
                </p>
              </div>
              <div className="bg-green-500 rounded-full p-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-2.239" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Total Members */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium mb-1">Total Members</p>
                <p className="text-3xl font-bold text-purple-900 min-h-[2.25rem] flex items-center">
                  {stats.loading ? (
                    <ScaleLoader color="#581c87" height={20} width={3} radius={2} margin={2} />
                  ) : (
                    stats.totalMembers
                  )}
                </p>
              </div>
              <div className="bg-purple-500 rounded-full p-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional Admin Content */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">System Overview</h2>
        <p className="text-gray-600">
          Welcome to the SportNex Admin Dashboard. Here you can monitor and manage the entire platform.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboardHome;