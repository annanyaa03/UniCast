import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }) => {
  const { user, token } = useSelector((s) => s.auth);
  if (!token) return <Navigate to="/login" replace />;
  if (user?.user_metadata?.role !== 'admin' && user?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

export default AdminRoute;
