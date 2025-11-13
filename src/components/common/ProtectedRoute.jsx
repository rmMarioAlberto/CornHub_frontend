// src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { auth, loading } = useAuth();

  // 1. Aún cargando desde localStorage
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-600">Verificando sesión...</p>
      </div>
    );
  }

  // 2. No hay token → login
  if (!auth?.accessToken) {
    return <Navigate to="/login" replace />;
  }

  // 3. Rol no permitido
  const userRole = auth.user?.tipo_usuario;
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    const redirectMap = {
      2: '/admin',
      1: '/farmer',
    };
    return <Navigate to={redirectMap[userRole] || '/login'} replace />;
  }

  // 4. Todo bien → renderizar rutas hijas
  return <Outlet />;
};

export default ProtectedRoute;