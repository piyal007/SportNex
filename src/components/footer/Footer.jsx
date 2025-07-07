import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-md shadow-sm border-t border-gray-200/50 py-6 mt-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-gray-800">Court Booking App</h3>
            <p className="text-sm text-gray-600 mt-1">© {new Date().getFullYear()} All rights reserved</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
