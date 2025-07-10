import React, { useState } from 'react';
import { Calendar, Clock, MapPin, DollarSign, Eye, X, AlertCircle } from 'lucide-react';

const PendingBookings = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mock data for pending bookings
  const [pendingBookings] = useState([
    {
      id: 1,
      serviceName: 'Wedding Photography',
      serviceProvider: 'John Smith Photography',
      bookingDate: '2024-02-15',
      eventDate: '2024-03-20',
      eventTime: '10:00 AM',
      location: 'Grand Hotel, Downtown',
      price: 1500,
      status: 'pending',
      description: 'Full day wedding photography package including ceremony and reception coverage.',
      submittedDate: '2024-01-10'
    },
    {
      id: 2,
      serviceName: 'Birthday Party Catering',
      serviceProvider: 'Delicious Delights Catering',
      bookingDate: '2024-02-10',
      eventDate: '2024-02-25',
      eventTime: '2:00 PM',
      location: 'Community Center, Westside',
      price: 800,
      status: 'pending',
      description: 'Catering service for 50 guests with appetizers, main course, and desserts.',
      submittedDate: '2024-01-05'
    },
    {
      id: 3,
      serviceName: 'Corporate Event DJ',
      serviceProvider: 'Beat Masters Entertainment',
      bookingDate: '2024-02-20',
      eventDate: '2024-03-10',
      eventTime: '6:00 PM',
      location: 'Business Plaza, Suite 200',
      price: 600,
      status: 'pending',
      description: 'Professional DJ service for corporate annual party with sound system and lighting.',
      submittedDate: '2024-01-15'
    }
  ]);

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pending Bookings</h1>
            <p className="text-sm text-gray-500">Bookings awaiting approval from service providers</p>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {pendingBookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Bookings</h3>
          <p className="text-gray-500">You don't have any pending bookings at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingBookings.map((booking) => (
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
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
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
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(booking)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
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
              <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
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

                {/* Booking Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Booking Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Submitted Date:</span>
                        <p className="text-gray-900">{new Date(selectedBooking.submittedDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Status:</span>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedBooking.status)}`}>
                          {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Total Price:</span>
                      <p className="text-2xl font-bold text-emerald-600">${selectedBooking.price}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
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
    </div>
  );
};

export default PendingBookings;