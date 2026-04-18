import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NotFound = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  const getHomeLink = () => {
    if (!isAuthenticated) return '/login';
    return isAdmin ? '/admin/dashboard' : '/student/dashboard';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-12 h-12 text-red-600" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to={getHomeLink()}
          className="btn-primary inline-flex items-center"
        >
          <Home className="w-5 h-5 mr-2" />
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
