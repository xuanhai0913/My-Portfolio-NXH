import { useEffect } from 'react';
import { updateMetaTags, generateStructuredData } from '../utils/metaTags';

// Custom hook for managing meta tags in React components
export const useMetaTags = (pageName, customMeta = {}) => {
  useEffect(() => {
    // Update meta tags when component mounts or pageName changes
    updateMetaTags(pageName);
    
    // Generate structured data
    generateStructuredData(pageName, customMeta);
    
    // Cleanup function to reset to default meta tags when component unmounts
    return () => {
      if (pageName !== 'home') {
        updateMetaTags('home');
        generateStructuredData('home');
      }
    };
  }, [pageName, customMeta]);
};

// HOC for adding meta tags to components
export const withMetaTags = (WrappedComponent, pageName, customMeta = {}) => {
  return function MetaTagsWrapper(props) {
    useMetaTags(pageName, customMeta);
    return <WrappedComponent {...props} />;
  };
};

export default useMetaTags;
