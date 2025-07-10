import React, { useState } from 'react';
import { Megaphone, Calendar, Eye, X, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';

const Announcements = () => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');

  // Mock data for announcements
  const [announcements] = useState([
    {
      id: 1,
      title: 'New Payment Options Available',
      content: 'We are excited to announce that we now accept additional payment methods including Apple Pay, Google Pay, and cryptocurrency payments. This will make it easier for you to complete your bookings and payments.',
      type: 'info',
      priority: 'medium',
      publishDate: '2024-02-01',
      isRead: false,
      author: 'System Administrator',
      category: 'Payment'
    },
    {
      id: 2,
      title: 'Scheduled Maintenance - February 15th',
      content: 'Our platform will undergo scheduled maintenance on February 15th from 2:00 AM to 6:00 AM EST. During this time, some features may be temporarily unavailable. We apologize for any inconvenience.',
      type: 'warning',
      priority: 'high',
      publishDate: '2024-01-28',
      isRead: true,
      author: 'Technical Team',
      category: 'Maintenance'
    },
    {
      id: 3,
      title: 'New Service Categories Added',
      content: 'We have expanded our service offerings! New categories include Pet Services, Home Cleaning, and Tutoring Services. Explore these new options to find the perfect service providers for your needs.',
      type: 'success',
      priority: 'medium',
      publishDate: '2024-01-25',
      isRead: true,
      author: 'Product Team',
      category: 'Services'
    },
    {
      id: 4,
      title: 'Holiday Season Booking Rush',
      content: 'Due to high demand during the holiday season, we recommend booking your services at least 2 weeks in advance. Popular services like photography and catering are filling up quickly.',
      type: 'info',
      priority: 'medium',
      publishDate: '2024-01-20',
      isRead: false,
      author: 'Customer Success',
      category: 'Booking'
    },
    {
      id: 5,
      title: 'Security Update - Action Required',
      content: 'For your account security, we strongly recommend updating your password and enabling two-factor authentication. This helps protect your personal information and booking history.',
      type: 'warning',
      priority: 'high',
      publishDate: '2024-01-15',
      isRead: true,
      author: 'Security Team',
      category: 'Security'
    },
    {
      id: 6,
      title: 'Customer Satisfaction Survey',
      content: 'Help us improve our services by participating in our quarterly customer satisfaction survey. Your feedback is valuable and helps us enhance your experience on our platform.',
      type: 'info',
      priority: 'low',
      publishDate: '2024-01-10',
      isRead: false,
      author: 'Customer Success',
      category: 'Feedback'
    }
  ]);

  const handleViewDetails = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowModal(true);
    // Mark as read when viewed
    if (!announcement.isRead) {
      announcement.isRead = true;
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAnnouncement(null);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'info':
        return <Info className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Filter announcements
  const filteredAnnouncements = announcements.filter(announcement => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !announcement.isRead;
    if (filter === 'read') return announcement.isRead;
    return announcement.type === filter;
  });

  const unreadCount = announcements.filter(a => !a.isRead).length;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
            <p className="text-sm text-gray-500">
              Stay updated with the latest news and updates
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Announcements' },
              { key: 'unread', label: `Unread (${unreadCount})` },
              { key: 'read', label: 'Read' },
              { key: 'info', label: 'Information' },
              { key: 'warning', label: 'Warnings' },
              { key: 'success', label: 'Updates' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === tab.key
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Announcements List */}
      {filteredAnnouncements.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <Megaphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Announcements</h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'There are no announcements at the moment.' 
              : `No ${filter} announcements found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map((announcement) => (
            <div 
              key={announcement.id} 
              className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md ${
                !announcement.isRead ? 'border-l-4 border-l-emerald-500' : ''
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`p-2 rounded-full ${getTypeColor(announcement.type).replace('text-', 'text-').replace('bg-', 'bg-').replace('border-', '')}`}>
                      {getTypeIcon(announcement.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`text-lg font-semibold text-gray-900 ${
                          !announcement.isRead ? 'font-bold' : ''
                        }`}>
                          {announcement.title}
                          {!announcement.isRead && (
                            <span className="ml-2 w-2 h-2 bg-emerald-500 rounded-full inline-block"></span>
                          )}
                        </h3>
                        <div className="flex gap-2 ml-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(announcement.type)}`}>
                            {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(announcement.priority)}`}>
                            {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {announcement.content.substring(0, 150)}...
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(announcement.publishDate).toLocaleDateString()}</span>
                        </div>
                        <span>•</span>
                        <span>By {announcement.author}</span>
                        <span>•</span>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {announcement.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(announcement)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Read More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for announcement details */}
      {showModal && selectedAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${getTypeColor(selectedAnnouncement.type).replace('text-', 'text-').replace('bg-', 'bg-').replace('border-', '')}`}>
                  {getTypeIcon(selectedAnnouncement.type)}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{selectedAnnouncement.title}</h2>
              </div>
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
                {/* Announcement Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Published: {new Date(selectedAnnouncement.publishDate).toLocaleDateString()}</span>
                  </div>
                  <span>•</span>
                  <span>By {selectedAnnouncement.author}</span>
                  <span>•</span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                    {selectedAnnouncement.category}
                  </span>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(selectedAnnouncement.type)}`}>
                      {selectedAnnouncement.type.charAt(0).toUpperCase() + selectedAnnouncement.type.slice(1)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedAnnouncement.priority)}`}>
                      {selectedAnnouncement.priority.charAt(0).toUpperCase() + selectedAnnouncement.priority.slice(1)} Priority
                    </span>
                  </div>
                </div>

                {/* Announcement Content */}
                <div>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {selectedAnnouncement.content}
                    </p>
                  </div>
                </div>

                {/* Additional Actions or Information */}
                {selectedAnnouncement.type === 'warning' && selectedAnnouncement.priority === 'high' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800 mb-1">Important Notice</h4>
                        <p className="text-sm text-yellow-700">
                          This is a high-priority announcement that may require your attention or action.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
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

export default Announcements;