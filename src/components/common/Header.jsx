// src/components/common/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const Header = ({
  navItems = [],
  buttonText = '',
  buttonLink = '/',
  logoSrc = '/assets/images/lettucecirity-icono.png',
  bgColor = 'verde-lima-claro',
  children,               // ← NUEVO
}) => {
  return (
    <header className={`p-4 flex justify-between items-center shadow-md ${bgColor}`}>
      <div className="flex items-center">
        <Link to="/">
          <img src={logoSrc} alt="Logo Lettucecurity" className="h-20 mr-4" />
        </Link>
      </div>

      <nav className="flex items-center space-x-6">
        {navItems.map((item, i) => (
          <a
            key={i}
            href={item.link || '#'}
            className="font-poppins hover:text-verde-brillante transition duration-200 p-2"
          >
            {item.label}
          </a>
        ))}

        {/* Botón único (landing) */}
        {buttonText && (
          <Link to={buttonLink} className="ml-6">
            <Button variant="primary">{buttonText}</Button>
          </Link>
        )}

        {/* Aquí van los botones extra del admin */}
        {children}
      </nav>
    </header>
  );
};

export default Header;