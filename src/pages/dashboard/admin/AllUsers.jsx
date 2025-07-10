import React, { useState } from 'react';
import { Search, Eye, Users, UserCheck, UserX, Calendar, X } from 'lucide-react';

const AllUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock users data (all registered users)
  const [users] = useState([
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '+1 (555) 123-4567',
      registrationDate: '2024-01-15',
      userType: 'member',
      totalBookings: 12,
      pendingBookings: 1,
      approvedBookings: 2,
      confirmedBookings: 9,
      totalSpent: 850,
      lastLogin: '2024-01-20',
      status: 'active',
      address: '123 Main St, City, State 12345',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob@example.com',
      phone: '+1 (555) 987-6543',
      registrationDate: '2024-01-10',
      userType: 'member',
      totalBookings: 8,
      pendingBookings: 0,
      approvedBookings: 1,
      confirmedBookings: 7,
      totalSpent: 420,
      lastLogin: '2024-01-18',
      status: 'active',
      address: '456 Oak Ave, City, State 12345',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 3,
      name: 'Carol Davis',
      email: 'carol@example.com',
      phone: '+1 (555) 456-7890',
      registrationDate: '2023-12-20',
      userType: 'member',
      totalBookings: 25,
      pendingBookings: 2,
      approvedBookings: 3,
      confirmedBookings: 20,
      totalSpent: 1250,
      lastLogin: '2024-01-19',
      status: 'active',
      address: '789 Pine Rd, City, State 12345',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 4,
      name: 'David Wilson',
      email: 'david@example.com',
      phone: '+1 (555) 321-0987',
      registrationDate: '2024-01-05',
      userType: 'user',
      totalBookings: 2,
      pendingBookings: 1,
      approvedBookings: 0,
      confirmedBookings: 1,
      totalSpent: 50,
      lastLogin: '2024-01-17',
      status: 'active',
      address: '321 Elm St, City, State 12345',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 5,
      name: 'Emma Brown',
      email: 'emma@example.com',
      phone: '+1 (555) 654-3210',
      registrationDate: '2023-11-15',
      userType: 'member',
      totalBookings: 18,
      pendingBookings: 0,
      approvedBookings: 0,
      confirmedBookings: 18,
      totalSpent: 720,
      lastLogin: '2024-01-12',
      status: 'inactive',
      address: '654 Maple Dr, City, State 12345',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 6,
      name: 'Frank Miller',
      email: 'frank@example.com',
      phone: '+1 (555) 789-0123',
      registrationDate: '2024-01-20',
      userType: 'user',
      totalBookings: 0,
      pendingBookings: 0,
      approvedBookings: 0,
      confirmedBookings: 0,
      totalSpent: 0,
      lastLogin: '2024-01-21',
      status: 'active',
      address: '987 Cedar Ln, City, State 12345',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 7,
      name: 'Grace Lee',
      email: 'grace@example.com',
      phone: '+1 (555) 234-5678',
      registrationDate: '2024-01-08',
      userType: 'user',
      totalBookings: 1,
      pendingBookings: 1,
      approvedBookings: 0,
      confirmedBookings: 0,
      totalSpent: 0,
      lastLogin: '2024-01-16',
      status: 'active',
      address: '246 Birch Ave, City, State 12345',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    }
  ]);

  const openViewModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || user.userType === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getUserTypeBadge = (userType) => {
    const typeClasses = {
      member: 'bg-blue-100 text-blue-800 border-blue-200',
      user: 'bg-purple-100 text-purple-800 border-purple-200'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${typeClasses[userType]}`}>
        {userType.charAt(0).toUpperCase() + userType.slice(1)}
      </span>
    );
  };

  const totalUsers = users.length;
  const totalMembers = users.filter(u => u.userType === 'member').length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const totalRevenue = users.reduce((sum, u) => sum + u.totalSpent, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Users</h1>
        <p className="text-gray-600">View and search all registered users in the system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Members</p>
              <p className="text-2xl font-bold text-gray-900">{totalMembers}</p>
            </div>
            <UserCheck className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
            </div>
            <UserCheck className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
            </div>
            <UserCheck className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search users by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            >
              <option value="all">All Users</option>
              <option value="member">Members Only</option>
              <option value="user">Regular Users</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={user.image}
                          alt={user.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.registrationDate}</div>
                    <div className="text-sm text-gray-500">Last: {user.lastLogin}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getUserTypeBadge(user.userType)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Total: {user.totalBookings}</div>
                    <div className="text-sm text-gray-500">Pending: {user.pendingBookings}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${user.totalSpent}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openViewModal(user)}
                      className="text-blue-600 hover:text-blue-900 cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No users have been registered yet.'}
            </p>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">User Details</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Profile Section */}
                <div className="flex items-center space-x-4">
                  <img
                    className="h-20 w-20 rounded-full object-cover"
                    src={selectedUser.image}
                    alt={selectedUser.name}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h3>
                    <p className="text-gray-600">{selectedUser.email}</p>
                    <div className="mt-1 flex space-x-2">
                      {getStatusBadge(selectedUser.status)}
                      {getUserTypeBadge(selectedUser.userType)}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-gray-900">{selectedUser.phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-500">Address</label>
                      <p className="text-gray-900">{selectedUser.address}</p>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Account Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Registration Date</label>
                      <p className="text-gray-900">{selectedUser.registrationDate}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Last Login</label>
                      <p className="text-gray-900">{selectedUser.lastLogin}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">User Type</label>
                      <p className="text-gray-900">{selectedUser.userType.charAt(0).toUpperCase() + selectedUser.userType.slice(1)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Account Status</label>
                      <p className="text-gray-900">{selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}</p>
                    </div>
                  </div>
                </div>

                {/* Booking Statistics */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Booking Statistics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-600">{selectedUser.totalBookings}</p>
                      <p className="text-sm text-blue-600">Total</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-yellow-600">{selectedUser.pendingBookings}</p>
                      <p className="text-sm text-yellow-600">Pending</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-600">{selectedUser.approvedBookings}</p>
                      <p className="text-sm text-green-600">Approved</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-purple-600">{selectedUser.confirmedBookings}</p>
                      <p className="text-sm text-purple-600">Confirmed</p>
                    </div>
                  </div>
                  <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total Amount Spent:</span>
                      <span className="text-lg font-bold text-green-600">${selectedUser.totalSpent}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;