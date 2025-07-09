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

  // Mock data - replace with actual API call
  const mockCourts = [
    {
      id: 1,
      name: 'Tennis Court A',
      type: 'Tennis',
      image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=500&h=300&fit=crop',
      pricePerSession: 50,
      availableSlots: [
        '09:00 AM - 10:00 AM',
        '10:00 AM - 11:00 AM',
        '02:00 PM - 03:00 PM',
        '03:00 PM - 04:00 PM',
        '05:00 PM - 06:00 PM'
      ],
      rating: 4.8,
      capacity: 4,
      location: 'Block A, Level 1'
    },
    {
      id: 2,
      name: 'Badminton Court B',
      type: 'Badminton',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=300&fit=crop',
      pricePerSession: 35,
      availableSlots: [
        '08:00 AM - 09:00 AM',
        '09:00 AM - 10:00 AM',
        '11:00 AM - 12:00 PM',
        '01:00 PM - 02:00 PM',
        '04:00 PM - 05:00 PM'
      ],
      rating: 4.6,
      capacity: 4,
      location: 'Block B, Level 2'
    },
    {
      id: 3,
      name: 'Squash Court C',
      type: 'Squash',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop',
      pricePerSession: 40,
      availableSlots: [
        '07:00 AM - 08:00 AM',
        '10:00 AM - 11:00 AM',
        '12:00 PM - 01:00 PM',
        '03:00 PM - 04:00 PM',
        '06:00 PM - 07:00 PM'
      ],
      rating: 4.7,
      capacity: 2,
      location: 'Block C, Level 1'
    },
    {
      id: 4,
      name: 'Basketball Court D',
      type: 'Basketball',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&h=300&fit=crop',
      pricePerSession: 60,
      availableSlots: [
        '08:00 AM - 10:00 AM',
        '10:00 AM - 12:00 PM',
        '02:00 PM - 04:00 PM',
        '04:00 PM - 06:00 PM'
      ],
      rating: 4.9,
      capacity: 10,
      location: 'Block D, Ground Floor'
    },
    {
      id: 5,
      name: 'Volleyball Court E',
      type: 'Volleyball',
      image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=500&h=300&fit=crop',
      pricePerSession: 45,
      availableSlots: [
        '09:00 AM - 10:30 AM',
        '11:00 AM - 12:30 PM',
        '01:00 PM - 02:30 PM',
        '03:00 PM - 04:30 PM',
        '05:00 PM - 06:30 PM'
      ],
      rating: 4.5,
      capacity: 12,
      location: 'Block E, Level 1'
    },
    {
      id: 6,
      name: 'Table Tennis Room F',
      type: 'Table Tennis',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=300&fit=crop',
      pricePerSession: 25,
      availableSlots: [
        '08:00 AM - 09:00 AM',
        '09:00 AM - 10:00 AM',
        '10:00 AM - 11:00 AM',
        '02:00 PM - 03:00 PM',
        '03:00 PM - 04:00 PM',
        '04:00 PM - 05:00 PM'
      ],
      rating: 4.4,
      capacity: 4,
      location: 'Block F, Level 2'
    },
    {
      id: 7,
      name: 'Tennis Court G',
      type: 'Tennis',
      image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=500&h=300&fit=crop',
      pricePerSession: 55,
      availableSlots: [
        '07:00 AM - 08:00 AM',
        '08:00 AM - 09:00 AM',
        '11:00 AM - 12:00 PM',
        '01:00 PM - 02:00 PM',
        '04:00 PM - 05:00 PM'
      ],
      rating: 4.8,
      capacity: 4,
      location: 'Block A, Level 2'
    },
    {
      id: 8,
      name: 'Badminton Court H',
      type: 'Badminton',
      image: 'https://images.unsplash.com/photo-1593786481097-4b4b3c7c4fb4?w=500&h=300&fit=crop',
      pricePerSession: 38,
      availableSlots: [
        '06:00 AM - 07:00 AM',
        '07:00 AM - 08:00 AM',
        '12:00 PM - 01:00 PM',
        '02:00 PM - 03:00 PM',
        '05:00 PM - 06:00 PM'
      ],
      rating: 4.7,
      capacity: 4,
      location: 'Block B, Level 1'
    },
    {
      id: 9,
      name: 'Squash Court I',
      type: 'Squash',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop',
      pricePerSession: 42,
      availableSlots: [
        '08:00 AM - 09:00 AM',
        '09:00 AM - 10:00 AM',
        '01:00 PM - 02:00 PM',
        '02:00 PM - 03:00 PM',
        '06:00 PM - 07:00 PM'
      ],
      rating: 4.6,
      capacity: 2,
      location: 'Block C, Level 2'
    },
    {
      id: 10,
      name: 'Multi-Purpose Court J',
      type: 'Multi-Purpose',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop',
      pricePerSession: 65,
      availableSlots: [
        '09:00 AM - 11:00 AM',
        '11:00 AM - 01:00 PM',
        '02:00 PM - 04:00 PM',
        '04:00 PM - 06:00 PM'
      ],
      rating: 4.9,
      capacity: 20,
      location: 'Block G, Ground Floor'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchCourts = async () => {
      setLoading(true);
      try {
        // Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCourts(mockCourts);
      } catch (error) {
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
      // Replace with actual API call
      console.log('Booking data:', bookingData);
      toast.success('Booking request submitted! Waiting for admin approval.');
      setIsModalOpen(false);
      setSelectedCourt(null);
    } catch (error) {
      toast.error('Failed to submit booking request');
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(courts.length / courtsPerPage);
  const startIndex = (currentPage - 1) * courtsPerPage;
  const endIndex = startIndex + courtsPerPage;
  const currentCourts = courts.slice(startIndex, endIndex);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
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
            className={`px-3 py-1 border rounded-md cursor-pointer ${
              currentPage === index + 1
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
              className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors ${
                viewMode === 'card'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Card View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors ${
                viewMode === 'table'
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