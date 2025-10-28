// src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '/src/hooks/useAuth';

const ProtectedRoute = ({ allowedRoles }) => {
  const { auth } = useAuth();

  // Si no hay token, redirige a login
  if (!auth?.accessToken) {
    return <Navigate to="/login" replace />;
  }

  // Si el rol no está permitido, redirige según tipo
  if (!allowedRoles.includes(auth.user?.tipo_usuario)) {
    const redirectPath = auth.user?.tipo_usuario === 1 ? '/admin' : '/farmer';
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;