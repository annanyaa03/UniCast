import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useSelector((s) => s.auth);
  if (loading) return null;
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
