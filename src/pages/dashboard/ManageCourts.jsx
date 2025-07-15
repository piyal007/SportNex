import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { ScaleLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';

const initialCourt = { name: '', type: '', pricePerSession: '', capacity: '', location: '', image: '', availableSlots: '' };

const ManageCourts = () => {
  const { user } = useAuth();
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [courtForm, setCourtForm] = useState(initialCourt);
  const [submitting, setSubmitting] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/courts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setCourts(data.data || []);
    } catch (err) {
      toast.error('Failed to load courts');
    } finally {
      setLoading(false);
    }
  };

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
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
    if (!result.isConfirmed) return;
    setSubmitting(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/courts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Court deleted');
        fetchCourts();
      } else {
        toast.error('Failed to delete court');
      }
    } catch {
      toast.error('Error deleting court');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormChange = (e) => {
    setCourtForm({ ...courtForm, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = await user.getIdToken();
      const url = editMode
        ? `${import.meta.env.VITE_API_BASE_URL}/api/courts/${selectedId}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/courts`;
      const method = editMode ? 'PUT' : 'POST';
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
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success(editMode ? 'Court updated' : 'Court added');
        setModalOpen(false);
        fetchCourts();
      } else {
        toast.error('Failed to save court');
      }
    } catch {
      toast.error('Error saving court');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-2 sm:p-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-extrabold flex items-center gap-2 text-emerald-700">
          <CheckCircle className="w-7 h-7" /> Manage Courts
        </h2>
        <button
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition cursor-pointer"
          onClick={openAddModal}
        >
          <Plus className="w-5 h-5" /> Add Court
        </button>
      </div>
      {loading ? (
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
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 rounded hover:bg-red-200 text-red-600 cursor-pointer"
                        onClick={() => handleDelete(court._id)}
                        title="Delete"
                        disabled={submitting}
                      >
                        {submitting && selectedId === court._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
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
              />
              <input
                type="text"
                name="type"
                placeholder="Court Type (e.g. Tennis)"
                value={courtForm.type}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-200"
                required
              />
              <input
                type="number"
                name="pricePerSession"
                placeholder="Price per session"
                value={courtForm.pricePerSession}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-200"
                required
              />
              <input
                type="number"
                name="capacity"
                placeholder="Capacity"
                value={courtForm.capacity}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-200"
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={courtForm.location}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-200"
                required
              />
              <input
                type="text"
                name="availableSlots"
                placeholder="Available Slots (comma separated)"
                value={courtForm.availableSlots}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-200"
                required
              />
              <input
                type="text"
                name="image"
                placeholder="Image URL"
                value={courtForm.image}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-200"
                required
              />
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-2"
                disabled={submitting}
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (editMode ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />)}
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