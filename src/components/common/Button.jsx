// src/components/common/Button.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  disabled, 
  as: Component = 'button', // Por defecto es button, pero puede ser Link, a, etc.
  ...props 
}) => {
  let variantClass = '';

  switch (variant) {
    case 'primary':
      variantClass = 'btn-primary';
      break;
    case 'secondary':
      variantClass = 'btn-secondary';
      break;
    case 'tertiary':
      variantClass = 'btn-tertiary';
      break;
    default:
      variantClass = 'btn-primary';
  }

  // Si es un Link, aseguramos que tenga el estilo de botón
  if (Component === Link) {
    return (
      <Link
        className={`${variantClass} ${className}`}
        {...props}
      >
        {children}
      </Link>
    );
  }

  // Si es otro componente (a, div, etc.)
  if (Component !== 'button') {
    return (
      <Component
        className={`${variantClass} ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }

  // Caso por defecto: <button>
  return (
    <button
      className={`${variantClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;