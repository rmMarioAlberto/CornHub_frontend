// src/components/admin/AdminHeader.jsx
import React from 'react';
import Header from '../common/Header';
import Button from '../common/Button';
import useAuth from '../../hooks/useAuth'; // Ajusta la ruta si es necesario

/**
 * Header exclusivo del área de administración.
 * - Fondo negro (#1A1A1A) con texto blanco, sin borde ni sombra.
 * - Logo de 48px (h-12).
 * - Enlaces como navItems (coincide con la imagen/guía).
 * - Botón de logout al final.
 */
const AdminHeader = () => {
  const { logout } = useAuth(); // Hook para manejar logout

  const navItems = [
    { label: 'Mi Perfil', link: '/admin/profile' },
    { label: 'Crear Cultivos', link: '/admin/create-crop' }, // Ajustado a "Crear Cultivos" para legibilidad (imagen usa "CrearCultivos")
    { label: 'Usuarios', link: '/admin/users' },
    { label: 'IoT', link: '/admin/iot' },
  ];

  return (
    <Header
      navItems={navItems}
      logoSrc="/assets/images/lettucecirity-icono.png"
      bgColor="bg-[#1A1A1A] text-white border-none shadow-none" // Sobrescribe estilos para coincidir con imagen
    >
      {/* Botón de logout como child, espaciado */}
      <Button variant="tertiary" onClick={logout} className="ml-4">
        Cerrar Sesión
      </Button>
    </Header>
  );
};

export default AdminHeader;