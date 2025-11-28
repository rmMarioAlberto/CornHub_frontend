// src/components/common/Header.jsx
import React, { useState } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={`header-main ${bgColor} ${className} shadow-md`}>
      <div className="container-main flex items-center justify-between py-4">
        {/* Logo */}
        <Link to="/" className="transition-transform duration-300 hover:scale-105">
          <img
            src={logoSrc}
            alt="Lettucecurity"
            className="h-12 md:h-16 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navItems.map((item, i) => {
            const isExternal = item.link?.startsWith('http');
            return isExternal ? (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link font-medium text-base lg:text-lg flex items-center gap-1 hover:opacity-80 transition-colors"
              >
                {item.label}
                <svg className="w-4 h-4 lg:w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V3h-6z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
              </a>
            ) : (
              <Link
                key={i}
                to={item.link || '/'}
                className="nav-link font-medium text-base lg:text-lg hover:opacity-80 transition-colors"
              >
                {item.label}
              </Link>
            );
          })}

          {buttonText && (
            <Link to={buttonLink}>
              <Button variant="primary" className="font-medium text-base lg:text-lg px-4 py-2 lg:px-6 lg:py-3">
                {buttonText}
              </Button>
            </Link>
          )}
        </nav>

        {/* Right side + Hamburger */}
        <div className="flex items-center gap-4">
          {children}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden focus:outline-none transition-transform hover:scale-110"
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu - Dropdown below header, no overlap */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen py-6 border-t divider' : 'max-h-0 py-0'}`}>
        <nav className="container-main flex flex-col items-center gap-6">
          {navItems.map((item, i) => {
            const isExternal = item.link?.startsWith('http');
            const linkClass = "nav-link font-medium text-lg hover:opacity-80 transition-colors w-full text-center py-2";
            return isExternal ? (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={i}
                to={item.link || '/'}
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}

          {buttonText && (
            <Link to={buttonLink} className="w-full text-center" onClick={() => setIsOpen(false)}>
              <Button variant="primary" className="font-medium text-lg px-8 py-3 w-full">
                {buttonText}
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;