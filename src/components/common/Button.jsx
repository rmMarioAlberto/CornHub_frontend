import React from 'react';
// import './Button.css';  // Descomenta si agregas estilos custom en Button.css

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  let variantClasses = '';

  switch (variant) {
    case 'primary':
      variantClasses = 'bg-verde-profundo text-white hover:bg-verde-medio active:bg-verde-profundo/80';
      break;
    case 'secondary':
      variantClasses = 'bg-verde-lima-claro text-verde-profundo hover:bg-verde-aqua active:bg-verde-lima-claro/80';
      break;
    case 'tertiary':
      variantClasses = 'bg-verde-brillante text-white hover:bg-verde-medio active:bg-verde-brillante/80';
      break;
    default:
      variantClasses = 'bg-verde-profundo text-white hover:bg-verde-medio active:bg-verde-profundo/80';
  }

  const baseClasses = 'px-4 py-2 rounded-md font-poppins font-semibold transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-verde-brillante focus:ring-opacity-50';

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;