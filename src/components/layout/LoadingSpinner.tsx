import React from 'react';

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[40vh]">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500 mb-4"></div>
    <span className="text-primary-600 dark:text-primary-400 font-medium text-lg">Loading...</span>
  </div>
);

export default LoadingSpinner; 