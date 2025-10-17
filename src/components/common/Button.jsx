import React from 'react';

const Button = ({ children, variant = 'primary', onClick, className }) => {
  const baseClass = 'px-4 py-2 rounded-md font-medium';
  const variantClass = variant === 'primary' ? 'bg-verde-brillante text-white hover:bg-verde-medio' : 'bg-verde-aqua text-verde-profundo hover:bg-verde-lima-claro';
  
  return (
    <button onClick={onClick} className={`${baseClass} ${variantClass} ${className}`}>
      {children}
    </button>
  );
};

export default Button;