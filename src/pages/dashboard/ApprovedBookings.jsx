import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ScaleLoader } from 'react-spinners';
import { Calendar, Clock, MapPin, DollarSign, CreditCard, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ApprovedBookings = () => {
  const { user } = useAuth();
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
        console.error('Failed to fetch approved bookings');
        toast.error('Failed to load approved bookings');
      }
    } catch (error) {
      console.error('Error fetching approved bookings:', error);
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
      console.error('Error cancelling booking:', error);
      toast.error('Error cancelling booking');
    } finally {
      setCancellingId(null);
    }
  };

  const handlePayment = (booking) => {
    // Navigate to payment page with booking details
    // This will be implemented when payment functionality is added
    toast.info('Payment functionality will be implemented soon');
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
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg shadow-sm">
        <ScaleLoader color="#059669" height={40} width={4} />
        <p className="mt-4 text-gray-600 font-medium">Loading approved bookings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-100 p-3 rounded-full">
            <Calendar className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Approved Bookings</h1>
            <p className="text-gray-600 mt-1">
              Your bookings that have been approved by admin. Make payment to confirm your booking.
            </p>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {approvedBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Approved Bookings</h3>
            <p className="text-gray-600">
              You don't have any approved bookings yet. Once admin approves your booking requests, they will appear here.
            </p>
          </div>
        ) : (
          approvedBookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Booking Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.courtName || 'Court Booking'}
                      </h3>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Approved
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formatDate(booking.date)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {booking.slots?.map(slot => formatTime(slot)).join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {booking.courtType || 'Standard Court'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          ${booking.totalPrice || booking.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 lg:flex-col lg:w-auto">
                    <button
                      onClick={() => handlePayment(booking)}
                      className="flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer font-medium"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay Now
                    </button>
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      disabled={cancellingId === booking._id}
                      className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
          ))
        )}
      </div>
    </div>
  );
};

export default ApprovedBookings;