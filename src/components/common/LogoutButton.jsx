// src/components/common/LogoutButton.jsx
import React from 'react';
import useAuth from '../../hooks/useAuth';
import Button from './Button';

const LogoutButton = ({ variant = 'secondary', className = '' }) => {
  const { logoutUser, loading } = useAuth();

  const handleLogout = async () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      await logoutUser();
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleLogout}
      disabled={loading}
      className={`font-medium ${className}`}
    >
      {loading ? 'Cerrando...' : 'Cerrar sesión'}
    </Button>
  );
};

export default LogoutButton;