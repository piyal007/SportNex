import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { HashLoader } from 'react-spinners';

const GlobalLoader = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Skip loading for dashboard routes
    if (location.pathname.startsWith('/dashboard')) {
      setIsLoading(false);
      return;
    }

    // Simulate initial app loading time for non-dashboard routes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds loading time

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <HashLoader
          size={60}
          color="#059669"
          loading={isLoading}
          speedMultiplier={1.2}
        />
      </div>
    );
  }

  return children;
};

export default GlobalLoader;