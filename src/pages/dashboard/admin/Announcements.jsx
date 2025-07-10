import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Eye, Megaphone, Search, X, Save, AlertCircle, Info, CheckCircle } from 'lucide-react';

const Announcements = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock announcements data
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'New Court Opening',
      content: 'We are excited to announce the opening of our new premium tennis court. The court features state-of-the-art facilities and will be available for booking starting next Monday.',
      type: 'info',
      priority: 'high',
      targetAudience: 'all',
      isActive: true,
      publishDate: '2024-01-15',
      expiryDate: '2024-02-15',
      createdBy: 'Admin',
      createdDate: '2024-01-14',
      viewCount: 245,
      isSticky: true
    },
    {
      id: 2,
      title: 'Maintenance Schedule',
      content: 'Badminton Court B will be under maintenance from January 20-22. All bookings during this period will be automatically rescheduled. We apologize for any inconvenience.',
      type: 'warning',
      priority: 'high',
      targetAudience: 'members',
      isActive: true,
      publishDate: '2024-01-16',
      expiryDate: '2024-01-23',
      createdBy: 'Admin',
      createdDate: '2024-01-15',
      viewCount: 189,
      isSticky: true
    },
    {
      id: 3,
      title: 'Holiday Hours Update',
      content: 'Please note that our facility will have modified hours during the upcoming holiday season. We will be open from 8 AM to 6 PM on weekdays and 9 AM to 5 PM on weekends.',
      type: 'info',
      priority: 'medium',
      targetAudience: 'all',
      isActive: true,
      publishDate: '2024-01-10',
      expiryDate: '2024-01-31',
      createdBy: 'Admin',
      createdDate: '2024-01-09',
      viewCount: 156,
      isSticky: false
    },
    {
      id: 4,
      title: 'New Membership Benefits',
      content: 'We have added exciting new benefits for our premium members including priority booking, extended playing hours, and complimentary equipment rental.',
      type: 'success',
      priority: 'medium',
      targetAudience: 'members',
      isActive: true,
      publishDate: '2024-01-12',
      expiryDate: '2024-03-12',
      createdBy: 'Admin',
      createdDate: '2024-01-11',
      viewCount: 98,
      isSticky: false
    },
    {
      id: 5,
      title: 'Payment System Upgrade',
      content: 'Our payment system will be temporarily unavailable on January 25th from 2 AM to 6 AM for scheduled maintenance and upgrades. Online bookings will resume after the maintenance.',
      type: 'warning',
      priority: 'high',
      targetAudience: 'all',
      isActive: false,
      publishDate: '2024-01-20',
      expiryDate: '2024-01-26',
      createdBy: 'Admin',
      createdDate: '2024-01-19',
      viewCount: 67,
      isSticky: false
    }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'info',
    priority: 'medium',
    targetAudience: 'all',
    isActive: true,
    publishDate: '',
    expiryDate: '',
    isSticky: false
  });

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'info',
      priority: 'medium',
      targetAudience: 'all',
      isActive: true,
      publishDate: '',
      expiryDate: '',
      isSticky: false
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newAnnouncement = {
        ...formData,
        id: announcements.length + 1,
        createdBy: 'Admin',
        createdDate: new Date().toISOString().split('T')[0],
        viewCount: 0
      };
      setAnnouncements(prev => [...prev, newAnnouncement]);
      console.log('Announcement added:', newAnnouncement);
      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error adding announcement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAnnouncement = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedAnnouncement = {
        ...formData,
        id: selectedAnnouncement.id,
        createdBy: selectedAnnouncement.createdBy,
        createdDate: selectedAnnouncement.createdDate,
        viewCount: selectedAnnouncement.viewCount
      };
      setAnnouncements(prev => prev.map(announcement => 
        announcement.id === selectedAnnouncement.id ? updatedAnnouncement : announcement
      ));
      console.log('Announcement updated:', updatedAnnouncement);
      setIsEditModalOpen(false);
      setSelectedAnnouncement(null);
      resetForm();
    } catch (error) {
      console.error('Error updating announcement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAnnouncement = async () => {
    setIsLoading(true);
    try {
      setAnnouncements(prev => prev.filter(announcement => announcement.id !== announcementToDelete.id));
      console.log('Announcement deleted:', announcementToDelete.id);
      setIsDeleteModalOpen(false);
      setAnnouncementToDelete(null);
    } catch (error) {
      console.error('Error deleting announcement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openViewModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsViewModalOpen(true);
  };

  const openEditModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      priority: announcement.priority,
      targetAudience: announcement.targetAudience,
      isActive: announcement.isActive,
      publishDate: announcement.publishDate,
      expiryDate: announcement.expiryDate,
      isSticky: announcement.isSticky
    });
    setIsEditModalOpen(true);
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openDeleteModal = (announcement) => {
    setAnnouncementToDelete(announcement);
    setIsDeleteModalOpen(true);
  };

  const closeModals = () => {
    setSelectedAnnouncement(null);
    setAnnouncementToDelete(null);
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setIsDeleteModalOpen(false);
    resetForm();
  };

  const filteredAnnouncements = announcements.filter(announcement => 
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeBadge = (type) => {
    const typeClasses = {
      info: 'bg-blue-100 text-blue-800 border-blue-200',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      success: 'bg-green-100 text-green-800 border-green-200',
      error: 'bg-red-100 text-red-800 border-red-200'
    };

    const typeIcons = {
      info: Info,
      warning: AlertCircle,
      success: CheckCircle,
      error: AlertCircle
    };

    const Icon = typeIcons[type];

    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full border ${typeClasses[type]}`}>
        <Icon className="h-3 w-3" />
        <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityClasses = {
      low: 'bg-gray-100 text-gray-800 border-gray-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${priorityClasses[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (isActive, expiryDate) => {
    const isExpired = new Date(expiryDate) < new Date();
    
    if (!isActive) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full border bg-gray-100 text-gray-800 border-gray-200">Inactive</span>;
    }
    if (isExpired) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full border bg-red-100 text-red-800 border-red-200">Expired</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium rounded-full border bg-green-100 text-green-800 border-green-200">Active</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const AnnouncementForm = ({ onSubmit, submitText }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
          >
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="success">Success</option>
            <option value="error">Error</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
          <select
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Users</option>
            <option value="members">Members Only</option>
            <option value="admins">Admins Only</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
          <input
            type="date"
            name="publishDate"
            value={formData.publishDate}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          required
          rows={5}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleInputChange}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span className="text-sm text-gray-700">Active</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            name="isSticky"
            checked={formData.isSticky}
            onChange={handleInputChange}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span className="text-sm text-gray-700">Sticky (Pin to top)</span>
        </label>
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
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600">Create and manage announcements for users</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Create Announcement</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Announcements</p>
              <p className="text-2xl font-bold text-gray-900">{announcements.length}</p>
            </div>
            <Megaphone className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {announcements.filter(a => a.isActive && new Date(a.expiryDate) >= new Date()).length}
              </p>
            </div>
            <Megaphone className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">{announcements.filter(a => a.priority === 'high').length}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{announcements.reduce((sum, a) => sum + a.viewCount, 0)}</p>
            </div>
            <Eye className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search announcements by title, content, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <div key={announcement.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                  {announcement.isSticky && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full border bg-purple-100 text-purple-800 border-purple-200">
                      Pinned
                    </span>
                  )}
                  {getTypeBadge(announcement.type)}
                  {getPriorityBadge(announcement.priority)}
                  {getStatusBadge(announcement.isActive, announcement.expiryDate)}
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{announcement.content}</p>
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <span>Target: {announcement.targetAudience === 'all' ? 'All Users' : announcement.targetAudience.charAt(0).toUpperCase() + announcement.targetAudience.slice(1)}</span>
                  <span>Published: {formatDate(announcement.publishDate)}</span>
                  <span>Expires: {formatDate(announcement.expiryDate)}</span>
                  <span>Views: {announcement.viewCount}</span>
                  <span>By: {announcement.createdBy}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => openViewModal(announcement)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => openEditModal(announcement)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => openDeleteModal(announcement)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAnnouncements.length === 0 && (
        <div className="text-center py-12">
          <Megaphone className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No announcements found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm 
              ? 'Try adjusting your search criteria.'
              : 'No announcements have been created yet.'}
          </p>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Announcement Details</h2>
                <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedAnnouncement.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedAnnouncement.isSticky && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full border bg-purple-100 text-purple-800 border-purple-200">
                        Pinned
                      </span>
                    )}
                    {getTypeBadge(selectedAnnouncement.type)}
                    {getPriorityBadge(selectedAnnouncement.priority)}
                    {getStatusBadge(selectedAnnouncement.isActive, selectedAnnouncement.expiryDate)}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Content</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedAnnouncement.content}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Target Audience</label>
                    <p className="text-gray-900">
                      {selectedAnnouncement.targetAudience === 'all' ? 'All Users' : selectedAnnouncement.targetAudience.charAt(0).toUpperCase() + selectedAnnouncement.targetAudience.slice(1)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">View Count</label>
                    <p className="text-gray-900">{selectedAnnouncement.viewCount}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Publish Date</label>
                    <p className="text-gray-900">{formatDate(selectedAnnouncement.publishDate)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Expiry Date</label>
                    <p className="text-gray-900">{formatDate(selectedAnnouncement.expiryDate)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Created By</label>
                    <p className="text-gray-900">{selectedAnnouncement.createdBy}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Created Date</label>
                    <p className="text-gray-900">{formatDate(selectedAnnouncement.createdDate)}</p>
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
                <h2 className="text-xl font-bold text-gray-900">Create New Announcement</h2>
                <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <AnnouncementForm onSubmit={handleAddAnnouncement} submitText="Create Announcement" />
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
                <h2 className="text-xl font-bold text-gray-900">Edit Announcement</h2>
                <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <AnnouncementForm onSubmit={handleEditAnnouncement} submitText="Update Announcement" />
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && announcementToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Delete Announcement
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete <strong>{announcementToDelete.title}</strong>? 
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
                  onClick={handleDeleteAnnouncement}
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

export default Announcements;