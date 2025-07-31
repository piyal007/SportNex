import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Calendar, Camera, Award, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const Profile = () => {
  const { user } = useAuth();

  // Fetch user profile using TanStack Query
  const {
    data: userProfile,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['userProfile', user?.uid],
    queryFn: async () => {
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/${user.uid}`);

      if (!response.ok) {
        throw new Error('Failed to load profile');
      }

      const data = await response.json();
      return data.user;
    },
    enabled: !!user?.uid, // Only run query when user is available
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    onError: (error) => {
      console.error('Error fetching profile:', error);
      toast.error('Error loading profile');
    }
  });

  const handleRefresh = () => {
    refetch();
  };

  const formatDate = (dateInput) => {
    if (!dateInput) {
      return 'Not available';
    }
    
    try {
      let dateToFormat;
      
      // Handle different date formats
      if (typeof dateInput === 'object' && dateInput.$date) {
        // MongoDB date format with $date wrapper
        dateToFormat = new Date(dateInput.$date);
      } else if (typeof dateInput === 'string') {
        // ISO string format (most common from MongoDB Node.js driver)
        dateToFormat = new Date(dateInput);
      } else if (dateInput instanceof Date) {
        // Already a Date object
        dateToFormat = dateInput;
      } else if (typeof dateInput === 'object' && dateInput.toISOString) {
        // Date-like object
        dateToFormat = new Date(dateInput.toISOString());
      } else {
        return 'Not available';
      }
      
      // Check if date is valid
      if (isNaN(dateToFormat.getTime())) {
        return 'Not available';
      }
      
      const formatted = dateToFormat.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      return formatted;
    } catch (error) {
      return 'Not available';
    }
  };

  // Error state
  if (isError) {
    return (
      <div className="max-w-full overflow-hidden">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">View and manage your personal information</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Profile</h3>
              <p className="text-red-600 mb-4">{error?.message || 'Failed to load profile'}</p>
              <button
                onClick={handleRefresh}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-full overflow-hidden">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">View and manage your personal information</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8">
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-hidden">
      {/* Page Header */}
      <div className="mb-4 md:mb-6 lg:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">View and manage your personal information</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm md:text-base text-emerald-600 hover:text-emerald-700 cursor-pointer disabled:opacity-50 self-start md:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden max-w-full">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-12">
          <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full bg-white p-1 shadow-lg">
                {userProfile?.photoURL || user?.photoURL ? (
                  <img
                    src={userProfile?.photoURL || user?.photoURL}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="w-6 h-6 md:w-8 md:h-8 lg:w-12 lg:h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <button className="absolute bottom-0 right-0 bg-emerald-600 hover:bg-emerald-700 text-white p-1.5 md:p-2 rounded-full shadow-lg transition-colors cursor-pointer">
                <Camera className="w-3 h-3 md:w-4 md:h-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="text-center sm:text-left">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white capitalize">
                {userProfile?.name || user?.displayName || 'User'}
              </h2>
              <p className="text-emerald-100 mt-1 text-xs md:text-sm lg:text-base capitalize">
                {userProfile?.role || 'User'} Account
              </p>
              <div className="flex items-center justify-center sm:justify-start mt-2 text-emerald-100">
                <Mail className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                <span className="text-xs md:text-sm lg:text-base break-all">{userProfile?.email || user?.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-4 md:p-6 lg:p-8 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 max-w-full overflow-hidden">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Personal Information</h3>

              <div className="space-y-3">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <User className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs md:text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-900 capitalize text-sm md:text-base truncate">
                      {userProfile?.name || user?.displayName || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs md:text-sm text-gray-500">Email Address</p>
                    <p className="font-medium text-gray-900 text-sm md:text-base break-all">
                      {userProfile?.email || user?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs md:text-sm text-gray-500">Registration Date</p>
                    <p className="font-medium text-gray-900 text-sm md:text-base">
                      {userProfile?.registrationDate ? formatDate(userProfile.registrationDate) : 'Not available'}
                    </p>
                  </div>
                </div>

                {/* Show membership date only for members */}
                {userProfile?.role === 'member' && (
                  <div className="flex items-center p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <Award className="w-4 h-4 md:w-5 md:h-5 text-emerald-600 mr-3 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm text-emerald-700">Member Since</p>
                      <p className="font-medium text-emerald-900 text-sm md:text-base">
                        {userProfile?.memberSince ? formatDate(userProfile.memberSince) : 'Not available'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Account Information</h3>

              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-500">Account Type</p>
                  <div className="flex items-center mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${userProfile?.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : userProfile?.role === 'member'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                      {userProfile?.role?.charAt(0).toUpperCase() + userProfile?.role?.slice(1) || 'User'}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-500">Account Status</p>
                  <div className="flex items-center mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${userProfile?.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {userProfile?.status?.charAt(0).toUpperCase() + userProfile?.status?.slice(1) || 'Active'}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-500">User ID</p>
                  <p className="font-mono text-xs md:text-sm text-gray-900 break-all overflow-hidden">
                    {userProfile?.firebaseUid || user?.uid}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;