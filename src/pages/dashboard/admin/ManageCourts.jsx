import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Eye, Building, Search, X, Save } from 'lucide-react';

const ManageCourts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courtToDelete, setCourtToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock courts data
  const [courts, setCourts] = useState([
    {
      id: 1,
      name: 'Tennis Court A',
      type: 'Tennis',
      description: 'Professional tennis court with synthetic grass surface',
      pricePerHour: 50,
      capacity: 4,
      facilities: ['Lighting', 'Net', 'Seating Area', 'Water Fountain'],
      availability: 'available',
      image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      location: 'Building A, Level 1',
      operatingHours: '6:00 AM - 10:00 PM',
      createdDate: '2023-01-15'
    },
    {
      id: 2,
      name: 'Tennis Court B',
      type: 'Tennis',
      description: 'Standard tennis court with clay surface',
      pricePerHour: 45,
      capacity: 4,
      facilities: ['Lighting', 'Net', 'Seating Area'],
      availability: 'available',
      image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      location: 'Building A, Level 1',
      operatingHours: '6:00 AM - 10:00 PM',
      createdDate: '2023-01-15'
    },
    {
      id: 3,
      name: 'Badminton Court A',
      type: 'Badminton',
      description: 'Indoor badminton court with wooden flooring',
      pricePerHour: 30,
      capacity: 4,
      facilities: ['Air Conditioning', 'Net', 'Lighting', 'Sound System'],
      availability: 'available',
      image: 'https://images.unsplash.com/photo-1544717684-7ba720b2b5e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      location: 'Building B, Level 2',
      operatingHours: '7:00 AM - 9:00 PM',
      createdDate: '2023-02-01'
    },
    {
      id: 4,
      name: 'Badminton Court B',
      type: 'Badminton',
      description: 'Indoor badminton court with premium facilities',
      pricePerHour: 35,
      capacity: 4,
      facilities: ['Air Conditioning', 'Net', 'Lighting', 'Sound System', 'Locker Room'],
      availability: 'maintenance',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      location: 'Building B, Level 2',
      operatingHours: '7:00 AM - 9:00 PM',
      createdDate: '2023-02-01'
    },
    {
      id: 5,
      name: 'Squash Court A',
      type: 'Squash',
      description: 'Professional squash court with glass walls',
      pricePerHour: 40,
      capacity: 2,
      facilities: ['Air Conditioning', 'Lighting', 'Viewing Gallery', 'Equipment Storage'],
      availability: 'available',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      location: 'Building C, Level 1',
      operatingHours: '8:00 AM - 8:00 PM',
      createdDate: '2023-03-10'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    pricePerHour: '',
    capacity: '',
    facilities: [],
    availability: 'available',
    image: '',
    location: '',
    operatingHours: ''
  });

  const courtTypes = ['Tennis', 'Badminton', 'Squash', 'Basketball', 'Volleyball'];
  const availableFacilities = [
    'Lighting', 'Air Conditioning', 'Net', 'Seating Area', 'Water Fountain',
    'Sound System', 'Locker Room', 'Equipment Storage', 'Viewing Gallery'
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      description: '',
      pricePerHour: '',
      capacity: '',
      facilities: [],
      availability: 'available',
      image: '',
      location: '',
      operatingHours: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFacilityChange = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const handleAddCourt = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newCourt = {
        ...formData,
        id: courts.length + 1,
        pricePerHour: parseFloat(formData.pricePerHour),
        capacity: parseInt(formData.capacity),
        createdDate: new Date().toISOString().split('T')[0]
      };
      setCourts(prev => [...prev, newCourt]);
      console.log('Court added:', newCourt);
      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error adding court:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCourt = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedCourt = {
        ...formData,
        id: selectedCourt.id,
        pricePerHour: parseFloat(formData.pricePerHour),
        capacity: parseInt(formData.capacity),
        createdDate: selectedCourt.createdDate
      };
      setCourts(prev => prev.map(court => 
        court.id === selectedCourt.id ? updatedCourt : court
      ));
      console.log('Court updated:', updatedCourt);
      setIsEditModalOpen(false);
      setSelectedCourt(null);
      resetForm();
    } catch (error) {
      console.error('Error updating court:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCourt = async () => {
    setIsLoading(true);
    try {
      setCourts(prev => prev.filter(court => court.id !== courtToDelete.id));
      console.log('Court deleted:', courtToDelete.id);
      setIsDeleteModalOpen(false);
      setCourtToDelete(null);
    } catch (error) {
      console.error('Error deleting court:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openViewModal = (court) => {
    setSelectedCourt(court);
    setIsViewModalOpen(true);
  };

  const openEditModal = (court) => {
    setSelectedCourt(court);
    setFormData({
      name: court.name,
      type: court.type,
      description: court.description,
      pricePerHour: court.pricePerHour.toString(),
      capacity: court.capacity.toString(),
      facilities: [...court.facilities],
      availability: court.availability,
      image: court.image,
      location: court.location,
      operatingHours: court.operatingHours
    });
    setIsEditModalOpen(true);
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openDeleteModal = (court) => {
    setCourtToDelete(court);
    setIsDeleteModalOpen(true);
  };

  const closeModals = () => {
    setSelectedCourt(null);
    setCourtToDelete(null);
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setIsDeleteModalOpen(false);
    resetForm();
  };

  const filteredCourts = courts.filter(court => 
    court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    court.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    court.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAvailabilityBadge = (availability) => {
    const statusClasses = {
      available: 'bg-green-100 text-green-800 border-green-200',
      maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      unavailable: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusClasses[availability]}`}>
        {availability.charAt(0).toUpperCase() + availability.slice(1)}
      </span>
    );
  };

  const CourtForm = ({ onSubmit, submitText }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Court Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Court Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
          >
            <option value="">Select Type</option>
            {courtTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price per Hour ($)</label>
          <input
            type="number"
            name="pricePerHour"
            value={formData.pricePerHour}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleInputChange}
            required
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Operating Hours</label>
          <input
            type="text"
            name="operatingHours"
            value={formData.operatingHours}
            onChange={handleInputChange}
            required
            placeholder="e.g., 6:00 AM - 10:00 PM"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
          <select
            name="availability"
            value={formData.availability}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
          >
            <option value="available">Available</option>
            <option value="maintenance">Maintenance</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Facilities</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {availableFacilities.map(facility => (
            <label key={facility} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.facilities.includes(facility)}
                onChange={() => handleFacilityChange(facility)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700">{facility}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 cursor-pointer"
        >
          <Save className="h-4 w-4" />
          <span>{isLoading ? 'Saving...' : submitText}</span>
        </button>
        <button
          type="button"
          onClick={closeModals}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Courts</h1>
          <p className="text-gray-600">Add, edit, and manage sports courts</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Court</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Courts</p>
              <p className="text-2xl font-bold text-gray-900">{courts.length}</p>
            </div>
            <Building className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-gray-900">{courts.filter(c => c.availability === 'available').length}</p>
            </div>
            <Building className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Maintenance</p>
              <p className="text-2xl font-bold text-gray-900">{courts.filter(c => c.availability === 'maintenance').length}</p>
            </div>
            <Building className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Price/Hour</p>
              <p className="text-2xl font-bold text-gray-900">${(courts.reduce((sum, c) => sum + c.pricePerHour, 0) / courts.length).toFixed(0)}</p>
            </div>
            <Building className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search courts by name, type, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Courts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourts.map((court) => (
          <div key={court.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={court.image}
                alt={court.name}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{court.name}</h3>
                {getAvailabilityBadge(court.availability)}
              </div>
              <p className="text-sm text-gray-600 mb-2">{court.type}</p>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{court.description}</p>
              
              <div className="space-y-1 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Price:</span>
                  <span className="font-medium text-gray-900">${court.pricePerHour}/hour</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Capacity:</span>
                  <span className="font-medium text-gray-900">{court.capacity} people</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Location:</span>
                  <span className="font-medium text-gray-900">{court.location}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => openViewModal(court)}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => openEditModal(court)}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors duration-200 cursor-pointer"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => openDeleteModal(court)}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourts.length === 0 && (
        <div className="text-center py-12">
          <Building className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No courts found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm 
              ? 'Try adjusting your search criteria.'
              : 'No courts have been added yet.'}
          </p>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedCourt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Court Details</h2>
                <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <img
                  src={selectedCourt.image}
                  alt={selectedCourt.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Name</label>
                    <p className="text-gray-900">{selectedCourt.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Type</label>
                    <p className="text-gray-900">{selectedCourt.type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Price per Hour</label>
                    <p className="text-gray-900">${selectedCourt.pricePerHour}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Capacity</label>
                    <p className="text-gray-900">{selectedCourt.capacity} people</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Location</label>
                    <p className="text-gray-900">{selectedCourt.location}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Operating Hours</label>
                    <p className="text-gray-900">{selectedCourt.operatingHours}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Availability</label>
                    <div>{getAvailabilityBadge(selectedCourt.availability)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Created Date</label>
                    <p className="text-gray-900">{selectedCourt.createdDate}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                  <p className="text-gray-900">{selectedCourt.description}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Facilities</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedCourt.facilities.map((facility, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add New Court</h2>
                <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <CourtForm onSubmit={handleAddCourt} submitText="Add Court" />
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Edit Court</h2>
                <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <CourtForm onSubmit={handleEditCourt} submitText="Update Court" />
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && courtToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Delete Court
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete <strong>{courtToDelete.name}</strong>? 
                This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={closeModals}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCourt}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors duration-200 cursor-pointer"
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCourts;