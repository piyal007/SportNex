import { useEffect } from 'react';

/**
 * Custom hook to dynamically set the document title
 * @param {string} title - The title to set for the page
 * @param {string} suffix - Optional suffix to append (defaults to 'SportNex')
 */
const useTitle = (title, suffix = 'SportNex') => {
  useEffect(() => {
    if (title) {
      document.title = `${title} | ${suffix}`;
    } else {
      document.title = suffix;
    }

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = suffix;
    };
  }, [title, suffix]);
};

export default useTitle;