import React, { useState } from 'react';
import { Calendar, Clock, MapPin, DollarSign, Eye, X, CheckCircle2, Star, MessageCircle } from 'lucide-react';

const ConfirmedBookings = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  // Mock data for confirmed bookings
  const [confirmedBookings] = useState([
    {
      id: 1,
      serviceName: 'Wedding Photography',
      serviceProvider: 'Capture Moments Studio',
      bookingDate: '2023-12-15',
      eventDate: '2024-01-20',
      eventTime: '2:00 PM',
      location: 'Sunset Beach Resort',
      price: 2500,
      status: 'confirmed',
      description: 'Complete wedding photography package with pre-wedding shoot and album.',
      submittedDate: '2023-11-01',
      approvedDate: '2023-11-05',
      confirmedDate: '2023-12-20',
      paymentStatus: 'paid',
      paymentDate: '2023-12-18',
      isCompleted: true,
      hasReview: false
    },
    {
      id: 2,
      serviceName: 'Birthday Party Catering',
      serviceProvider: 'Gourmet Delights',
      bookingDate: '2024-01-10',
      eventDate: '2024-02-14',
      eventTime: '6:00 PM',
      location: 'Private Residence',
      price: 800,
      status: 'confirmed',
      description: 'Premium catering service for 30 guests with themed decorations.',
      submittedDate: '2023-12-20',
      approvedDate: '2023-12-22',
      confirmedDate: '2024-01-12',
      paymentStatus: 'paid',
      paymentDate: '2024-01-11',
      isCompleted: false,
      hasReview: false
    },
    {
      id: 3,
      serviceName: 'Corporate Event DJ',
      serviceProvider: 'Sound Wave Entertainment',
      bookingDate: '2023-11-25',
      eventDate: '2023-12-15',
      eventTime: '7:00 PM',
      location: 'Grand Convention Hall',
      price: 1200,
      status: 'confirmed',
      description: 'Professional DJ service with lighting and sound system for corporate gala.',
      submittedDate: '2023-10-15',
      approvedDate: '2023-10-18',
      confirmedDate: '2023-11-27',
      paymentStatus: 'paid',
      paymentDate: '2023-11-26',
      isCompleted: true,
      hasReview: true,
      review: {
        rating: 5,
        comment: 'Excellent service! The DJ was professional and kept the crowd entertained all night.'
      }
    }
  ]);

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleWriteReview = (booking) => {
    setSelectedBooking(booking);
    setReviewData({ rating: 5, comment: '' });
    setShowReviewModal(true);
  };

  const handleSubmitReview = () => {
    // Submit review logic here
    console.log('Review submitted:', {
      bookingId: selectedBooking.id,
      rating: reviewData.rating,
      comment: reviewData.comment
    });
    setShowReviewModal(false);
    setSelectedBooking(null);
    setReviewData({ rating: 5, comment: '' });
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedBooking(null);
    setReviewData({ rating: 5, comment: '' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive ? () => onRatingChange(star) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Confirmed Bookings</h1>
            <p className="text-sm text-gray-500">Your confirmed and completed bookings</p>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {confirmedBookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <CheckCircle2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Confirmed Bookings</h3>
          <p className="text-gray-500">You don't have any confirmed bookings at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {confirmedBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {booking.serviceName}
                      </h3>
                      <p className="text-sm text-gray-600">{booking.serviceProvider}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                      {booking.isCompleted && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-800 border-green-200">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {new Date(booking.eventDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{booking.eventTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{booking.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 font-medium">${booking.price}</span>
                    </div>
                  </div>

                  {booking.hasReview && booking.review && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-yellow-800">Your Review:</span>
                        {renderStars(booking.review.rating)}
                      </div>
                      <p className="text-sm text-yellow-800">{booking.review.comment}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(booking)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  {booking.isCompleted && !booking.hasReview && (
                    <button
                      onClick={() => handleWriteReview(booking)}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Write Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for booking details */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Confirmed Booking Details</h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Service Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Service:</span>
                      <p className="text-gray-900">{selectedBooking.serviceName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Provider:</span>
                      <p className="text-gray-900">{selectedBooking.serviceProvider}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Description:</span>
                      <p className="text-gray-900">{selectedBooking.description}</p>
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Event Date:</span>
                        <p className="text-gray-900">{new Date(selectedBooking.eventDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Event Time:</span>
                        <p className="text-gray-900">{selectedBooking.eventTime}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Location:</span>
                      <p className="text-gray-900">{selectedBooking.location}</p>
                    </div>
                  </div>
                </div>

                {/* Booking Timeline */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Booking Timeline</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Submitted:</span>
                        <p className="text-gray-900">{new Date(selectedBooking.submittedDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Approved:</span>
                        <p className="text-gray-900">{new Date(selectedBooking.approvedDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Confirmed:</span>
                        <p className="text-gray-900">{new Date(selectedBooking.confirmedDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Payment Date:</span>
                        <p className="text-gray-900">{new Date(selectedBooking.paymentDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Total Amount:</span>
                        <p className="text-2xl font-bold text-emerald-600">${selectedBooking.price}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Payment Status:</span>
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-800 border-green-200">
                          Paid
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Section */}
                {selectedBooking.hasReview && selectedBooking.review && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Review</h3>
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-yellow-800">Rating:</span>
                        {renderStars(selectedBooking.review.rating)}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-yellow-800">Comment:</span>
                        <p className="text-yellow-800 mt-1">{selectedBooking.review.comment}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              {selectedBooking.isCompleted && !selectedBooking.hasReview && (
                <button
                  onClick={() => {
                    closeModal();
                    handleWriteReview(selectedBooking);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Write Review
                </button>
              )}
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Write Review</h2>
              <button
                onClick={closeReviewModal}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{selectedBooking.serviceName}</h3>
                  <p className="text-sm text-gray-600">{selectedBooking.serviceProvider}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  {renderStars(reviewData.rating, true, (rating) => setReviewData(prev => ({ ...prev, rating })))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment
                  </label>
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Share your experience with this service..."
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={closeReviewModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmedBookings;