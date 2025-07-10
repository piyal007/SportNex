import React from 'react';
import { Calendar, Clock, DollarSign, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

// Replace with TanStack Query and your API logic
const mockBookings = [
  { id: 1, court: 'Tennis Court A', slot: '10:00-11:00', price: 20, date: '2024-06-10', status: 'pending' },
  { id: 2, court: 'Badminton Court B', slot: '12:00-13:00', price: 15, date: '2024-06-12', status: 'pending' },
  { id: 3, court: 'Squash Court C', slot: '14:00-15:00', price: 25, date: '2024-06-15', status: 'pending' },
];

const PendingBookings = () => {
  // Replace with TanStack Query and mutation for cancel
  const handleCancel = (id, courtName) => {
    // Call cancel API and show toast
    toast.success(`Booking for ${courtName} has been cancelled`);
  };
  
  if (mockBookings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Bookings</h3>
          <p className="text-gray-500">You don't have any pending bookings at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Pending Bookings</h2>
        <p className="text-gray-600 text-sm sm:text-base">Manage your pending court reservations</p>
      </div>

      {/* Mobile Card Layout */}
      <div className="block lg:hidden space-y-4">
        {mockBookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{booking.court}</h3>
                <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full mt-1">
                  Pending Approval
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{new Date(booking.date).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{booking.slot}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <DollarSign className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">${booking.price}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-100">
              <Button
                variant="destructive"
                size="sm"
                className="w-full cursor-pointer"
                onClick={() => handleCancel(booking.id, booking.court)}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel Booking
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden lg:block">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Court
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Slot
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{booking.court}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(booking.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.slot}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${booking.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="cursor-pointer"
                        onClick={() => handleCancel(booking.id, booking.court)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingBookings;