import React, { useState } from 'react';
import { Calendar, Clock, User, MapPin, DollarSign, Search, Filter, Eye, X, CheckCircle } from 'lucide-react';

const ConfirmedBookings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Mock confirmed bookings data
  const [bookings] = useState([
    {
      id: 'CB001',
      courtName: 'Tennis Court A',
      courtType: 'Tennis',
      memberName: 'John Smith',
      memberEmail: 'john.smith@email.com',
      memberPhone: '+1 (555) 123-4567',
      date: '2024-01-15',
      timeSlot: '10:00 AM - 12:00 PM',
      duration: 2,
      pricePerHour: 50,
      totalAmount: 100,
      paymentStatus: 'paid',
      paymentMethod: 'Credit Card',
      transactionId: 'TXN123456789',
      bookingDate: '2024-01-10',
      status: 'confirmed',
      specialRequests: 'Need extra tennis balls',
      checkInTime: null,
      checkOutTime: null,
      attendanceStatus: 'pending'
    },
    {
      id: 'CB002',
      courtName: 'Badminton Court A',
      courtType: 'Badminton',
      memberName: 'Sarah Johnson',
      memberEmail: 'sarah.johnson@email.com',
      memberPhone: '+1 (555) 234-5678',
      date: '2024-01-16',
      timeSlot: '2:00 PM - 4:00 PM',
      duration: 2,
      pricePerHour: 30,
      totalAmount: 60,
      paymentStatus: 'paid',
      paymentMethod: 'PayPal',
      transactionId: 'TXN987654321',
      bookingDate: '2024-01-11',
      status: 'confirmed',
      specialRequests: '',
      checkInTime: '1:55 PM',
      checkOutTime: '4:10 PM',
      attendanceStatus: 'completed'
    },
    {
      id: 'CB003',
      courtName: 'Squash Court A',
      courtType: 'Squash',
      memberName: 'Mike Wilson',
      memberEmail: 'mike.wilson@email.com',
      memberPhone: '+1 (555) 345-6789',
      date: '2024-01-17',
      timeSlot: '6:00 PM - 7:00 PM',
      duration: 1,
      pricePerHour: 40,
      totalAmount: 40,
      paymentStatus: 'paid',
      paymentMethod: 'Bank Transfer',
      transactionId: 'TXN456789123',
      bookingDate: '2024-01-12',
      status: 'confirmed',
      specialRequests: 'First time playing, need basic equipment',
      checkInTime: '5:58 PM',
      checkOutTime: null,
      attendanceStatus: 'checked-in'
    },
    {
      id: 'CB004',
      courtName: 'Tennis Court B',
      courtType: 'Tennis',
      memberName: 'Emily Davis',
      memberEmail: 'emily.davis@email.com',
      memberPhone: '+1 (555) 456-7890',
      date: '2024-01-18',
      timeSlot: '8:00 AM - 10:00 AM',
      duration: 2,
      pricePerHour: 45,
      totalAmount: 90,
      paymentStatus: 'paid',
      paymentMethod: 'Credit Card',
      transactionId: 'TXN789123456',
      bookingDate: '2024-01-13',
      status: 'confirmed',
      specialRequests: 'Early morning session, please ensure court is ready',
      checkInTime: null,
      checkOutTime: null,
      attendanceStatus: 'no-show'
    },
    {
      id: 'CB005',
      courtName: 'Badminton Court B',
      courtType: 'Badminton',
      memberName: 'David Brown',
      memberEmail: 'david.brown@email.com',
      memberPhone: '+1 (555) 567-8901',
      date: '2024-01-19',
      timeSlot: '4:00 PM - 6:00 PM',
      duration: 2,
      pricePerHour: 35,
      totalAmount: 70,
      paymentStatus: 'paid',
      paymentMethod: 'Digital Wallet',
      transactionId: 'TXN321654987',
      bookingDate: '2024-01-14',
      status: 'confirmed',
      specialRequests: 'Tournament practice session',
      checkInTime: null,
      checkOutTime: null,
      attendanceStatus: 'pending'
    }
  ]);

  const openViewModal = (booking) => {
    setSelectedBooking(booking);
    setIsViewModalOpen(true);
  };

  const closeModals = () => {
    setSelectedBooking(null);
    setIsViewModalOpen(false);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.courtName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.memberEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.attendanceStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'checked-in': 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      'no-show': 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </span>
    );
  };

  const getPaymentBadge = (status) => {
    const statusClasses = {
      paid: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      failed: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Confirmed Bookings</h1>
        <p className="text-gray-600">Monitor and manage all confirmed court bookings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{bookings.filter(b => b.attendanceStatus === 'completed').length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">No Shows</p>
              <p className="text-2xl font-bold text-gray-900">{bookings.filter(b => b.attendanceStatus === 'no-show').length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${bookings.reduce((sum, b) => sum + b.totalAmount, 0)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by member name, court, booking ID, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer appearance-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="checked-in">Checked In</option>
                <option value="completed">Completed</option>
                <option value="no-show">No Show</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Court & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">#{booking.id}</div>
                      <div className="text-sm text-gray-500">Booked: {formatDate(booking.bookingDate)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{booking.memberName}</div>
                      <div className="text-sm text-gray-500">{booking.memberEmail}</div>
                      <div className="text-sm text-gray-500">{booking.memberPhone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{booking.courtName}</div>
                      <div className="text-sm text-gray-500">
                        <Calendar className="inline h-4 w-4 mr-1" />
                        {formatDate(booking.date)}
                      </div>
                      <div className="text-sm text-gray-500">
                        <Clock className="inline h-4 w-4 mr-1" />
                        {booking.timeSlot}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">${booking.totalAmount}</div>
                      <div className="text-sm text-gray-500">{booking.paymentMethod}</div>
                      {getPaymentBadge(booking.paymentStatus)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {getStatusBadge(booking.attendanceStatus)}
                      {booking.checkInTime && (
                        <div className="text-xs text-gray-500">In: {formatTime(booking.checkInTime)}</div>
                      )}
                      {booking.checkOutTime && (
                        <div className="text-xs text-gray-500">Out: {formatTime(booking.checkOutTime)}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openViewModal(booking)}
                      className="text-blue-600 hover:text-blue-900 cursor-pointer"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search criteria or filters.'
              : 'No confirmed bookings available.'}
          </p>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
                <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Booking Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Booking Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Booking ID</label>
                      <p className="text-gray-900">#{selectedBooking.id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Booking Date</label>
                      <p className="text-gray-900">{formatDate(selectedBooking.bookingDate)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Status</label>
                      <div>{getStatusBadge(selectedBooking.attendanceStatus)}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Court</label>
                      <p className="text-gray-900">{selectedBooking.courtName} ({selectedBooking.courtType})</p>
                    </div>
                  </div>
                </div>

                {/* Member Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Member Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Name</label>
                      <p className="text-gray-900">{selectedBooking.memberName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{selectedBooking.memberEmail}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-gray-900">{selectedBooking.memberPhone}</p>
                    </div>
                  </div>
                </div>

                {/* Schedule Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Schedule Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Date</label>
                      <p className="text-gray-900">{formatDate(selectedBooking.date)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Time Slot</label>
                      <p className="text-gray-900">{selectedBooking.timeSlot}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Duration</label>
                      <p className="text-gray-900">{selectedBooking.duration} hour(s)</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Check-in Time</label>
                      <p className="text-gray-900">{formatTime(selectedBooking.checkInTime)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Check-out Time</label>
                      <p className="text-gray-900">{formatTime(selectedBooking.checkOutTime)}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Price per Hour</label>
                      <p className="text-gray-900">${selectedBooking.pricePerHour}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Total Amount</label>
                      <p className="text-gray-900">${selectedBooking.totalAmount}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Payment Method</label>
                      <p className="text-gray-900">{selectedBooking.paymentMethod}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Payment Status</label>
                      <div>{getPaymentBadge(selectedBooking.paymentStatus)}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Transaction ID</label>
                      <p className="text-gray-900">{selectedBooking.transactionId}</p>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {selectedBooking.specialRequests && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Special Requests</h3>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedBooking.specialRequests}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmedBookings;