import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Megaphone, Calendar, User, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Announcements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/announcements');
      
      if (!response.ok) {
        throw new Error('Failed to fetch announcements');
      }
      
      const data = await response.json();
      setAnnouncements(data.announcements || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setError(error.message);
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading announcements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Announcements</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAnnouncements}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Megaphone className="w-8 h-8 text-emerald-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Club Announcements</h1>
        </div>
        <p className="text-gray-600">
          Stay updated with the latest news and announcements from our sports club.
        </p>
      </div>

      {/* Announcements List */}
      {announcements.length === 0 ? (
        <div className="text-center py-12">
          <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">No Announcements Yet</h3>
          <p className="text-gray-400">
            There are no announcements at the moment. Check back later for updates!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {announcements.map((announcement) => (
            <div
              key={announcement._id}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              {/* Announcement Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {announcement.title}
                  </h2>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      <span>By Admin</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(announcement.createdAt)}</span>
                    </div>
                  </div>
                </div>
                {announcement.priority === 'high' && (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    High Priority
                  </span>
                )}
                {announcement.priority === 'medium' && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Medium Priority
                  </span>
                )}
                {announcement.priority === 'low' && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Low Priority
                  </span>
                )}
              </div>

              {/* Announcement Content */}
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {announcement.content}
                </p>
              </div>

              {/* Announcement Footer */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>
                    Target: {announcement.targetAudience === 'all' ? 'All Members' : 
                           announcement.targetAudience === 'members' ? 'Club Members Only' : 
                           'Users Only'}
                  </span>
                  {announcement.updatedAt !== announcement.createdAt && (
                    <span>
                      Updated: {formatDate(announcement.updatedAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Refresh Button */}
      <div className="mt-8 text-center">
        <button
          onClick={fetchAnnouncements}
          className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors inline-flex items-center"
        >
          <Megaphone className="w-4 h-4 mr-2" />
          Refresh Announcements
        </button>
      </div>
    </div>
  );
};

export default Announcements;