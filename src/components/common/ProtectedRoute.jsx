import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth'; 

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { auth } = useAuth();

  if (!auth?.accessToken) {
    return <Navigate to="/login" replace />;
  }

  const userRole = auth.user?.tipo_usuario;

  if (!allowedRoles.includes(userRole)) {
    if (userRole === 2) return <Navigate to="/admin" replace />;
    if (userRole === 1) return <Navigate to="/farmer" replace />;
    if (userRole === 3) return <Navigate to="/login" replace />;
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;