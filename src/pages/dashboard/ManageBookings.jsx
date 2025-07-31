import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { ScaleLoader } from 'react-spinners';
import { Calendar, Clock, DollarSign, User, Check, X, Search, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageBookings = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [confirmedSearch, setConfirmedSearch] = useState('');
  const queryClient = useQueryClient();

  // TanStack Query for checking user role
  const {
    data: userRole,
    isLoading: roleLoading,
    isError: roleError
  } = useQuery({
    queryKey: ['user', 'role'],
    queryFn: async () => {
      const token = await user.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/role`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to verify admin access');
      }

      const data = await response.json();
      if (data.role !== 'admin') {
        throw new Error('Admin access required');
      }

      return data.role;
    },
    enabled: !!user,
    retry: 1,
    onError: (error) => {
      console.error('Error checking user role:', error);
      toast.error(error.message || 'Failed to verify admin access');
    }
  });

  // TanStack Query for fetching all bookings
  const {
    data: bookingsData,
    isLoading: bookingsLoading,
    isError: bookingsError,
    error: bookingsErrorDetails,
    refetch: refetchBookings,
    isFetching: bookingsFetching
  } = useQuery({
    queryKey: ['bookings', 'all'],
    queryFn: async () => {
      const token = await user.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to load bookings');
      }

      const data = await response.json();
      return data.bookings || [];
    },
    enabled: !!user && userRole === 'admin', // Only fetch if user is admin
    staleTime: 2 * 60 * 1000, // Data is fresh for 2 minutes
    retry: 2,
    onError: (error) => {
      console.error('Error fetching bookings:', error);
      toast.error(error.message || 'Error loading bookings');
    }
  });

  // TanStack Mutation for approving bookings
  const approveBookingMutation = useMutation({
    mutationFn: async (bookingId) => {
      const token = await user.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/bookings/${bookingId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to approve booking');
      }

      return bookingId;
    },
    onSuccess: (bookingId) => {
      // Update the cache optimistically
      queryClient.setQueryData(['bookings', 'all'], (oldData) => {
        return oldData ? oldData.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'approved' }
            : booking
        ) : [];
      });
      
      toast.success('Booking approved successfully');
    },
    onError: (error) => {
      console.error('Error approving booking:', error);
      toast.error(error.message || 'Error approving booking');
    }
  });

  // TanStack Mutation for rejecting bookings
  const rejectBookingMutation = useMutation({
    mutationFn: async (bookingId) => {
      const token = await user.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/bookings/${bookingId}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reject booking');
      }

      return bookingId;
    },
    onSuccess: (bookingId) => {
      // Remove the rejected booking from the cache
      queryClient.setQueryData(['bookings', 'all'], (oldData) => {
        return oldData ? oldData.filter(booking => booking._id !== bookingId) : [];
      });
      
      toast.success('Booking rejected successfully');
    },
    onError: (error) => {
      console.error('Error rejecting booking:', error);
      toast.error(error.message || 'Error rejecting booking');
    }
  });

  const handleApproveBooking = (bookingId) => {
    if (!bookingId) return;
    approveBookingMutation.mutate(bookingId);
  };

  const handleRejectBooking = (bookingId) => {
    if (!bookingId) return;
    rejectBookingMutation.mutate(bookingId);
  };

  // Extract bookings array
  const bookings = bookingsData || [];

  // Filter bookings based on search term and status
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.courtName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter confirmed bookings for separate table
  const confirmedBookings = bookings.filter(
    booking => booking.status === "confirmed" && (
      booking.courtName?.toLowerCase().includes(confirmedSearch.toLowerCase()) ||
      booking.userName?.toLowerCase().includes(confirmedSearch.toLowerCase())
    )
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatSlots = (slots) => {
    if (!slots || slots.length === 0) return 'No slots';
    return slots.join(', ');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Confirmed' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // Loading state for role check
  if (roleLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <ScaleLoader color="#10b981" />
          <p className="mt-4 text-gray-500">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Error state for role check
  if (roleError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="text-red-500 mb-4">
          <User className="w-12 h-12 mx-auto mb-2" />
          <p className="text-lg font-medium">Access Denied</p>
          <p className="text-sm text-gray-500 mt-1">
            Admin access required to view this page
          </p>
        </div>
      </div>
    );
  }

  // Loading state for bookings
  if (bookingsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <ScaleLoader color="#10b981" />
          <p className="mt-4 text-gray-500">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Bookings</h1>
          <p className="text-gray-600">Review and manage all booking requests from users and members.</p>
        </div>
        
        {/* Refresh Button */}
        <button
          onClick={() => refetchBookings()}
          disabled={bookingsLoading || bookingsFetching}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${(bookingsLoading || bookingsFetching) ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by user name, email, or court name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {bookingsFetching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <ScaleLoader color="#10b981" height={15} width={2} />
                </div>
              )}
            </div>
          </div>
          {/* Status Filter */}
          <div className="md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="confirmed">Confirmed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error State */}
      {bookingsError ? (
        <div className="flex flex-col items-center justify-center h-40 text-center bg-white rounded-lg shadow p-6">
          <div className="text-red-500 mb-4">
            <Calendar className="w-12 h-12 mx-auto mb-2" />
            <p className="text-lg font-medium">Failed to load bookings</p>
            <p className="text-sm text-gray-500 mt-1">
              {bookingsErrorDetails?.message || 'Something went wrong'}
            </p>
          </div>
          <button
            onClick={() => refetchBookings()}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : (
        /* Bookings List */
        <div className="bg-white rounded-lg shadow">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Calendar className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No booking requests available at the moment.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Details
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Court & Date
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time Slots
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      {/* User Details */}
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-emerald-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 capitalize">
                              {booking.userName || 'Unknown User'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.userEmail || 'No email'}
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* Court & Date */}
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {booking.courtName || 'Unknown Court'}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(booking.date)}
                        </div>
                      </td>
                      {/* Time Slots */}
                      <td className="px-4 sm:px-6 py-4">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-gray-400" />
                          <span className="break-words">{formatSlots(booking.slots)}</span>
                        </div>
                      </td>
                      {/* Price */}
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium flex items-center">
                          <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                          ${booking.totalPrice || 0}
                        </div>
                      </td>
                      {/* Status */}
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(booking.status)}
                      </td>
                      {/* Actions */}
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {booking.status === 'pending' && (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={() => handleApproveBooking(booking._id)}
                              disabled={approveBookingMutation.isLoading && approveBookingMutation.variables === booking._id}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                              {approveBookingMutation.isLoading && approveBookingMutation.variables === booking._id ? (
                                <ScaleLoader color="#ffffff" height={12} width={2} />
                              ) : (
                                <>
                                  <Check className="w-3 h-3 mr-1" />
                                  <span className="hidden sm:inline">Approve</span>
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleRejectBooking(booking._id)}
                              disabled={rejectBookingMutation.isLoading && rejectBookingMutation.variables === booking._id}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                              {rejectBookingMutation.isLoading && rejectBookingMutation.variables === booking._id ? (
                                <ScaleLoader color="#ffffff" height={12} width={2} />
                              ) : (
                                <>
                                  <X className="w-3 h-3 mr-1" />
                                  <span className="hidden sm:inline">Reject</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                        {booking.status !== 'pending' && (
                          <span className="text-gray-400 text-xs">No actions available</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Confirmed Bookings Table */}
      <div className="bg-white rounded-lg shadow mt-10">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">Confirmed Bookings</h2>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by court or user name..."
              value={confirmedSearch}
              onChange={e => setConfirmedSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Court</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slots</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {confirmedBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">No confirmed bookings found.</td>
                </tr>
              ) : (
                confirmedBookings.map(booking => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.userName || 'Unknown User'}</div>
                      <div className="text-sm text-gray-500">{booking.userEmail || 'No email'}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">{booking.courtName || 'Unknown Court'}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">{formatDate(booking.date)}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">{formatSlots(booking.slots)}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">${booking.totalPrice || 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      {filteredBookings.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{filteredBookings.length}</div>
              <div className="text-sm text-gray-500">Total Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredBookings.filter(b => b.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredBookings.filter(b => b.status === 'approved').length}
              </div>
              <div className="text-sm text-gray-500">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredBookings.filter(b => b.status === 'confirmed').length}
              </div>
              <div className="text-sm text-gray-500">Confirmed</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;