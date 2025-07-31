import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ScaleLoader } from 'react-spinners';
import { User, Search, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { userAPI } from '@/utils/api';

const AllUsers = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // TanStack Query for fetching users with search
  const {
    data: usersData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['users', 'all', searchTerm], // Include searchTerm in query key for automatic refetch
    queryFn: async () => {
      const response = await userAPI.getAllUsers({ search: searchTerm });
      return response.data;
    },
    enabled: !!user, // Only run when user is authenticated
    staleTime: 2 * 60 * 1000, // Data is fresh for 2 minutes
    retry: 2,
    onError: (error) => {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    }
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Extract users array from response
  const users = usersData?.users || usersData?.members || usersData || [];

  return (
    <div className="p-2 sm:p-4 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-extrabold flex items-center gap-2 text-emerald-700">
          <User className="w-7 h-7" /> All Users
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none shadow-sm transition placeholder-gray-400"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            {isFetching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <ScaleLoader color="#10b981" height={15} width={2} />
              </div>
            )}
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${(isLoading || isFetching) ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="text-center">
            <ScaleLoader color="#10b981" />
            <p className="mt-4 text-gray-500">Loading users...</p>
          </div>
        </div>
      ) : isError ? (
        /* Error State */
        <div className="flex flex-col items-center justify-center h-40 text-center">
          <div className="text-red-500 mb-4">
            <User className="w-12 h-12 mx-auto mb-2" />
            <p className="text-lg font-medium">Failed to load users</p>
            <p className="text-sm text-gray-500 mt-1">
              {error?.message || 'Something went wrong'}
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : (
        /* Users Table */
        <div className="overflow-x-auto rounded-lg shadow border border-gray-100 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-emerald-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8">
                    <div className="text-gray-400">
                      <User className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-lg">No users found</p>
                      {searchTerm && (
                        <p className="text-sm mt-1">
                          Try adjusting your search term
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-emerald-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {u.name || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {u.email || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          u.role === 'admin'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {u.role || 'user'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString()
                        : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          {/* Results Summary */}
          {users.length > 0 && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {users.length} user{users.length !== 1 ? 's' : ''}
                {searchTerm && (
                  <span> matching "{searchTerm}"</span>
                )}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllUsers;