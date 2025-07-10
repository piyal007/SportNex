import React, { useState } from 'react';
import { Check, X, Eye, Calendar, Clock, DollarSign, User, Search, Filter } from 'lucide-react';

const ManageBookings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock booking requests data
  const [bookingRequests, setBookingRequests] = useState([
    {
      id: 1,
      userName: 'Alice Johnson',
      userEmail: 'alice@example.com',
      courtType: 'Tennis Court A',
      date: '2024-01-15',
      timeSlots: ['10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM'],
      pricePerSlot: 50,
      totalPrice: 100,
      status: 'pending',
      requestDate: '2024-01-10',
      userPhone: '+1 (555) 123-4567'
    },
    {
      id: 2,
      userName: 'Bob Smith',
      userEmail: 'bob@example.com',
      courtType: 'Badminton Court B',
      date: '2024-01-16',
      timeSlots: ['2:00 PM - 3:00 PM'],
      pricePerSlot: 30,
      totalPrice: 30,
      status: 'pending',
      requestDate: '2024-01-11',
      userPhone: '+1 (555) 987-6543'
    },
    {
      id: 3,
      userName: 'Carol Davis',
      userEmail: 'carol@example.com',
      courtType: 'Squash Court C',
      date: '2024-01-17',
      timeSlots: ['6:00 PM - 7:00 PM', '7:00 PM - 8:00 PM'],
      pricePerSlot: 40,
      totalPrice: 80,
      status: 'approved',
      requestDate: '2024-01-12',
      userPhone: '+1 (555) 456-7890'
    },
    {
      id: 4,
      userName: 'David Wilson',
      userEmail: 'david@example.com',
      courtType: 'Tennis Court B',
      date: '2024-01-18',
      timeSlots: ['9:00 AM - 10:00 AM'],
      pricePerSlot: 50,
      totalPrice: 50,
      status: 'rejected',
      requestDate: '2024-01-13',
      userPhone: '+1 (555) 321-0987'
    }
  ]);

  const handleApprove = async (bookingId) => {
    setIsLoading(true);
    try {
      // TODO: API call to approve booking
      setBookingRequests(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'approved' }
            : booking
        )
      );
      console.log('Booking approved:', bookingId);
    } catch (error) {
      console.error('Error approving booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (bookingId) => {
    setIsLoading(true);
    try {
      // TODO: API call to reject booking
      setBookingRequests(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'rejected' }
            : booking
        )
      );
      console.log('Booking rejected:', bookingId);
    } catch (error) {
      console.error('Error rejecting booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setIsModalOpen(false);
  };

  const filteredBookings = bookingRequests.filter(booking => {
    const matchesSearch = booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.courtType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Booking Requests</h1>
        <p className="text-gray-600">Review and approve or reject booking requests from users</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by user name, email, or court type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400 h-4 w-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Court & Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time Slots
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
                      <div className="text-sm font-medium text-gray-900">{booking.userName}</div>
                      <div className="text-sm text-gray-500">{booking.userEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{booking.courtType}</div>
                      <div className="text-sm text-gray-500">{booking.date}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {booking.timeSlots.map((slot, index) => (
                        <div key={index} className="mb-1">{slot}</div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${booking.totalPrice}</div>
                    <div className="text-sm text-gray-500">${booking.pricePerSlot}/slot</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(booking.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModal(booking)}
                        className="text-blue-600 hover:text-blue-900 cursor-pointer"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(booking.id)}
                            disabled={isLoading}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50 cursor-pointer"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleReject(booking.id)}
                            disabled={isLoading}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 cursor-pointer"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No booking requests found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No booking requests have been submitted yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Booking Request Details</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* User Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    User Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Name</label>
                      <p className="text-gray-900">{selectedBooking.userName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{selectedBooking.userEmail}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-gray-900">{selectedBooking.userPhone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Request Date</label>
                      <p className="text-gray-900">{selectedBooking.requestDate}</p>
                    </div>
                  </div>
                </div>

                {/* Booking Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Booking Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Court Type</label>
                      <p className="text-gray-900">{selectedBooking.courtType}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Date</label>
                      <p className="text-gray-900">{selectedBooking.date}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-500">Time Slots</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedBooking.timeSlots.map((slot, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Pricing Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Price per slot:</span>
                      <span className="text-gray-900 font-medium">${selectedBooking.pricePerSlot}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Number of slots:</span>
                      <span className="text-gray-900 font-medium">{selectedBooking.timeSlots.length}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Total Price:</span>
                        <span className="text-lg font-bold text-green-600">${selectedBooking.totalPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    {getStatusBadge(selectedBooking.status)}
                  </div>
                  
                  {selectedBooking.status === 'pending' && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          handleApprove(selectedBooking.id);
                          closeModal();
                        }}
                        disabled={isLoading}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200 cursor-pointer"
                      >
                        <Check className="h-4 w-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => {
                          handleReject(selectedBooking.id);
                          closeModal();
                        }}
                        disabled={isLoading}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors duration-200 cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;