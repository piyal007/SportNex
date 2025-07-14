import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Calendar, Camera } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const token = await user.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${user.uid}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.user);
      } else {
        toast.error('Failed to load profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <ClipLoader color="#10b981" size={50} />
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-hidden">
      {/* Page Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">View and manage your personal information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden max-w-full">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-8 lg:px-8 lg:py-12">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-white p-1 shadow-lg">
                {userProfile?.photoURL || user?.photoURL ? (
                  <img
                    src={userProfile?.photoURL || user?.photoURL}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="w-8 h-8 lg:w-12 lg:h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <button className="absolute bottom-0 right-0 bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full shadow-lg transition-colors cursor-pointer">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="text-center sm:text-left">
              <h2 className="text-2xl lg:text-3xl font-bold text-white">
                {userProfile?.name || user?.displayName || 'User'}
              </h2>
              <p className="text-emerald-100 mt-1 text-sm lg:text-base">
                {userProfile?.role || 'User'} Account
              </p>
              <div className="flex items-center justify-center sm:justify-start mt-2 text-emerald-100">
                <Mail className="w-4 h-4 mr-2" />
                <span className="text-sm lg:text-base">{userProfile?.email || user?.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6 lg:p-8 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-full overflow-hidden">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>

              <div className="space-y-3">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-900">
                      {userProfile?.name || user?.displayName || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium text-gray-900">
                      {userProfile?.email || user?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Registration Date</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(userProfile?.registrationDate || userProfile?.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>

              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Account Type</p>
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
                  <p className="text-sm text-gray-500">Account Status</p>
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
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-mono text-sm text-gray-900 break-words overflow-hidden">
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