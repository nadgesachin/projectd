import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsAuthenticated, selectAuthLoading } from '../../features/auth/authSlice';
import Loader from '../common/Loader';

const PublicRoute = ({ children, restricted = false }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const location = useLocation();

  // Show loader while checking authentication
  if (loading) {
    return <Loader fullScreen text="Loading..." />;
  }

  // If route is restricted and user is authenticated, redirect to home
  if (restricted && isAuthenticated) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return children;
};

export default PublicRoute;
