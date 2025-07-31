import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Megaphone, Calendar, User, AlertCircle, Plus, Trash2, Edit2, X, RefreshCw } from 'lucide-react';
import { ScaleLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const Announcements = () => {
  const { user, userRole } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = userRole === 'admin';
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', priority: 'medium', targetAudience: 'all' });
  const [editingId, setEditingId] = useState(null);

  // Fetch announcements with TanStack Query
  const {
    data: announcements = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/announcements`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch announcements');
      }

      const data = await response.json();
      return data.announcements || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    onError: (error) => {
      toast.error(error.message || 'Failed to load announcements');
    }
  });

  // Add/Update announcement mutation
  const addOrUpdateMutation = useMutation({
    mutationFn: async (announcementData) => {
      const token = await user.getIdToken();
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `${import.meta.env.VITE_API_BASE_URL}/api/announcements/${editingId}` 
        : `${import.meta.env.VITE_API_BASE_URL}/api/announcements`;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(announcementData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit announcement');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success(editingId ? 'Announcement updated!' : 'Announcement added!');
      setShowForm(false);
      setEditingId(null);
      setForm({ title: '', content: '', priority: 'medium', targetAudience: 'all' });
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit announcement');
    }
  });

  // Delete announcement mutation
  const deleteMutation = useMutation({
    mutationFn: async (announcementId) => {
      const token = await user.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/announcements/${announcementId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete announcement');
      }

      return response.json();
    },
    onMutate: async (announcementId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['announcements'] });

      // Snapshot the previous value
      const previousAnnouncements = queryClient.getQueryData(['announcements']);

      // Optimistically update to the new value
      queryClient.setQueryData(['announcements'], (old) =>
        old ? old.filter(announcement => announcement._id !== announcementId) : []
      );

      return { previousAnnouncements };
    },
    onError: (error, announcementId, context) => {
      // Rollback on error
      if (context?.previousAnnouncements) {
        queryClient.setQueryData(['announcements'], context.previousAnnouncements);
      }
      
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to delete announcement',
        icon: 'error',
        confirmButtonColor: '#dc2626',
        customClass: {
          popup: 'rounded-lg',
          confirmButton: 'cursor-pointer'
        }
      });
    },
    onSuccess: () => {
      Swal.fire({
        title: 'Deleted!',
        text: 'The announcement has been deleted successfully.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-lg'
        }
      });
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    addOrUpdateMutation.mutate(form);
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

    if (result.isConfirmed) {
      deleteMutation.mutate(id);
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

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-gradient-to-br from-red-50 to-white rounded-xl border border-red-100">
          <div className="bg-red-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Error Loading Announcements</h3>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            {error.message || 'Failed to load announcements. Please try again.'}
          </p>
          <button
            onClick={() => refetch()}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100">
          <ScaleLoader color="#059669" height={40} width={4} />
          <p className="mt-4 text-gray-700 font-medium">Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center">
            <Megaphone className="w-6 sm:w-8 h-6 sm:h-8 text-emerald-600 mr-3" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Club Announcements</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => refetch()}
              className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
              title="Refresh announcements"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            {isAdmin && (
              <button 
                onClick={() => { 
                  setShowForm(true); 
                  setEditingId(null); 
                  setForm({ title: '', content: '', priority: 'medium', targetAudience: 'all' }); 
                }} 
                className="flex items-center px-3 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Add Announcement</span>
                <span className="sm:hidden">Add</span>
              </button>
            )}
          </div>
        </div>
        <p className="text-gray-600">
          Stay updated with the latest news and announcements from our sports club.
        </p>
      </div>

      {/* Announcements List */}
      {announcements.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-100 p-8 sm:p-12 text-center">
          <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">No Announcements Yet</h3>
          <p className="text-gray-400">
            There are no announcements at the moment. Check back later for updates!
          </p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {announcements.map((announcement) => (
            <div
              key={announcement._id}
              className="bg-white rounded-lg border border-gray-100 p-4 sm:p-6 hover:border-gray-200 transition-colors"
            >
              {/* Announcement Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    {announcement.title}
                  </h2>
                  <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 gap-2 sm:gap-4">
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
                <div className="flex items-center gap-2">
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
              </div>

              {/* Announcement Content */}
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {announcement.content}
                </p>
              </div>

              {/* Announcement Footer */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-500">
                  <span>
                    Target: {announcement.targetAudience === 'all' ? 'All Members' :
                      announcement.targetAudience === 'members' ? 'Club Members Only' :
                        'Users Only'}
                  </span>
                  {announcement.updatedAt !== announcement.createdAt && (
                    <span className="block sm:inline sm:ml-4">
                      Updated: {formatDate(announcement.updatedAt)}
                    </span>
                  )}
                </div>
                {isAdmin && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(announcement)} 
                      className="flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4 mr-1" /> 
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(announcement._id)} 
                      disabled={deleteMutation.isLoading}
                      className="flex items-center px-3 py-1 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleteMutation.isLoading && deleteMutation.variables === announcement._id ? (
                        <ScaleLoader color="#dc2626" height={12} width={2} />
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-1" /> 
                          <span className="hidden sm:inline">Delete</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Announcement Form (Admin Only) */}
      {isAdmin && showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg border border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleAddOrUpdate} className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
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
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
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
                   disabled={addOrUpdateMutation.isLoading}
                 >
                  {addOrUpdateMutation.isLoading ? (
                    <div className="flex items-center">
                      <ScaleLoader color="white" height={16} width={2} />
                      <span className="ml-2">{editingId ? 'Updating...' : 'Adding...'}</span>
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