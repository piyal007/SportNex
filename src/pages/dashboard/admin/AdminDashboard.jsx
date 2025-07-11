import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  User,
  Calendar,
  Users,
  UserCheck,
  Building,
  CreditCard,
  Ticket,
  Megaphone,
  Home,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Admin Profile',
      path: '/admin-dashboard/profile',
      icon: User
    },
    {
      name: 'Manage Bookings',
      path: '/admin-dashboard/manage-bookings',
      icon: Calendar
    },
    {
      name: 'Manage Members',
      path: '/admin-dashboard/manage-members',
      icon: UserCheck
    },
    {
      name: 'All Users',
      path: '/admin-dashboard/all-users',
      icon: Users
    },
    {
      name: 'Manage Courts',
      path: '/admin-dashboard/manage-courts',
      icon: Building
    },
    {
      name: 'Confirmed Bookings',
      path: '/admin-dashboard/confirmed-bookings',
      icon: CreditCard
    },
    {
      name: 'Manage Coupons',
      path: '/admin-dashboard/manage-coupons',
      icon: Ticket
    },
    {
      name: 'Announcements',
      path: '/admin-dashboard/announcements',
      icon: Megaphone
    }
  ];

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('Logout clicked');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 cursor-pointer
                  ${isActive 
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <NavLink
            to="/"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
          >
            <Home className="h-5 w-5" />
            <span className="font-medium">Back to Home</span>
          </NavLink>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-100 cursor-pointer"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;