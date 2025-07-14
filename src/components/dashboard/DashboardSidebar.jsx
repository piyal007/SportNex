import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  User,
  Menu,
  X,
  Home,
  LogOut,
  Calendar,
  Megaphone,
  CheckCircle,
  CalendarCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardSidebar = () => {
  const { userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const menuItems = [
    {
      name: 'Home',
      path: '/',
      icon: Home,
      roles: ['user', 'member', 'admin']
    }
  ];

  const filteredMenuItems = menuItems.filter(item =>
    item.roles.includes(userRole)
  );

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="bg-white p-2 rounded-md shadow-md border border-gray-200 cursor-pointer"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-600" />
          ) : (
            <Menu className="w-6 h-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ease-in-out flex flex-col
        lg:translate-x-0 lg:fixed lg:z-40 lg:h-screen
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="p-5 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center">
            <Home className="w-8 h-8 text-emerald-600 mr-3" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
              <p className="text-sm text-gray-500 capitalize">{userRole} Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {/* Home Button */}
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/dashboard'}
                    className={({ isActive }) => `
                      flex items-center px-4 py-3 rounded-lg transition-colors cursor-pointer
                      ${isActive
                        ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-600'
                      }
                    `}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                </li>
              );
            })}

            {/* Show additional menu items only for non-admin users */}
            {userRole !== 'admin' && (
              <>
                {/* My Profile Button */}
                <li>
                  <NavLink
                    to="/dashboard"
                    end={true}
                    className={({ isActive }) => `
                      flex items-center px-4 py-3 rounded-lg transition-colors cursor-pointer
                      ${isActive
                        ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-600'
                      }
                    `}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5 mr-3" />
                    <span className="font-medium">My Profile</span>
                  </NavLink>
                </li>

                {/* Pending Bookings Button */}
                <li>
                  <NavLink
                    to="/dashboard/pending-bookings"
                    className={({ isActive }) => `
                      flex items-center px-4 py-3 rounded-lg transition-colors cursor-pointer
                      ${isActive
                        ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-600'
                      }
                    `}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Calendar className="w-5 h-5 mr-3" />
                    <span className="font-medium">Pending Bookings</span>
                  </NavLink>
                </li>

                {/* Approved Bookings Button - Only for Members */}
                {userRole === 'member' && (
                  <li>
                    <NavLink
                      to="/dashboard/approved-bookings"
                      className={({ isActive }) => `
                        flex items-center px-4 py-3 rounded-lg transition-colors cursor-pointer
                        ${isActive
                          ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-600'
                        }
                      `}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <CheckCircle className="w-5 h-5 mr-3" />
                      <span className="font-medium">Approved Bookings</span>
                    </NavLink>
                  </li>
                )}

                {/* Confirmed Bookings Button - Only for Members */}
                {userRole === 'member' && (
                  <li>
                    <NavLink
                      to="/dashboard/confirmed-bookings"
                      className={({ isActive }) => `
                        flex items-center px-4 py-3 rounded-lg transition-colors cursor-pointer
                        ${isActive
                          ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-600'
                        }
                      `}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <CalendarCheck className="w-5 h-5 mr-3" />
                      <span className="font-medium">Confirmed Bookings</span>
                    </NavLink>
                  </li>
                )}

                {/* Announcements Button */}
                <li>
                  <NavLink
                    to="/dashboard/announcements"
                    className={({ isActive }) => `
                      flex items-center px-4 py-3 rounded-lg transition-colors cursor-pointer
                      ${isActive
                        ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-600'
                      }
                    `}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Megaphone className="w-5 h-5 mr-3" />
                    <span className="font-medium">Announcements</span>
                  </NavLink>
                </li>
              </>
            )}

            {/* Logout Button */}
            <li>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 rounded-lg transition-colors cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span className="font-medium">Logout</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="text-center">
            <p className="text-xs text-gray-500">SportNex Dashboard</p>
            <p className="text-xs text-gray-400 mt-1">© 2025 All rights reserved</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;