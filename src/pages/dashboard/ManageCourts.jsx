import { useState } from 'react';
import { Plus, Edit, Trash2, Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { ScaleLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const initialCourt = { name: '', type: '', pricePerSession: '', capacity: '', location: '', image: '', availableSlots: '' };

const ManageCourts = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [courtForm, setCourtForm] = useState(initialCourt);
  const [selectedId, setSelectedId] = useState(null);

  // Fetch courts with TanStack Query
  const {
    data: courts = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['courts'],
    queryFn: async () => {
      const token = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/courts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch courts');
      }
      
      const data = await res.json();
      return data.data || [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    onError: (error) => {
      toast.error('Failed to load courts');
      console.error('Error fetching courts:', error);
    }
  });

  // Add court mutation
  const addCourtMutation = useMutation({
    mutationFn: async (courtData) => {
      const token = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/courts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(courtData)
      });
      
      if (!res.ok) {
        throw new Error('Failed to add court');
      }
      
      return res.json();
    },
    onSuccess: () => {
      toast.success('Court added successfully');
      setModalOpen(false);
      setCourtForm(initialCourt);
      queryClient.invalidateQueries({ queryKey: ['courts'] });
    },
    onError: (error) => {
      toast.error('Failed to add court');
      console.error('Error adding court:', error);
    }
  });

  // Update court mutation
  const updateCourtMutation = useMutation({
    mutationFn: async ({ id, courtData }) => {
      const token = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/courts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(courtData)
      });
      
      if (!res.ok) {
        throw new Error('Failed to update court');
      }
      
      return res.json();
    },
    onSuccess: () => {
      toast.success('Court updated successfully');
      setModalOpen(false);
      setCourtForm(initialCourt);
      setSelectedId(null);
      queryClient.invalidateQueries({ queryKey: ['courts'] });
    },
    onError: (error) => {
      toast.error('Failed to update court');
      console.error('Error updating court:', error);
    }
  });

  // Delete court mutation
  const deleteCourtMutation = useMutation({
    mutationFn: async (id) => {
      const token = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/courts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) {
        throw new Error('Failed to delete court');
      }
      
      return res.json();
    },
    onMutate: async (deletedId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['courts'] });
      
      // Snapshot the previous value
      const previousCourts = queryClient.getQueryData(['courts']);
      
      // Optimistically update to the new value
      queryClient.setQueryData(['courts'], (old) => 
        old?.filter(court => court._id !== deletedId) || []
      );
      
      return { previousCourts };
    },
    onSuccess: () => {
      toast.success('Court deleted successfully');
    },
    onError: (error, deletedId, context) => {
      // Rollback on error
      queryClient.setQueryData(['courts'], context.previousCourts);
      toast.error('Failed to delete court');
      console.error('Error deleting court:', error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['courts'] });
    }
  });

  const openAddModal = () => {
    setCourtForm(initialCourt);
    setEditMode(false);
    setModalOpen(true);
    setSelectedId(null);
  };

  const openEditModal = (court) => {
    setCourtForm({
      name: court.name || '',
      type: court.type || '',
      pricePerSession: court.pricePerSession || '',
      capacity: court.capacity || '',
      location: court.location || '',
      image: court.image || '',
      availableSlots: (court.availableSlots || []).join(', ')
    });
    setEditMode(true);
    setModalOpen(true);
    setSelectedId(court._id);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#10b981',
      confirmButtonText: 'Yes, delete it!'
    });
    
    if (result.isConfirmed) {
      deleteCourtMutation.mutate(id);
    }
  };

  const handleFormChange = (e) => {
    setCourtForm({ ...courtForm, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare backend-compatible payload
    const payload = {
      name: courtForm.name,
      type: courtForm.type,
      pricePerSession: courtForm.pricePerSession,
      capacity: courtForm.capacity,
      location: courtForm.location,
      image: courtForm.image,
      availableSlots: courtForm.availableSlots.split(',').map(s => s.trim()).filter(Boolean)
    };

    if (editMode) {
      updateCourtMutation.mutate({ id: selectedId, courtData: payload });
    } else {
      addCourtMutation.mutate(payload);
    }
  };

  const isSubmitting = addCourtMutation.isPending || updateCourtMutation.isPending;

  if (error) {
    return (
      <div className="p-2 sm:p-4 max-w-7xl mx-auto">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Error loading courts: {error.message}</p>
          <button
            onClick={() => refetch()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-extrabold flex items-center gap-2 text-emerald-700">
          <CheckCircle className="w-7 h-7" /> Manage Courts
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition cursor-pointer"
            disabled={isLoading}
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition cursor-pointer"
            onClick={openAddModal}
          >
            <Plus className="w-5 h-5" /> Add Court
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <ScaleLoader color="#10b981" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow border border-gray-100 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-emerald-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">Slots</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">Image</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {courts.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-400">No courts found</td></tr>
              ) : (
                courts.map((court, idx) => (
                  <tr key={court._id} className={`transition ${idx % 2 === 0 ? 'bg-emerald-50' : 'bg-white'} hover:bg-emerald-100`}>
                    <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{court.name}</td>
                    <td className="px-4 py-3 text-gray-700 capitalize whitespace-nowrap">{court.type}</td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">${court.pricePerSession}</td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap max-w-xs">
                      <select className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none cursor-pointer">
                        {Array.isArray(court.availableSlots) && court.availableSlots.length > 0 ? court.availableSlots.map((slot, i) => (
                          <option key={i} value={slot}>{slot}</option>
                        )) : <option>No slots</option>}
                      </select>
                    </td>
                    <td className="px-4 py-3"><img src={court.image} alt="court" className="w-16 h-10 object-cover rounded shadow" /></td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        className="p-2 rounded hover:bg-emerald-200 text-emerald-700 cursor-pointer"
                        onClick={() => openEditModal(court)}
                        title="Edit"
                        disabled={deleteCourtMutation.isPending}
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 rounded hover:bg-red-200 text-red-600 cursor-pointer"
                        onClick={() => handleDelete(court._id)}
                        title="Delete"
                        disabled={deleteCourtMutation.isPending}
                      >
                        {deleteCourtMutation.isPending && deleteCourtMutation.variables === court._id ? 
                          <Loader2 className="w-5 h-5 animate-spin" /> : 
                          <Trash2 className="w-5 h-5" />
                        }
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Add/Edit Court */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer"
              onClick={() => setModalOpen(false)}
              disabled={isSubmitting}
            >
              <XCircle className="w-6 h-6" />
            </button>
            <h3 className="text-lg font-bold mb-4 text-emerald-700 flex items-center gap-2">
              {editMode ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />} {editMode ? 'Edit Court' : 'Add Court'}
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Court Name"
                value={courtForm.name}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-200"
                required
                disabled={isSubmitting}
              />
              <input
                type="text"
                name="type"
                placeholder="Court Type (e.g. Tennis)"
                value={courtForm.type}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-200"
                required
                disabled={isSubmitting}
              />
              <input
                type="number"
                name="pricePerSession"
                placeholder="Price per session"
                value={courtForm.pricePerSession}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-200"
                required
                disabled={isSubmitting}
              />
              <input
                type="number"
                name="capacity"
                placeholder="Capacity"
                value={courtForm.capacity}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-200"
                required
                disabled={isSubmitting}
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={courtForm.location}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-200"
                required
                disabled={isSubmitting}
              />
              <input
                type="text"
                name="availableSlots"
                placeholder="Available Slots (comma separated)"
                value={courtForm.availableSlots}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-200"
                required
                disabled={isSubmitting}
              />
              <input
                type="text"
                name="image"
                placeholder="Image URL"
                value={courtForm.image}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-200"
                required
                disabled={isSubmitting}
              />
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (editMode ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />)}
                {editMode ? 'Update Court' : 'Add Court'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCourts;