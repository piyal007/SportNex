import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Clock, MapPin, DollarSign, CreditCard, X, RefreshCw } from 'lucide-react';
import { ScaleLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const ApprovedBookings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [cancellingId, setCancellingId] = useState(null);

  // Fetch approved bookings with TanStack Query
  const {
    data: approvedBookings = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['approvedBookings', user?.uid],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/approved/${user.uid}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch approved bookings');
      }

      return response.json();
    },
    enabled: !!user?.uid,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
    onError: (error) => {
      toast.error(error.message || 'Error loading approved bookings');
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
        throw new Error(errorData.error || 'Failed to cancel booking');
      }

      return response.json();
    },
    onMutate: async (bookingId) => {
      setCancellingId(bookingId);
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['approvedBookings', user?.uid] });

      // Snapshot the previous value
      const previousBookings = queryClient.getQueryData(['approvedBookings', user?.uid]);

      // Optimistically update to the new value
      queryClient.setQueryData(['approvedBookings', user?.uid], (old) =>
        old ? old.filter(booking => booking._id !== bookingId) : []
      );

      return { previousBookings };
    },
    onError: (error, bookingId, context) => {
      // Rollback on error
      if (context?.previousBookings) {
        queryClient.setQueryData(['approvedBookings', user?.uid], context.previousBookings);
      }
      toast.error(error.message || 'Error cancelling booking');
    },
    onSuccess: () => {
      toast.success('Booking cancelled successfully');
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['pendingBookings', user?.uid] });
      queryClient.invalidateQueries({ queryKey: ['confirmedBookings', user?.uid] });
    },
    onSettled: () => {
      setCancellingId(null);
    }
  });

  const handleCancelBooking = (bookingId) => {
    if (!bookingId) return;
    cancelBookingMutation.mutate(bookingId);
  };

  const handlePayment = (booking) => {
    // Navigate to payment page with booking details
    navigate('/dashboard/payment', { 
      state: { 
        booking: booking,
        from: '/dashboard/approved-bookings'
      } 
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gradient-to-br from-red-50 to-white rounded-xl border border-red-100">
        <div className="bg-red-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <X className="w-12 h-12 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Error Loading Bookings</h3>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          {error.message || 'Failed to load approved bookings. Please try again.'}
        </p>
        <button
          onClick={() => refetch()}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100">
        <ScaleLoader color="#059669" height={40} width={4} />
        <p className="mt-4 text-gray-700 font-medium">Loading approved bookings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-4 rounded-full">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Approved Bookings</h1>
              <p className="text-emerald-100 mt-2 text-lg">
                Your bookings that have been approved by admin. Make payment to confirm your booking.
              </p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors cursor-pointer"
            title="Refresh bookings"
          >
            <RefreshCw className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {approvedBookings.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No Approved Bookings</h3>
            <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
              You don't have any approved bookings yet. Once admin approves your booking requests, they will appear here.
            </p>
          </div>
        ) : (
          approvedBookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-emerald-200 transition-all duration-200">
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Booking Info */}
                  <div className="flex-1 space-y-4 lg:space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 lg:justify-start">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                        {booking.courtName || 'Court Booking'}
                      </h3>
                      <span className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 lg:hidden">
                        ✓ Approved
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                      <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Date</p>
                          <span className="text-sm font-semibold text-gray-900">
                            {formatDate(booking.date)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                        <div className="bg-purple-100 p-2 rounded-full">
                          <Clock className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Time</p>
                          <span className="text-sm font-semibold text-gray-900">
                            {booking.slots?.map(slot => formatTime(slot)).join(', ')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                        <div className="bg-orange-100 p-2 rounded-full">
                          <MapPin className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Court</p>
                          <span className="text-sm font-semibold text-gray-900 capitalize">
                            {booking.courtType || 'Standard Court'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <DollarSign className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Price</p>
                          <span className="text-lg font-bold text-gray-900">
                            ${booking.totalPrice || booking.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons and Status for Large Screens */}
                  <div className="flex flex-col sm:flex-row gap-3 lg:flex-col lg:items-end lg:w-auto lg:ml-0">
                    <span className="hidden lg:inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 mb-3">
                      ✓ Approved
                    </span>
                    <div className="flex flex-col sm:flex-row gap-3 lg:flex-col">
                      <button
                        onClick={() => handlePayment(booking)}
                        className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 cursor-pointer font-semibold border border-emerald-600"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay Now
                      </button>
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancellingId === booking._id || cancelBookingMutation.isLoading}
                        className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 cursor-pointer font-semibold border border-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancellingId === booking._id ? (
                          <ScaleLoader color="white" height={16} width={2} />
                        ) : (
                          <>
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApprovedBookings;