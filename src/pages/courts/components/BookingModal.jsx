import { useState } from 'react';
import { X, Calendar, Clock, DollarSign, MapPin, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';

const BookingModal = ({ court, isOpen, onClose, onSubmit }) => {
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Get date 30 days from now for max booking date
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateString = maxDate.toISOString().split('T')[0];

  const handleSlotToggle = (slot) => {
    setSelectedSlots(prev => {
      if (prev.includes(slot)) {
        return prev.filter(s => s !== slot);
      } else {
        return [...prev, slot];
      }
    });
  };

  const calculateTotalPrice = () => {
    return selectedSlots.length * court.pricePerSession;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }
    
    if (selectedSlots.length === 0) {
      toast.error('Please select at least one time slot');
      return;
    }

    setLoading(true);
    
    try {
      const bookingData = {
        courtId: court.id,
        courtName: court.name,
        courtType: court.type,
        courtLocation: court.location,
        selectedSlots,
        selectedDate,
        totalPrice: calculateTotalPrice(),
        pricePerSession: court.pricePerSession,
        status: 'pending',
        bookingDate: new Date().toISOString(),
      };
      
      await onSubmit(bookingData);
    } catch (error) {
      toast.error('Failed to submit booking');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedSlots([]);
    setSelectedDate('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Book Court</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Court Information */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start space-x-4">
            <img
              src={court.image}
              alt={court.name}
              className="w-24 h-24 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{court.name}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="font-medium text-emerald-600">{court.type}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{court.location}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>Capacity: {court.capacity} people</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span>${court.pricePerSession} per session</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Court Name (Read-only) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Court Name
            </label>
            <input
              type="text"
              value={court.name}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Court Type (Read-only) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Court Type
            </label>
            <input
              type="text"
              value={court.type}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Location (Read-only) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={court.location}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Price per Session (Read-only) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price per Session
            </label>
            <input
              type="text"
              value={`$${court.pricePerSession}`}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Date Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Select Date *
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              max={maxDateString}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Time Slots Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Select Time Slots * (You can select multiple slots)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {court.availableSlots.map((slot, index) => (
                <label
                  key={index}
                  className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                    selectedSlots.includes(slot)
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-300 hover:border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSlots.includes(slot)}
                    onChange={() => handleSlotToggle(slot)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
                    selectedSlots.includes(slot)
                      ? 'border-emerald-500 bg-emerald-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedSlots.includes(slot) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium">{slot}</span>
                </label>
              ))}
            </div>
            {selectedSlots.length > 0 && (
              <p className="text-sm text-emerald-600 mt-2">
                {selectedSlots.length} slot{selectedSlots.length > 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          {/* Total Price */}
          {selectedSlots.length > 0 && (
            <div className="mb-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Total Price ({selectedSlots.length} session{selectedSlots.length > 1 ? 's' : ''})
                </span>
                <span className="text-lg font-bold text-emerald-600">
                  ${calculateTotalPrice()}
                </span>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                ${court.pricePerSession} × {selectedSlots.length} session{selectedSlots.length > 1 ? 's' : ''}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || selectedSlots.length === 0 || !selectedDate}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {loading ? 'Submitting...' : 'Submit Booking Request'}
            </button>
          </div>

          {/* Note */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Your booking request will be sent to the admin for approval. 
              You will be notified once your booking is approved and you become a member.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;