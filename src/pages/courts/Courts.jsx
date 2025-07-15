import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Users, Star } from 'lucide-react';
import BookingModal from './components/BookingModal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

const Courts = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'
  const { user } = useAuth();
  const navigate = useNavigate();

  const courtsPerPage = viewMode === 'card' ? 6 : 10;

  // Reset to first page when view mode changes
  useEffect(() => {
    setCurrentPage(1);
  }, [viewMode]);

  // Mock data - replace with actual API call

  // API base URL
  const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

  useEffect(() => {
    const fetchCourts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/courts?limit=100`); // Get all courts for client-side pagination
        const result = await response.json();

        if (result.success && result.data) {
          // Transform MongoDB data to match frontend expectations
          const transformedCourts = result.data.map(court => ({
            ...court,
            id: court._id // Add id field for compatibility
          }));
          setCourts(transformedCourts);
        } else {
          throw new Error(result.error || 'Failed to fetch courts');
        }
      } catch (error) {
        console.error('Error fetching courts:', error);
        toast.error('Failed to load courts');
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, []);

  const handleBookNow = (court) => {
    if (!user) {
      toast.error('Please login to book a court');
      navigate('/login');
      return;
    }
    setSelectedCourt(court);
    setIsModalOpen(true);
  };

  const handleBookingSubmit = async (bookingData) => {
    try {
      if (!user) {
        toast.error('Please log in to make a booking');
        navigate('/login');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify({
          courtId: bookingData.courtId,
          date: bookingData.selectedDate,
          slots: bookingData.selectedSlots,
          totalPrice: bookingData.totalPrice
        })
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Booking request submitted! Waiting for admin approval.');
        setIsModalOpen(false);
        setSelectedCourt(null);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to submit booking request');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast.error('Failed to submit booking request');
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(courts.length / courtsPerPage);
  const startIndex = (currentPage - 1) * courtsPerPage;
  const endIndex = startIndex + courtsPerPage;
  const currentCourts = courts.slice(startIndex, endIndex);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-4 h-4">
            <Star className="w-4 h-4 text-gray-300 absolute" />
            <div className="overflow-hidden w-1/2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star key={i} className="w-4 h-4 text-gray-300" />
        );
      }
    }

    return (
      <div className="flex items-center">
        {stars}
      </div>
    );
  };

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {currentCourts.map((court) => (
        <div key={court.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="relative">
            <img
              src={court.image}
              alt={court.name}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
            <div className="absolute top-2 right-2 bg-emerald-600 text-white px-2 py-1 rounded-md text-sm font-semibold">
              ${court.pricePerSession}/session
            </div>
          </div>

          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{court.name}</h3>
              <div className="flex items-center space-x-1">
                {renderStars(court.rating)}
                <span className="text-sm text-gray-600 ml-1">{court.rating}</span>
              </div>
            </div>

            <p className="text-emerald-600 font-medium mb-2">{court.type}</p>

            <div className="flex items-center text-gray-600 text-sm mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{court.location}</span>
            </div>

            <div className="flex items-center text-gray-600 text-sm mb-3">
              <Users className="w-4 h-4 mr-1" />
              <span>Capacity: {court.capacity} people</span>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Slots
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500">
                <option value="">Select a time slot</option>
                {court.availableSlots.map((slot, index) => (
                  <option key={index} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => handleBookNow(court)}
              className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition-colors duration-200 font-medium cursor-pointer"
            >
              Book Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTableView = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Court
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Available Slots
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentCourts.map((court) => (
              <tr key={court.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={court.image}
                      alt={court.name}
                      className="w-12 h-12 rounded-lg object-cover mr-3"
                      loading="lazy"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{court.name}</div>
                      <div className="text-sm text-gray-500">Capacity: {court.capacity}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                    {court.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {court.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${court.pricePerSession}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {renderStars(court.rating)}
                    <span className="text-sm text-gray-600 ml-1">{court.rating}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select className="p-1 border border-gray-300 rounded text-sm focus:ring-emerald-500 focus:border-emerald-500">
                    <option value="">Select slot</option>
                    {court.availableSlots.map((slot, index) => (
                      <option key={index} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleBookNow(court)}
                    className="bg-emerald-600 text-white px-3 py-1 rounded-md hover:bg-emerald-700 transition-colors duration-200 text-sm font-medium cursor-pointer"
                  >
                    Book Now
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPagination = () => (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-700">
        Showing {startIndex + 1} to {Math.min(endIndex, courts.length)} of {courts.length} courts
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 border rounded-md cursor-pointer ${currentPage === index + 1
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'border-gray-300 hover:bg-gray-50'
              }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Available Courts
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Book your favorite court and enjoy premium sports facilities
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            {courts.length} courts available
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('card')}
              className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors ${viewMode === 'card'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
            >
              Card View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors ${viewMode === 'table'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
            >
              Table View
            </button>
          </div>
        </div>

        {/* Courts Display */}
        {viewMode === 'card' ? renderCardView() : renderTableView()}

        {/* Pagination */}
        {renderPagination()}

        {/* Booking Modal */}
        {isModalOpen && selectedCourt && (
          <BookingModal
            court={selectedCourt}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedCourt(null);
            }}
            onSubmit={handleBookingSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default Courts;