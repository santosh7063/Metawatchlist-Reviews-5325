import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, profile, loading } = useAuth();

  console.log('AdminRoute - User:', user?.email, 'Profile:', profile, 'Loading:', loading);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-green"></div>
          <div className="text-cyber-green font-mono">Loading admin access...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('AdminRoute - No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (!profile?.is_admin) {
    console.log('AdminRoute - Not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('AdminRoute - Admin access granted');
  return children;
};

export default AdminRoute;