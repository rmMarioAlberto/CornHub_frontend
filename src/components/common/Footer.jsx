import React from 'react';

const Footer = ({ links = [{ category: 'Resources', items: [{ label: 'Blog', href: '#' }, { label: 'Best practices', href: '#' }, { label: 'Colors', href: '#' }, { label: 'Color wheel', href: '#' }, { label: 'Support', href: '#' }, { label: 'Developers', href: '#' }, { label: 'Resource library', href: '#' }] }], logoSrc = '/public/assets/images/lettucecirity-icono.png' }) => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <hr className="border-gray-300 mb-6" />
      <div className="container grid grid-cols-4 gap-6">
        {/* Columna 1: Logo */}
        <div className="pt-4 pl-4">
          <img src={logoSrc} alt="Logo Lettucecurity" className="w-full" />
        </div>

        {/* Columna 2: Enlaces */}
        <div className="col-span-1 pl-1">
          {links.map((category, index) => (
            <div key={index}>
              <h3 className="font-poppins font-bold mb-2">{category.category}</h3>
              {category.items.map((item, itemIndex) => (
                <a
                  key={itemIndex}
                  href={item.href}
                  className="font-poppins block text-black mb-1 ml-4 no-underline hover:text-verde-brillante transition duration-200"
                >
                  {item.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Columnas 3 y 4: Espacio en blanco */}
        <div className="col-span-2"></div>
      </div>
    </footer>
  );
};

export default Footer;