// src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Ruta corregida (asumiendo estructura estándar)

const ProtectedRoute = ({ allowedRoles }) => {
  const { auth } = useAuth();

  // Si no hay token, redirige a login
  if (!auth?.accessToken) {
    return <Navigate to="/login" replace />;
  }

  // Si el rol no está permitido, redirige según tipo
  if (!allowedRoles.includes(auth.user?.tipo_usuario)) {
    let redirectPath = '/farmer'; // Default para tipo 1 (farmer) o desconocido
    if (auth.user?.tipo_usuario === 2) redirectPath = '/admin'; // Admin
    if (auth.user?.tipo_usuario === 3) redirectPath = '/login'; // IoT no accede a rutas web; redirige a login
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;