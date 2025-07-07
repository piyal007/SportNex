import React from 'react'
import { useRouteError, Link } from 'react-router-dom'
import { Home, AlertCircle } from 'lucide-react'

const Error = () => {
  const error = useRouteError()
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <AlertCircle className="mx-auto h-24 w-24 text-red-500" />
        </div>
        
        {/* Error Code */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          {error?.status || '404'}
        </h1>
        
        {/* Error Title */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          {error?.status === 404 ? 'Page Not Found' : 'Something went wrong'}
        </h2>
        
        {/* Error Description */}
        <p className="text-gray-600 mb-8">
          {error?.statusText || error?.message || 
           'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.'}
        </p>
        
        {/* Action Buttons */}
        <div className="space-y-4">
          <Link 
            to="/" 
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 w-full"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Back Home
          </Link>
          
          <button 
            onClick={() => window.history.back()} 
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors duration-200 w-full"
          >
            Go Back
          </button>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-sm text-gray-500">
          <p>If you believe this is an error, please contact support.</p>
        </div>
      </div>
    </div>
  )
}

export default Error;