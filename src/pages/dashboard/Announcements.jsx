import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Megaphone, Calendar, User, AlertCircle, Plus, Trash2, Edit2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const Announcements = () => {
  const { user, userRole } = useAuth();
  const isAdmin = userRole === 'admin';
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', priority: 'medium', targetAudience: 'all' });
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = await user.getIdToken();
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `http://localhost:3000/api/announcements/${editingId}` : 'http://localhost:3000/api/announcements';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to submit announcement');
      toast.success(editingId ? 'Announcement updated!' : 'Announcement added!');
      setShowForm(false);
      setEditingId(null);
      setForm({ title: '', content: '', priority: 'medium', targetAudience: 'all' });
      fetchAnnouncements();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (announcement) => {
    setForm({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      targetAudience: announcement.targetAudience
    });
    setEditingId(announcement._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This announcement will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-lg',
        confirmButton: 'cursor-pointer',
        cancelButton: 'cursor-pointer'
      }
    });

    if (!result.isConfirmed) return;

    try {
      const token = await user.getIdToken();
      const res = await fetch(`http://localhost:3000/api/announcements/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete announcement');
      
      await Swal.fire({
        title: 'Deleted!',
        text: 'The announcement has been deleted successfully.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-lg'
        }
      });
      
      fetchAnnouncements();
    } catch (err) {
      await Swal.fire({
        title: 'Error!',
        text: err.message || 'Failed to delete announcement',
        icon: 'error',
        confirmButtonColor: '#dc2626',
        customClass: {
          popup: 'rounded-lg',
          confirmButton: 'cursor-pointer'
        }
      });
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
            className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 cursor-pointer"
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
          {isAdmin && (
            <button onClick={() => { setShowForm(true); setEditingId(null); setForm({ title: '', content: '', priority: 'medium', targetAudience: 'all' }); }} className="ml-4 bg-emerald-500 text-white px-3 py-1 rounded-md hover:bg-emerald-600 flex items-center cursor-pointer">
              <Plus className="w-4 h-4 mr-1" /> Add Announcement
            </button>
          )}
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
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div
              key={announcement._id}
              className="bg-white rounded-lg border border-gray-100 p-6 hover:border-gray-200"
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
                  <span className="bg-red-50 text-red-600 text-xs font-medium px-2.5 py-0.5 rounded-md">
                    High Priority
                  </span>
                )}
                {announcement.priority === 'medium' && (
                  <span className="bg-yellow-50 text-yellow-600 text-xs font-medium px-2.5 py-0.5 rounded-md">
                    Medium Priority
                  </span>
                )}
                {announcement.priority === 'low' && (
                  <span className="bg-green-50 text-green-600 text-xs font-medium px-2.5 py-0.5 rounded-md">
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
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <span>
                    Target: {announcement.targetAudience === 'all' ? 'All Members' :
                      announcement.targetAudience === 'members' ? 'Club Members Only' :
                        'Users Only'}
                  </span>
                  {announcement.updatedAt !== announcement.createdAt && (
                    <span className="ml-4">
                      Updated: {formatDate(announcement.updatedAt)}
                    </span>
                  )}
                </div>
                {isAdmin && (
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(announcement)} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-100 flex items-center cursor-pointer">
                      <Edit2 className="w-4 h-4 mr-1" /> Edit
                    </button>
                    <button onClick={() => handleDelete(announcement._id)} className="bg-red-50 text-red-700 px-3 py-1 rounded-md hover:bg-red-100 flex items-center cursor-pointer">
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Refresh Button */}
      <div className="mt-8 text-center">
        <button
          onClick={fetchAnnouncements}
          className="bg-emerald-500 text-white px-6 py-2 rounded-md hover:bg-emerald-600 inline-flex items-center cursor-pointer"
        >
          <Megaphone className="w-4 h-4 mr-2" />
          Refresh Announcements
        </button>
      </div>
      {/* Modal for Announcement Form (Admin Only) */}
      {isAdmin && showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg border border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleAddOrUpdate} className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingId ? 'Edit Announcement' : 'Add New Announcement'}
                </h2>
                <button 
                  type="button" 
                  onClick={() => { 
                    setShowForm(false); 
                    setEditingId(null); 
                    setForm({ title: '', content: '', priority: 'medium', targetAudience: 'all' }); 
                  }} 
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input 
                    name="title" 
                    value={form.title} 
                    onChange={handleInputChange} 
                    required 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
                    placeholder="Enter announcement title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea 
                    name="content" 
                    value={form.content} 
                    onChange={handleInputChange} 
                    required 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
                    rows={4}
                    placeholder="Enter announcement content"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select 
                      name="priority" 
                      value={form.priority} 
                      onChange={handleInputChange} 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent cursor-pointer"
                    >
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                    <select 
                      name="targetAudience" 
                      value={form.targetAudience} 
                      onChange={handleInputChange} 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent cursor-pointer"
                    >
                      <option value="all">All Members</option>
                      <option value="members">Club Members Only</option>
                      <option value="users">Users Only</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button 
                   type="button" 
                   onClick={() => { 
                     setShowForm(false); 
                     setEditingId(null); 
                     setForm({ title: '', content: '', priority: 'medium', targetAudience: 'all' }); 
                   }}
                   className="px-4 py-2 text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit" 
                   className="px-6 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                   disabled={submitting}
                 >
                  {submitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {editingId ? 'Updating...' : 'Adding...'}
                    </div>
                  ) : (
                    editingId ? 'Update Announcement' : 'Add Announcement'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Announcements;