// src/components/admin/AdminHeader.jsx
import React from 'react';
import Header from '../common/Header';
import LogoutButton from '../common/LogoutButton';
import useAuth from '../../hooks/useAuth';

const AdminHeader = () => {
  const { auth } = useAuth();

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
      <div className="flex items-center gap-6">
        <span className="hidden lg:block text-sm opacity-90">
          Hola, {auth.user?.nombre?.split(' ')[0] || 'Admin'}
        </span>
        <LogoutButton variant="tertiary" />
      </div>
    </Header>
  );
};

export default AdminHeader;