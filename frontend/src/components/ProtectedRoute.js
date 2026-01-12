import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false, requireCandidate = false }) => {
  const { isAuthenticated, isAdmin, isCandidate } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/jobs" replace />;
  }

  if (requireCandidate && !isCandidate) {
    return <Navigate to="/admin/jobs" replace />;
  }

  return children;
};

export default ProtectedRoute;
