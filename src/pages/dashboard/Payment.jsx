import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ScaleLoader } from 'react-spinners';
import { CreditCard, Calendar, Clock, MapPin, DollarSign, Tag, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Stripe card element options
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

// Payment Form Component with Stripe hooks
const PaymentForm = ({ booking, fromPath }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const queryClient = useQueryClient();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountedPrice, setDiscountedPrice] = useState(null);

  // Coupon validation mutation
  const couponMutation = useMutation({
    mutationFn: async (code) => {
      if (!code.trim()) {
        throw new Error('Please enter a coupon code');
      }

      const token = await user.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/coupons/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Invalid coupon code');
      }

      const data = await response.json();
      return data.coupon;
    },
    onSuccess: (coupon) => {
      const originalPrice = booking.totalPrice || booking.price;
      const discount = (originalPrice * coupon.discount) / 100;
      const newPrice = originalPrice - discount;
      
      setAppliedCoupon(coupon);
      setDiscountedPrice(newPrice);
      toast.success(`Coupon applied! ${coupon.discount}% discount`);
    },
    onError: (error) => {
      console.error('Error applying coupon:', error);
      toast.error(error.message || 'Error applying coupon');
    }
  });

  // Payment processing mutation
  const paymentMutation = useMutation({
    mutationFn: async (paymentData) => {
      if (!stripe || !elements) {
        throw new Error('Stripe not loaded yet. Please try again.');
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card information is required');
      }

      const token = await user.getIdToken();
      
      // Create payment method with Stripe
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          email: user.email,
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
      
      const finalPaymentData = {
        bookingId: booking._id,
        email: user.email,
        courtType: booking.courtType,
        slots: booking.slots,
        date: booking.date,
        originalPrice: booking.totalPrice || booking.price,
        finalPrice: discountedPrice || booking.totalPrice || booking.price,
        couponCode: appliedCoupon?.code || null,
        discount: appliedCoupon?.discount || 0,
        paymentMethodId: paymentMethod.id
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/payments/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(finalPaymentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment failed');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('Payment successful! Booking confirmed.');
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['confirmedBookings'] });
      queryClient.invalidateQueries({ queryKey: ['approvedBookings'] });
      queryClient.invalidateQueries({ queryKey: ['paymentHistory'] });
      navigate('/dashboard/confirmed-bookings');
    },
    onError: (error) => {
      console.error('Error processing payment:', error);
      toast.error(error.message || 'Error processing payment');
    }
  });

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

  const handleApplyCoupon = () => {
    couponMutation.mutate(couponCode);
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    paymentMutation.mutate();
  };

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg shadow-sm">
        <ScaleLoader color="#059669" height={40} width={4} />
        <p className="mt-4 text-gray-600 font-medium">Loading payment details...</p>
      </div>
    );
  }

  const finalPrice = discountedPrice || booking.totalPrice || booking.price;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-100 p-2 md:p-3 rounded-full">
              <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Payment</h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base">
                Complete your payment to confirm the booking
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate(fromPath)}
            className="flex items-center px-3 md:px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer text-sm md:text-base self-start md:self-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        </div>
      </div>

      {/* Payment Form */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        {/* Coupon Section */}
        <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gray-50 rounded-lg">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <Tag className="w-4 h-4 md:w-5 md:h-5 mr-2 text-emerald-600" />
            Apply Coupon Code
          </h3>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              className="flex-1 px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm md:text-base"
              disabled={appliedCoupon}
            />
            <button
              onClick={handleApplyCoupon}
              disabled={couponMutation.isLoading || appliedCoupon}
              className="px-4 md:px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              {couponMutation.isLoading ? (
                <ScaleLoader color="white" height={16} width={2} />
              ) : appliedCoupon ? (
                'Applied'
              ) : (
                'Apply'
              )}
            </button>
          </div>
          {appliedCoupon && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center text-green-800">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="font-medium text-sm md:text-base">
                  Coupon "{appliedCoupon.code}" applied - {appliedCoupon.discount}% discount!
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmitPayment} className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed text-sm md:text-base"
              />
            </div>

            {/* Court Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Court Type
              </label>
              <input
                type="text"
                value={booking.courtType || 'Standard Court'}
                readOnly
                className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed text-sm md:text-base"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="text"
                value={formatDate(booking.date)}
                readOnly
                className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed text-sm md:text-base"
              />
            </div>

            {/* Slots */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Slots
              </label>
              <input
                type="text"
                value={booking.slots?.map(slot => formatTime(slot)).join(', ') || 'N/A'}
                readOnly
                className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed text-sm md:text-base"
              />
            </div>
          </div>

          {/* Card Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Information
            </label>
            <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm mb-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Card Details
                </label>
                <div className="p-3 md:p-4 border border-gray-300 rounded-lg bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                  <CardElement options={{
                    ...cardElementOptions,
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#374151',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        fontWeight: '400',
                        lineHeight: '24px',
                        '::placeholder': {
                          color: '#9CA3AF',
                        },
                        iconColor: '#6B7280',
                      },
                      invalid: {
                        color: '#EF4444',
                        iconColor: '#EF4444',
                      },
                      complete: {
                        color: '#059669',
                        iconColor: '#059669',
                      },
                    },
                  }} />
                </div>
              </div>
            </div>
            <p className="mt-2 text-xs md:text-sm text-gray-500">
              Use test card: 4242 4242 4242 4242 with any future date and CVC
            </p>
          </div>

          {/* Price Summary */}
          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3">Price Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm md:text-base">
                <span className="text-gray-600">Original Price:</span>
                <span className="font-medium">${booking.totalPrice || booking.price}</span>
              </div>
              {appliedCoupon && (
                <>
                  <div className="flex justify-between text-green-600 text-sm md:text-base">
                    <span>Discount ({appliedCoupon.discount}%):</span>
                    <span>-${((booking.totalPrice || booking.price) * appliedCoupon.discount / 100).toFixed(2)}</span>
                  </div>
                  <hr className="border-gray-300" />
                </>
              )}
              <div className="flex justify-between text-base md:text-lg font-bold">
                <span>Total Amount:</span>
                <span className="text-emerald-600">${finalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={paymentMutation.isLoading}
            className="w-full flex items-center justify-center px-4 md:px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer font-medium text-base md:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {paymentMutation.isLoading ? (
              <ScaleLoader color="white" height={20} width={3} />
            ) : (
              <>
                <CreditCard className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Complete Payment
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// Main Payment Component
const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get booking data from navigation state
  const booking = location.state?.booking;
  const fromPath = location.state?.from || '/dashboard/approved-bookings';

  useEffect(() => {
    // Redirect if no booking data
    if (!booking) {
      toast.error('No booking data found');
      navigate('/dashboard/approved-bookings');
    }
  }, [booking, navigate]);

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm booking={booking} fromPath={fromPath} />
    </Elements>
  );
};

export default Payment;