import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ScaleLoader } from 'react-spinners';
import { Calendar, Clock, MapPin, DollarSign, CheckCircle, Receipt } from 'lucide-react';
import toast from 'react-hot-toast';

const ConfirmedBookings = () => {
  const { user } = useAuth();
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfirmedBookings();
  }, [user]);

  const fetchConfirmedBookings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const token = await user.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/confirmed/${user.uid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConfirmedBookings(data);
      } else {
        console.error('Failed to fetch confirmed bookings');
        toast.error('Failed to load confirmed bookings');
      }
    } catch (error) {
      console.error('Error fetching confirmed bookings:', error);
      toast.error('Error loading confirmed bookings');
    } finally {
      setLoading(false);
    }
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

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg shadow-sm">
        <ScaleLoader color="#059669" height={40} width={4} />
        <p className="mt-4 text-gray-600 font-medium">Loading confirmed bookings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-100 p-3 rounded-full">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Confirmed Bookings</h1>
            <p className="text-gray-600 mt-1">
              Your confirmed bookings after successful payment.
            </p>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {confirmedBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Confirmed Bookings</h3>
            <p className="text-gray-600">
              You don't have any confirmed bookings yet. Complete payment for your approved bookings to see them here.
            </p>
          </div>
        ) : (
          confirmedBookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Booking Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.courtName || 'Court Booking'}
                      </h3>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Confirmed
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
                          ${booking.finalPrice || booking.totalPrice || booking.price}
                        </span>
                      </div>
                    </div>

                    {/* Payment Info */}
                    {booking.paymentInfo && (
                      <div className="bg-emerald-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Receipt className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-medium text-emerald-800">Payment Details</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-emerald-700">
                          <div>
                            <span className="font-medium">Payment Date:</span>
                            <span className="ml-2">{formatDateTime(booking.paymentInfo.paymentDate)}</span>
                          </div>
                          {booking.paymentInfo.couponCode && (
                            <div>
                              <span className="font-medium">Coupon Used:</span>
                              <span className="ml-2">{booking.paymentInfo.couponCode}</span>
                            </div>
                          )}
                          {booking.paymentInfo.discount > 0 && (
                            <div>
                              <span className="font-medium">Discount:</span>
                              <span className="ml-2">{booking.paymentInfo.discount}%</span>
                            </div>
                          )}
                          <div>
                            <span className="font-medium">Amount Paid:</span>
                            <span className="ml-2">${booking.paymentInfo.finalPrice}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="flex flex-col items-center lg:items-end space-y-2">
                    <div className="bg-emerald-100 p-3 rounded-full">
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-emerald-600">Booking Confirmed</span>
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

export default ConfirmedBookings;