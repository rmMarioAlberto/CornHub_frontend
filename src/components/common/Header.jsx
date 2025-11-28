// src/components/common/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const Header = ({
  navItems = [],
  buttonText,
  buttonLink = '/',
  logoSrc = '/assets/images/lettucecirity-icono.png',
  bgColor = 'bg-white',
  className = '',
  children,
}) => {
  return (
    <header className={`header-main ${bgColor} ${className}`}>
      <div className="container-main flex items-center justify-between py-4">
        {/* Logo */}
        <Link to="/" className="transition-transform duration-300 hover:scale-105">
          <img
            src={logoSrc}
            alt="Lettucecurity"
            className="h-12 md:h-16 w-auto object-contain"
          />
        </Link>

        {/* Navegación + acciones */}
        <nav className="flex items-center gap-8">
          {navItems.map((item, i) => {
            const isExternal = item.link?.startsWith('http');
            
            // Si es un link externo, usar <a>
            if (isExternal) {
              return (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link font-medium flex items-center gap-1"
                >
                  {item.label}
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V3h-6z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                </a>
              );
            }
            
            // Si es un link interno, usar <Link>
            return (
              <Link
                key={i}
                to={item.link || '/'}
                className="nav-link font-medium"
              >
                {item.label}
              </Link>
            );
          })}

          {/* Botón principal (solo en landing) */}
          {buttonText && (
            <Link to={buttonLink}>
              <Button variant="primary" className="font-medium">
                {buttonText}
              </Button>
            </Link>
          )}

          {/* Área para logout, saludo, etc. */}
          {children}
        </nav>
      </div>
    </header>
  );
};

export default Header;