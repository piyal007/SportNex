import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, MapPin, Calendar, DollarSign, X, RefreshCw } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const PendingBookings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [cancellingId, setCancellingId] = useState(null);

  // Fetch pending bookings with TanStack Query
  const {
    data: pendingBookings = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['pendingBookings', user?.uid],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/pending/${user.uid}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch pending bookings');
      }
      
      const data = await response.json();
      return data.bookings || [];
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
    onError: (error) => {
      toast.error('Failed to load pending bookings');
      console.error('Error fetching pending bookings:', error);
    }
  });

  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId) => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel booking');
      }

      return response.json();
    },
    onMutate: async (bookingId) => {
      setCancellingId(bookingId);
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['pendingBookings', user?.uid] });
      
      // Snapshot the previous value
      const previousBookings = queryClient.getQueryData(['pendingBookings', user?.uid]);
      
      // Optimistically update to the new value
      queryClient.setQueryData(['pendingBookings', user?.uid], (old) => 
        old?.filter(booking => booking._id !== bookingId) || []
      );
      
      return { previousBookings };
    },
    onSuccess: () => {
      toast.success('Booking cancelled successfully');
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['confirmedBookings'] });
    },
    onError: (error, bookingId, context) => {
      // Rollback on error
      queryClient.setQueryData(['pendingBookings', user?.uid], context.previousBookings);
      toast.error(error.message || 'Error cancelling booking');
      console.error('Error cancelling booking:', error);
    },
    onSettled: () => {
      setCancellingId(null);
      queryClient.invalidateQueries({ queryKey: ['pendingBookings', user?.uid] });
    }
  });

  const handleCancelBooking = (bookingId) => {
    if (!bookingId) return;
    cancelBookingMutation.mutate(bookingId);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatTime = (timeString) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return timeString;
    }
  };

  if (error) {
    return (
      <div className="max-w-full overflow-hidden">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Error loading pending bookings: {error.message}</p>
          <button
            onClick={() => refetch()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-hidden">
      {/* Page Header */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Pending Bookings</h1>
            <p className="text-gray-600 mt-2">Manage your pending court booking requests</p>
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition cursor-pointer"
            disabled={isLoading}
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Bookings List */}
      {pendingBookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Bookings</h3>
          <p className="text-gray-500">You don't have any pending booking requests at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingBookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Booking Info */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Court Image */}
                      <div className="w-full sm:w-24 h-32 sm:h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {booking.court?.image ? (
                          <img
                            src={booking.court.image}
                            alt={booking.court.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Booking Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {booking.court?.name || 'Court Booking'}
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{booking.court?.type || 'Court'}</span>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>{formatDate(booking.date)}</span>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>
                              {booking.slots?.map(slot => formatTime(slot)).join(', ') || 'Time not specified'}
                            </span>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="font-medium">${booking.totalPrice || 0}</span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="mt-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending Approval
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cancel Button */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      disabled={cancellingId === booking._id || cancelBookingMutation.isPending}
                      className="w-full lg:w-auto inline-flex items-center justify-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      {cancellingId === booking._id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 mr-2" />
                          Cancel Booking
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingBookings;