// src/components/farmer/FarmerHeader.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import LogoutButton from '../common/LogoutButton';
import useAuth from '../../hooks/useAuth';
import BackButton from '../common/BackButton';

const FarmerHeader = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Mi perfil', link: '/profile' },
    { label: 'Mis cultivos', link: '/farmer' },
    { label: 'Contacto WhatsApp', link: 'https://api.whatsapp.com/send?phone=5217121924905' },
  ];

  return (
    <Header
      navItems={navItems}
      logoSrc="/assets/images/lettucecirity-icono.png"
      // bgColor="bg-[#C3D18D]"
      className="shadow-lg"
    >
      <div className="flex items-center gap-4">
        <span className="hidden md:block font-semibold text-gray-800">
          ¡Hola, {auth.user?.nombre?.split(' ')[0] || 'Agricultor'}!
        </span>
        {/* Botón Regresar */}
        <div>
          <BackButton />
        </div>
        <LogoutButton variant="secondary" />
      </div>
    </Header>
  );
};

export default FarmerHeader;