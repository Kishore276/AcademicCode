import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
    <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
    <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
    <p className="mb-6 text-gray-500 dark:text-gray-400">Sorry, the page you are looking for does not exist or has been moved.</p>
    <Link to="/" className="px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-medium shadow-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300">Go Home</Link>
  </div>
);

export default NotFoundPage; 