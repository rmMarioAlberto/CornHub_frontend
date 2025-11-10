import React from 'react';

const Footer = ({ links = [{ category: 'Resources', items: [{ label: 'Blog', href: '#' }, { label: 'Best practices', href: '#' }, { label: 'Colors', href: '#' }, { label: 'Color wheel', href: '#' }, { label: 'Support', href: '#' }, { label: 'Developers', href: '#' }, { label: 'Resource library', href: '#' }] }], logoSrc = '/assets/images/lettucecirity-icono.png' }) => {
  return (
    <footer className="footer-main">
      <div className="container-main">
        <div className="quote-grid">
          {/* Columna 1: Logo */}
          <div className="flex items-center justify-center md:justify-start">
            <img src={logoSrc} alt="Logo Lettucecurity" className="h-24 w-auto object-contain" />
          </div>

          {/* Columnas 2-4: Enlaces */}
          {links.map((category, index) => (
            <div key={index}>
              <h3>{category.category}</h3>
              <ul className="space-y-2">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <a
                      href={item.href}
                      className="footer-link"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider"></div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            © 2025 Lettucecurity. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;