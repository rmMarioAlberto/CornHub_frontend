// src/components/admin/AdminHeader.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import LogoutButton from '../common/LogoutButton';
import useAuth from '../../hooks/useAuth';
import BackButton from '../common/BackButton';

const AdminHeader = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Mi Perfil', link: '/admin/profile' },
    { label: 'Crear Cultivos', link: '/admin/create-crop' },
    { label: 'Usuarios', link: '/admin/users' },
    { label: 'IoT', link: '/admin/iot' },
  ];

  return (
    <Header
      navItems={navItems}
      logoSrc="/assets/images/lettucecirity-icono.png"
      bgColor="bg-[#1A1A1A]"
      className="text-white border-none shadow-none"
    >
      <div className="flex items-center gap-4">
        <span className="hidden lg:block text-sm opacity-90">
          Hola, {auth.user?.nombre?.split(' ')[0] || 'Admin'}
        </span>
        {/* Botón Regresar */}
        <div>
          <BackButton />
        </div>
        <LogoutButton variant="tertiary" />
      </div>
    </Header>
  );
};

export default AdminHeader;