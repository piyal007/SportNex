import { useState, useEffect } from 'react';
import { ScaleLoader } from 'react-spinners';
import { User, X, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';

const ManageMembers = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/members`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMembers(data.members || []);
      } else {
        toast.error('Failed to load members');
      }
    } catch (error) {
      toast.error('Error loading members');
    }
    setLoading(false);
  };

  const handleDelete = async (memberId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      setDeletingId(memberId);
      try {
        const token = await user.getIdToken();
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/members/${memberId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          await Swal.fire({
            title: "Deleted!",
            text: "Member has been deleted successfully.",
            icon: "success"
          });
          setMembers(prev => prev.filter(m => m._id !== memberId));
        } else {
          toast.error('Failed to delete member');
        }
      } catch (error) {
        toast.error('Error deleting member');
      }
      setDeletingId(null);
    }
  };

  const filteredMembers = members.filter(member =>
    member.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 max-w-3xl mx-auto w-full">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><User className="w-6 h-6" /> Manage Members</h2>
      <div className="mb-4 flex items-center gap-2">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search member by name..."
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <ScaleLoader color="#10b981" />
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center text-gray-500">No members found.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMembers.map(member => (
                <tr key={member._id}>
                  <td className="px-4 py-2 whitespace-nowrap">{member.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{member.email}</td>
                  <td className="px-4 py-2 whitespace-nowrap capitalize">{member.role}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded cursor-pointer flex items-center gap-1 disabled:opacity-50"
                      onClick={() => handleDelete(member._id)}
                      disabled={deletingId === member._id}
                    >
                      <X className="w-4 h-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageMembers;