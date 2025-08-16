import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Clock, MapPin, Users, Star, RefreshCw } from 'lucide-react';
import BookingModal from './components/BookingModal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

const Courts = () => {
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'
  const [sortOrder, setSortOrder] = useState('default'); // 'default' | 'priceAsc' | 'priceDesc'
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const courtsPerPage = viewMode === 'card' ? 6 : 10;

  // API base URL
  const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

  // Fetch courts using TanStack Query
  const {
    data: courts = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['courts'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/courts?limit=100`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch courts');
      }

      if (result.success && result.data) {
        // Transform MongoDB data to match frontend expectations
        return result.data.map(court => ({
          ...court,
          id: court._id // Add id field for compatibility
        }));
      } else {
        throw new Error(result.error || 'Failed to fetch courts');
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    onError: (error) => {
      console.error('Error fetching courts:', error);
      toast.error('Failed to load courts');
    }
  });

  // Booking submission mutation
  const bookingMutation = useMutation({
    mutationFn: async (bookingData) => {
      if (!user) {
        throw new Error('Please log in to make a booking');
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit booking request');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('Booking request submitted! Waiting for admin approval.');
      setIsModalOpen(false);
      setSelectedCourt(null);
      // Optionally invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error) => {
      console.error('Error submitting booking:', error);
      if (error.message === 'Please log in to make a booking') {
        toast.error(error.message);
        navigate('/login');
      } else {
        toast.error(error.message || 'Failed to submit booking request');
      }
    }
  });

  // Reset to first page when view mode changes
  useState(() => {
    setCurrentPage(1);
  }, [viewMode]);

  const handleBookNow = (court) => {
    if (!user) {
      toast.error('Please login to book a court');
      navigate('/login');
      return;
    }
    setSelectedCourt(court);
    setIsModalOpen(true);
  };

  const handleBookingSubmit = (bookingData) => {
    bookingMutation.mutate(bookingData);
  };

  const handleRefresh = () => {
    refetch();
  };

  // Derived sort and pagination logic
  const sortedCourts = (() => {
    if (sortOrder === 'priceAsc') {
      return [...courts].sort((a, b) => (a.pricePerSession || 0) - (b.pricePerSession || 0));
    }
    if (sortOrder === 'priceDesc') {
      return [...courts].sort((a, b) => (b.pricePerSession || 0) - (a.pricePerSession || 0));
    }
    return courts;
  })();

  const totalPages = Math.ceil(sortedCourts.length / courtsPerPage);
  const startIndex = (currentPage - 1) * courtsPerPage;
  const endIndex = startIndex + courtsPerPage;
  const currentCourts = sortedCourts.slice(startIndex, endIndex);

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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

          <div className="p-3 md:p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-base md:text-lg font-semibold text-gray-900">{court.name}</h3>
              <div className="flex items-center space-x-1">
                {renderStars(court.rating)}
                <span className="text-xs md:text-sm text-gray-600 ml-1">{court.rating}</span>
              </div>
            </div>

            <p className="text-emerald-600 font-medium mb-2 capitalize text-sm md:text-base">{court.type}</p>

            <div className="flex items-center text-gray-600 text-xs md:text-sm mb-2">
              <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              <span>{court.location}</span>
            </div>

            <div className="flex items-center text-gray-600 text-xs md:text-sm mb-3">
              <Users className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              <span>Capacity: {court.capacity} people</span>
            </div>

            <div className="mb-3">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                Available Slots
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 text-sm">
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
              disabled={bookingMutation.isLoading}
              className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition-colors duration-200 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              {bookingMutation.isLoading ? 'Booking...' : 'Book Now'}
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
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Court
              </th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Available Slots
              </th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentCourts.map((court) => (
              <tr key={court.id} className="hover:bg-gray-50">
                <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={court.image}
                      alt={court.name}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover mr-2 md:mr-3"
                      loading="lazy"
                    />
                    <div>
                      <div className="text-xs md:text-sm font-medium text-gray-900">{court.name}</div>
                      <div className="text-xs text-gray-500">Capacity: {court.capacity}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 capitalize">
                    {court.type}
                  </span>
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                  {court.location}
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">
                  ${court.pricePerSession}
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {renderStars(court.rating)}
                    <span className="text-xs md:text-sm text-gray-600 ml-1">{court.rating}</span>
                  </div>
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                  <select className="p-1 border border-gray-300 rounded text-xs md:text-sm focus:ring-emerald-500 focus:border-emerald-500">
                    <option value="">Select slot</option>
                    {court.availableSlots.map((slot, index) => (
                      <option key={index} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleBookNow(court)}
                    disabled={bookingMutation.isLoading}
                    className="bg-emerald-600 text-white px-2 md:px-3 py-1 rounded-md hover:bg-emerald-700 transition-colors duration-200 text-xs md:text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bookingMutation.isLoading ? 'Booking...' : 'Book Now'}
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
    <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4">
      <div className="text-xs md:text-sm text-gray-700">
        Showing {startIndex + 1} to {Math.min(endIndex, courts.length)} of {courts.length} courts
      </div>
      <div className="flex space-x-1 md:space-x-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-2 md:px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer text-xs md:text-sm"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-2 md:px-3 py-1 border rounded-md cursor-pointer text-xs md:text-sm ${currentPage === index + 1
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
          className="px-2 md:px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer text-xs md:text-sm"
        >
          Next
        </button>
      </div>
    </div>
  );

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Courts</h3>
              <p className="text-red-600 mb-4">{error?.message || 'Failed to load courts'}</p>
              <button
                onClick={handleRefresh}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
            Available Courts
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Book your favorite court and enjoy premium sports facilities
          </p>
        </div>

        {/* View Toggle, Refresh and Sorting */}
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 md:mb-6 gap-3 md:gap-4">
          {/* Left: count + refresh */}
          <div className="flex items-center gap-3 flex-wrap w-full md:w-auto justify-between md:justify-start">
            <div className="text-xs md:text-sm text-gray-600">
              {sortedCourts.length} courts available
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 text-xs md:text-sm text-emerald-600 hover:text-emerald-700 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 md:w-4 md:h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          {/* Right: view toggle + sorting */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
            <button
              onClick={() => setViewMode('card')}
              className={`w-full sm:w-auto px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium cursor-pointer transition-colors ${viewMode === 'card'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              aria-pressed={viewMode === 'card'}
            >
              Card View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`w-full sm:w-auto px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium cursor-pointer transition-colors ${viewMode === 'table'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              aria-pressed={viewMode === 'table'}
            >
              Table View
            </button>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label htmlFor="sort-price" className="hidden sm:block text-xs md:text-sm text-gray-600">Sort by:</label>
              <select
                id="sort-price"
                value={sortOrder}
                onChange={(e) => { setSortOrder(e.target.value); setCurrentPage(1); }}
                className="w-full sm:w-48 px-2 py-2 rounded-md border border-gray-300 bg-white text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="default">Default</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courts Display */}
        {courts.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-lg p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Courts Available</h3>
              <p className="text-gray-600">There are currently no courts available for booking.</p>
            </div>
          </div>
        ) : (
          <>
            {viewMode === 'card' ? renderCardView() : renderTableView()}
            {/* Pagination */}
            {renderPagination()}
          </>
        )}

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