import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-6 sm:px-6">
          <h2 className="text-xl font-semibold text-white">My Profile</h2>
        </div>
        
        {/* Profile Content */}
        <div className="p-4 sm:p-6">
          {/* Profile Image and Basic Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
            <img
              src={user?.photoURL || 'https://i.postimg.cc/yxzXkbkL/avatar.jpg'}
              alt="Profile"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-gray-100 shadow-sm"
            />
            <div className="text-center sm:text-left flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                {user?.displayName || 'User'}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">{user?.email}</p>
            </div>
          </div>
          
          {/* Profile Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Full Name</p>
                <p className="text-gray-900">{user?.displayName || 'Not provided'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Email Address</p>
                <p className="text-gray-900">{user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Registration Date</p>
                <p className="text-gray-900">
                  {user?.metadata?.creationTime 
                    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'Not available'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;