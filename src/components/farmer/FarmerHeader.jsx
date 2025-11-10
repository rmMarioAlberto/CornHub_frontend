// src/components/farmer/FarmerHeader.jsx
import React from 'react';
import Header from '../common/Header';
import useAuth from '../../hooks/useAuth';
import Button from '../common/Button';

const FarmerHeader = () => {
  const { logoutUser } = useAuth();

  const navItems = [
    { label: 'Mi perfil', link: '/profile' },
    { label: 'Mis cultivos', link: '/farmer' },
    { label: 'Contacto', link: 'https://api.whatsapp.com/send?phone=+527121924905' },
  ];

  return (
    <Header
      navItems={navItems}
      buttonText="Regresar"
      buttonLink="/"
      bgColor="bg-verde-lima"
      logoSrc="/assets/images/lettucecirity-icono.png"
    >
      <Button variant="secondary" onClick={logoutUser} className="ml-4">
        Cerrar sesión
      </Button>
    </Header>
  );
};

export default FarmerHeader;