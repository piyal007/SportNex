import React from 'react';
import { Megaphone, Calendar, Clock } from 'lucide-react';

// Replace with TanStack Query and your API logic
const mockAnnouncements = [
  { 
    id: 1, 
    title: 'Club Renovation Notice', 
    message: 'The club will be closed for renovation on June 15th. We apologize for any inconvenience and appreciate your understanding.',
    date: '2024-06-01',
    priority: 'high'
  },
  { 
    id: 2, 
    title: 'New Squash Court Available', 
    message: 'We are excited to announce that a new squash court is now available for booking. Book your sessions today!',
    date: '2024-05-28',
    priority: 'medium'
  },
  { 
    id: 3, 
    title: 'Summer Tournament Registration', 
    message: 'Registration for the annual summer tournament is now open. Limited spots available. Register before June 30th.',
    date: '2024-05-25',
    priority: 'low'
  },
];

const Announcements = () => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (mockAnnouncements.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <Megaphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Announcements</h3>
          <p className="text-gray-500">There are no announcements at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Club Announcements</h2>
        <p className="text-gray-600 text-sm sm:text-base">Stay updated with the latest club news and updates</p>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {mockAnnouncements.map((announcement) => (
          <div key={announcement.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
            {/* Header */}
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <Megaphone className="w-5 h-5 text-emerald-600 mt-0.5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{announcement.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(announcement.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                    getPriorityColor(announcement.priority)
                  }`}>
                    {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)} Priority
                  </span>
                </div>
              </div>
              
              {/* Message */}
              <div className="pl-8 sm:pl-8">
                <p className="text-gray-700 leading-relaxed">{announcement.message}</p>
              </div>
            </div>
            
            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>Posted {Math.floor((new Date() - new Date(announcement.date)) / (1000 * 60 * 60 * 24))} days ago</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;