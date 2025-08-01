import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ScaleLoader } from 'react-spinners';
import { User, X, Search, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Swal from 'sweetalert2';

const ManageMembers = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // TanStack Query for fetching members
  const {
    data: membersData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const token = await user.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/members`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }
      
      const data = await response.json();
      return data.members || [];
    },
    enabled: !!user, // Only run when user is authenticated
    staleTime: 3 * 60 * 1000, // Data is fresh for 3 minutes
    retry: 2
  });

  // TanStack Mutation for deleting members
  const deleteMemberMutation = useMutation({
    mutationFn: async (memberId) => {
      const token = await user.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/members/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        // Parse the error response to get detailed error information
        let errorData;
        try {
          const responseText = await response.text();
          
          // Try to parse as JSON
          if (responseText) {
            errorData = JSON.parse(responseText);
          } else {
            errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
          }
                 } catch {
           // If response is not JSON, create error object with status info
           errorData = { 
             message: `Failed to delete member: ${response.status} ${response.statusText}`,
             status: response.status 
           };
         }
        
        // Create a detailed error object
        const error = new Error(errorData.message || 'Failed to delete member');
        error.status = response.status;
        error.details = errorData.details;
        error.activeBookings = errorData.activeBookings;
        error.errorData = errorData; // Keep full error data for debugging
        throw error;
      }
      
      const result = await response.json();
      return memberId;
      
    },
    onSuccess: (deletedMemberId) => {
      // Update the cache optimistically
      queryClient.setQueryData(['members'], (oldData) => {
        return oldData ? oldData.filter(member => member._id !== deletedMemberId) : [];
      });
    },
    onError: (error, variables) => {
      // Show SweetAlert2 with exact reason message
      let errorMessage = 'Failed to delete member';
      
      // Get the exact error message from the server response
      if (error.errorData && error.errorData.details && error.errorData.details.error) {
        // Use the detailed error message from the server
        errorMessage = error.errorData.details.error;
      } else if (error.errorData && error.errorData.error) {
        // Fallback to the main error message
        errorMessage = error.errorData.error;
      } else if (error.errorData && error.errorData.message) {
        // Another fallback
        errorMessage = error.errorData.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Format the message to be more user-friendly
      if (error.status === 400 && errorMessage.includes('Cannot delete member')) {
        // Extract member name and booking count from the detailed error
        const memberNameMatch = errorMessage.match(/Cannot delete member "([^"]+)"/);
        const memberName = memberNameMatch ? memberNameMatch[1] : 'this member';
        
        // Extract booking count and status
        const bookingMatch = errorMessage.match(/(\d+) active booking\(s\): (\d+) (\w+)/);
        if (bookingMatch) {
          const bookingCount = bookingMatch[1];
          const status = bookingMatch[3];
          errorMessage = `${memberName} can't delete because member have ${bookingCount} ${status} pending request${bookingCount === '1' ? '' : 's'}`;
        } else {
          // Fallback if pattern doesn't match
          errorMessage = `${memberName} can't delete because member have pending requests`;
        }
      }
      
      Swal.fire({
        title: 'Delete Failed',
        text: errorMessage,
        icon: 'error',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        showDenyButton: true,
        denyButtonText: 'Force Delete',
        denyButtonColor: '#dc2626',
        confirmButtonColor: '#10b981'
      }).then((result) => {
        if (result.isDenied) {
          // Handle force delete
          handleForceDelete(variables);
        }
        // If result.isDismissed or result.isCancelled, do nothing (user cancelled)
      });
    }
  });

  // TanStack Mutation for force deleting members
  const forceDeleteMemberMutation = useMutation({
    mutationFn: async (memberId) => {
      const token = await user.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/members/${memberId}/force`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        let errorData;
        try {
          const responseText = await response.text();
          if (responseText) {
            errorData = JSON.parse(responseText);
          } else {
            errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
          }
        } catch {
          errorData = { 
            message: `Failed to force delete member: ${response.status} ${response.statusText}`,
            status: response.status 
          };
        }
        
        const error = new Error(errorData.message || 'Failed to force delete member');
        error.status = response.status;
        error.errorData = errorData;
        throw error;
      }
      
      const result = await response.json();
      return memberId;
    },
    onSuccess: (deletedMemberId) => {
      // Update the cache optimistically
      queryClient.setQueryData(['members'], (oldData) => {
        return oldData ? oldData.filter(member => member._id !== deletedMemberId) : [];
      });
      
      Swal.fire({
        title: 'Success!',
        text: 'Member has been force deleted successfully',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#10b981'
      });
    },
    onError: (error) => {
      Swal.fire({
        title: 'Force Delete Failed',
        text: error.message || 'Failed to force delete member',
        icon: 'error',
        confirmButtonColor: '#10b981'
      });
    }
  });

          const handleDelete = async (memberId) => {
      // Simple confirmation - just proceed with deletion
      deleteMemberMutation.mutate(memberId);
    };

    const handleForceDelete = async (memberId) => {
      // Show confirmation for force delete
      const result = await Swal.fire({
        title: 'Force Delete Confirmation',
        text: 'This will delete the member and all their associated data. This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Force Delete',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280'
      });

      if (result.isConfirmed) {
        forceDeleteMemberMutation.mutate(memberId);
      }
    };

  // Filter members based on search term
  const members = membersData || [];
  const filteredMembers = members.filter(member =>
    member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-2 sm:p-4 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-emerald-700">
          <User className="w-6 h-6" /> Manage Members
        </h2>
        
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

      {/* Search Input */}
      <div className="mb-6">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search member by name or email..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          {isFetching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <ScaleLoader color="#10b981" height={15} width={2} />
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="text-center">
            <ScaleLoader color="#10b981" />
            <p className="mt-4 text-gray-500">Loading members...</p>
          </div>
        </div>
      ) : isError ? (
        /* Error State */
        <div className="flex flex-col items-center justify-center h-40 text-center">
          <div className="text-red-500 mb-4">
            <User className="w-12 h-12 mx-auto mb-2" />
            <p className="text-lg font-medium">Failed to load members</p>
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
      ) : filteredMembers.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12">
          <User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-xl font-medium text-gray-500 mb-2">
            {searchTerm ? 'No members found' : 'No members yet'}
          </p>
          {searchTerm ? (
            <p className="text-gray-400">
              Try adjusting your search term
            </p>
          ) : (
            <p className="text-gray-400">
              Members will appear here once they join
            </p>
          )}
        </div>
      ) : (
        /* Members Table */
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
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
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredMembers.map(member => (
                <tr key={member._id} className="hover:bg-emerald-50 transition">
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                    {member.name || 'N/A'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                    {member.email || 'N/A'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-600 capitalize">
                      {member.role || 'member'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md cursor-pointer flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
                      onClick={() => handleDelete(member._id)}
                      disabled={deleteMemberMutation.isLoading && deleteMemberMutation.variables === member._id}
                    >
                      {deleteMemberMutation.isLoading && deleteMemberMutation.variables === member._id ? (
                        <ScaleLoader color="#ffffff" height={12} width={2} />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Results Summary */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {filteredMembers.length} of {members.length} member{members.length !== 1 ? 's' : ''}
              {searchTerm && (
                <span> matching "{searchTerm}"</span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMembers;