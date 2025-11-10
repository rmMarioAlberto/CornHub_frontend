// src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { auth } = useAuth();

  // 1. Sin token → login
  if (!auth?.accessToken) {
    return <Navigate to="/login" replace />;
  }

  const userRole = auth.user?.tipo_usuario;

  // 2. Rol no permitido → redirigir según rol
  if (!allowedRoles.includes(userRole)) {
    if (userRole === 2) return <Navigate to="/admin" replace />;     // Admin
    if (userRole === 1) return <Navigate to="/farmer" replace />;    // Farmer
    if (userRole === 3) return <Navigate to="/login" replace />;     // IoT → no web
    return <Navigate to="/login" replace />; // Default
  }

  // 3. Acceso permitido
  return <Outlet />;
};

export default ProtectedRoute;