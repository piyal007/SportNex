import React, { useState } from 'react'
import { Button } from '../ui/button'
import { ButtonSpinner } from '../ui'
import { ChevronDown, User, Settings, LogOut, Menu, X } from 'lucide-react'

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false) // This will be replaced with actual auth state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  
  // Mock user data - will be replaced with actual user context
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  }

  const handleLogin = () => {
    setIsLoggingIn(true)
    // Simulate API call delay
    setTimeout(() => {
      setIsLoggedIn(true)
      setIsLoggingIn(false)
    }, 2000)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setIsDropdownOpen(false)
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo and Site Name */}
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg md:text-xl">SC</span>
              </div>
            </div>
            <div className="text-lg md:text-xl font-bold text-gray-900">
              Sports Club
            </div>
          </div>

          {/* Navigation Links - Hidden on mobile, visible on tablet and up */}
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-4 lg:space-x-8">
              <a href="/" className="text-gray-900 hover:text-blue-600 px-2 lg:px-3 py-2 text-sm font-medium transition-colors">
                Home
              </a>
              <a href="/courts" className="text-gray-900 hover:text-blue-600 px-2 lg:px-3 py-2 text-sm font-medium transition-colors">
                Courts
              </a>
            </div>
          </div>

          {/* Login/Profile Section - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {!isLoggedIn ? (
              <Button 
                onClick={handleLogin} 
                disabled={isLoggingIn}
                className="bg-blue-600 hover:bg-blue-700 text-sm px-3 lg:px-4 disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <>
                    <ButtonSpinner className="mr-2" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            ) : (
              <div className="relative">
                {/* Profile Picture with Dropdown */}
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-1 lg:space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <img
                    className="h-7 w-7 lg:h-8 lg:w-8 rounded-full object-cover"
                    src={user.image}
                    alt={user.name}
                  />
                  <ChevronDown className="h-3 w-3 lg:h-4 lg:w-4 text-gray-500" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 lg:w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      {/* User Info - Not Clickable */}
                      <div className="px-3 lg:px-4 py-2 lg:py-3 border-b border-gray-100">
                        <p className="text-xs lg:text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs lg:text-sm text-gray-500">{user.email}</p>
                      </div>
                      
                      {/* Dashboard Link */}
                      <a
                        href="/dashboard"
                        className="flex items-center px-3 lg:px-4 py-2 text-xs lg:text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Settings className="mr-2 lg:mr-3 h-3 w-3 lg:h-4 lg:w-4" />
                        Dashboard
                      </a>
                      
                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 lg:px-4 py-2 text-xs lg:text-sm text-gray-700 hover:bg-gray-100 transition-colors"
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

          {/* Mobile menu button - Only visible on mobile */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMobileMenu}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-md transition-colors"
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
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 pt-2 pb-3 space-y-1 bg-gray-50">
            {/* Navigation Links */}
            <a 
               href="/" 
               className="text-gray-900 hover:text-blue-600 block px-3 py-2 text-base font-medium transition-colors"
               onClick={() => setIsMobileMenuOpen(false)}
             >
               Home
             </a>
             <a 
               href="/courts" 
               className="text-gray-900 hover:text-blue-600 block px-3 py-2 text-base font-medium transition-colors"
               onClick={() => setIsMobileMenuOpen(false)}
             >
               Courts
             </a>
             <a 
               href="/spinner-demo" 
               className="text-gray-900 hover:text-blue-600 block px-3 py-2 text-base font-medium transition-colors"
               onClick={() => setIsMobileMenuOpen(false)}
             >
               Spinners
             </a>
            
            {/* Mobile Login/Profile Section */}
            <div className="pt-2 border-t border-gray-200 mt-2">
              {!isLoggedIn ? (
                 <Button 
                   onClick={() => {
                     handleLogin()
                     setIsMobileMenuOpen(false)
                   }} 
                   disabled={isLoggingIn}
                   className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                 >
                   {isLoggingIn ? (
                     <>
                       <ButtonSpinner className="mr-2" />
                       Logging in...
                     </>
                   ) : (
                     'Login'
                   )}
                 </Button>
              ) : (
                <div className="space-y-2">
                  {/* User Info */}
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={user.image}
                      alt={user.name}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  
                  {/* Dashboard Link */}
                  <a
                    href="/dashboard"
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="mr-3 h-5 w-5" />
                    Dashboard
                  </a>
                  
                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 transition-colors"
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
