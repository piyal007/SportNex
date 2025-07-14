import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ChevronDown, User, Settings, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import ThemeToggle from '@/components/ThemeToggle'
import useAdminSetupBanner from '@/hooks/useAdminSetupBanner'
import Swal from 'sweetalert2'

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { user, logout, loading, userRole, isAdmin, isMemberOrAdmin } = useAuth()
  const { isBannerVisible } = useAdminSetupBanner()
  const navigate = useNavigate()

  // Default user image if none provided
  const defaultUserImage = "https://i.postimg.cc/yxzXkbkL/avatar.jpg"

  const handleLogin = () => {
    navigate('/login')
  }

  const handleRegister = () => {
    navigate('/register')
  }

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of your account.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    })

    if (result.isConfirmed) {
      try {
        await logout()
        setIsDropdownOpen(false)
        setIsMobileMenuOpen(false)

        Swal.fire({
          title: 'Logged out!',
          text: 'You have been successfully logged out.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
      } catch (error) {
        console.error('Logout error:', error)
        Swal.fire({
          title: 'Error!',
          text: 'An error occurred while logging out. Please try again.',
          icon: 'error',
          confirmButtonColor: '#dc2626'
        })
      }
    }
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className={`fixed left-0 right-0 z-50 bg-background/80 backdrop-blur-md shadow-sm border-b border-border/50 ${isBannerVisible ? 'top-[40px]' : 'top-0'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo and Site Name */}
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="flex-shrink-0 flex items-center">
              <img
                src="https://i.postimg.cc/fbdm9xQ6/SportNex.png"
                alt="SportNex Logo"
                className="w-8 h-8 md:w-10 md:h-10 object-contain"
              />
            </div>
            <div className="text-lg md:text-xl font-bold text-emerald-600 flex items-center">
              SportNex
            </div>
          </div>

          {/* Navigation Links - Hidden on mobile, visible on tablet and up */}
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-4 lg:space-x-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-2 lg:px-3 py-2 text-sm font-medium transition-colors ${isActive
                    ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400 rounded-md'
                    : 'text-foreground hover:text-emerald-600'
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/courts"
                className={({ isActive }) =>
                  `px-2 lg:px-3 py-2 text-sm font-medium transition-colors ${isActive
                    ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400 rounded-md'
                    : 'text-foreground hover:text-emerald-600'
                  }`
                }
              >
                Courts
              </NavLink>
            </div>
          </div>

          {/* Theme Toggle and Login/Profile Section - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <ThemeToggle />
            {!user ? (
              <>
                <Button
                  onClick={handleRegister}
                  variant="outline"
                  className="text-sm px-3 lg:px-4 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                >
                  Register
                </Button>
                <Button
                  onClick={handleLogin}
                  className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800 text-sm px-3 lg:px-4"
                >
                  Login
                </Button>
              </>
            ) : (
              <div className="relative">
                {/* Profile Picture with Dropdown */}
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-1 lg:space-x-2 p-1 rounded-full hover:bg-accent transition-colors cursor-pointer"
                >
                  <img
                    className="h-7 w-7 lg:h-8 lg:w-8 rounded-full object-cover"
                    src={user?.photoURL || defaultUserImage}
                    alt={user?.displayName || 'User'}
                  />
                  <ChevronDown className="h-3 w-3 lg:h-4 lg:w-4 text-gray-500" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 lg:w-56 bg-popover rounded-md shadow-lg ring-1 ring-border z-50">
                    <div className="py-1">
                      {/* User Info - Not Clickable */}
                      <div className="px-3 lg:px-4 py-2 lg:py-3 border-b border-border">
                        <p className="text-xs lg:text-sm font-medium text-popover-foreground">{user?.displayName || 'User'}</p>
                        <p className="text-xs lg:text-sm text-muted-foreground">{user?.email}</p>
                      </div>

                      {/* Dashboard Links */}
                      {(userRole === 'user' || userRole === 'member') && (
                        <NavLink
                          to="/dashboard"
                          className="flex items-center px-3 lg:px-4 py-2 text-xs lg:text-sm text-popover-foreground hover:bg-accent transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Settings className="mr-2 lg:mr-3 h-3 w-3 lg:h-4 lg:w-4" />
                          Dashboard
                        </NavLink>
                      )}

                      {/* Admin Dashboard Link */}
                      {userRole === 'admin' && (
                        <NavLink
                          to="/admin-dashboard"
                          className="flex items-center px-3 lg:px-4 py-2 text-xs lg:text-sm text-popover-foreground hover:bg-accent transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Settings className="mr-2 lg:mr-3 h-3 w-3 lg:h-4 lg:w-4" />
                          Admin Dashboard
                        </NavLink>
                      )}

                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 lg:px-4 py-2 text-xs lg:text-sm text-popover-foreground hover:bg-accent transition-colors cursor-pointer"
                      >
                        <LogOut className="mr-2 lg:mr-3 h-3 w-3 lg:h-4 lg:w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Theme Toggle and Menu button - Only visible on mobile */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={toggleMobileMenu}
              className="text-muted-foreground hover:text-foreground p-2 rounded-md transition-colors cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu - Toggleable on mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="px-4 pt-2 pb-3 space-y-1 bg-background">
            {/* Navigation Links */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block px-3 py-2 text-base font-medium transition-colors ${isActive
                  ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400 rounded-md'
                  : 'text-foreground hover:text-emerald-600 hover:bg-accent'
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/courts"
              className={({ isActive }) =>
                `block px-3 py-2 text-base font-medium transition-colors ${isActive
                  ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400 rounded-md'
                  : 'text-foreground hover:text-emerald-600 hover:bg-accent'
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Courts
            </NavLink>

            {/* Mobile Login/Profile Section */}
            <div className="pt-2 border-t border-border mt-2">
              {!user ? (
                <div className="space-y-2">
                  <Button
                    onClick={() => {
                      handleRegister()
                      setIsMobileMenuOpen(false)
                    }}
                    variant="outline"
                    className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  >
                    Register
                  </Button>
                  <Button
                    onClick={() => {
                      handleLogin()
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
                  >
                    Login
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* User Info */}
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={user?.photoURL || defaultUserImage}
                      alt={user?.displayName || 'User'}
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">{user?.displayName || 'User'}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>

                  {/* Dashboard Links */}
                  {(userRole === 'user' || userRole === 'member') && (
                    <NavLink
                      to="/dashboard"
                      className="flex items-center px-3 py-2 text-base font-medium text-foreground hover:text-emerald-600 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="mr-3 h-5 w-5" />
                      Dashboard
                    </NavLink>
                  )}

                  {/* Admin Dashboard Link */}
                  {userRole === 'admin' && (
                    <NavLink
                      to="/admin-dashboard"
                      className="flex items-center px-3 py-2 text-base font-medium text-foreground hover:text-emerald-600 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="mr-3 h-5 w-5" />
                      Admin Dashboard
                    </NavLink>
                  )}

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center w-full px-3 py-2 text-base font-medium text-foreground hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
