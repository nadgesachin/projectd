import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsAuthenticated, selectAuthLoading } from '../../features/auth/authSlice';
import Loader from '../common/Loader';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const location = useLocation();

  // Show loader while checking authentication
  if (loading) {
    return <Loader fullScreen text="Checking authentication..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is required, check user role
  if (requiredRole) {
    const user = useSelector((state) => state.auth.user);
    if (user && user.role !== requiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
