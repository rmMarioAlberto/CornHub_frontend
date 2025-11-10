// src/components/common/Header.jsx (ligeros ajustes para reusabilidad)
import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const Header = ({
  navItems = [],
  buttonText = '',
  buttonLink = '/',
  logoSrc = '/assets/images/lettucecirity-icono.png',
  bgColor = 'bg-white',
  children,
}) => {
  return (
    <header className={`header-main ${bgColor}`}>
      <div className="flex items-center justify-between">
        <Link to="/" className="transition-transform duration-300 hover:scale-105">
          <img src={logoSrc} alt="Logo Lettucecurity" className="h-16 w-auto object-contain" />
        </Link>

        <nav className="flex items-center space-x-8">
          {navItems.map((item, i) => (
            <a
              key={i}
              href={item.link || '#'}
              className="nav-link"
            >
              {item.label}
            </a>
          ))}

          {/* Botón único (landing) */}
          {buttonText && (
            <Link to={buttonLink}>
              <Button variant="primary">{buttonText}</Button>
            </Link>
          )}

          {/* Children para extras como logout en admin */}
          {children}
        </nav>
      </div>
    </header>
  );
};

export default Header;