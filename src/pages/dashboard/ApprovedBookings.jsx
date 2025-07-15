import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ScaleLoader } from 'react-spinners';
import { Calendar, Clock, MapPin, DollarSign, CreditCard, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ApprovedBookings = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [approvedBookings, setApprovedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchApprovedBookings();
  }, [user]);

  const fetchApprovedBookings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/approved/${user.uid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setApprovedBookings(data);
      } else {
        const errorText = await response.text();
        toast.error('Failed to load approved bookings');
      }
    } catch (error) {
      toast.error('Error loading approved bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!bookingId) return;

    try {
      setCancellingId(bookingId);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('Booking cancelled successfully');
        // Remove the cancelled booking from the list
        setApprovedBookings(prev => prev.filter(booking => booking._id !== bookingId));
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to cancel booking');
      }
    } catch (error) {
      toast.error('Error cancelling booking');
    } finally {
      setCancellingId(null);
    }
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

  if (loading) {
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
              <div className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Booking Info */}
                  <div className="flex-1 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 lg:justify-start">
                      <h3 className="text-xl font-bold text-gray-900">
                        {booking.courtName || 'Court Booking'}
                      </h3>
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 lg:hidden">
                        ✓ Approved
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                          <span className="text-sm font-semibold text-gray-900">
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
                  <div className="flex flex-col sm:flex-row gap-4 lg:flex-row lg:items-start lg:w-auto lg:ml-0 lg:mt-16">
                    <span className="hidden lg:inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      ✓ Approved
                    </span>
                    <button
                      onClick={() => handlePayment(booking)}
                      className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 cursor-pointer font-semibold border border-emerald-600"
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Pay Now
                    </button>
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      disabled={cancellingId === booking._id}
                      className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 cursor-pointer font-semibold border border-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cancellingId === booking._id ? (
                        <ScaleLoader color="white" height={16} width={2} />
                      ) : (
                        <>
                          <X className="w-5 h-5 mr-2" />
                          Cancel
                        </>
                      )}
                    </button>
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