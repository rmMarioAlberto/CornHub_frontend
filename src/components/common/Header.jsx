import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button'; 

const Header = ({ navItems = [], buttonText = '', buttonLink = '/', logoSrc = '/assets/images/lettucecirity-icono.png', bgColor = 'verde-lima-claro' }) => {
  return (
    <header className={`p-4 flex justify-between items-center shadow-md ${bgColor}`}>
      <div className="flex items-center">
        <Link to="/">
          <img src={logoSrc} alt="Logo Lettucecurity" className="h-20 mr-4" />
        </Link>
      </div>
      <nav className="flex space-x-6">
        {navItems.map((item, index) => (
          <a
            key={index}
            href={item.link || '#'}
            className="font-poppins hover:text-verde-brillante transition duration-200 p-2"
          >
            {item.label}
          </a>
        ))}
        {buttonText && (
          <Link to={buttonLink} className="ml-6">
            <Button variant="primary">{buttonText}</Button>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;