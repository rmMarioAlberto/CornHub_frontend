import React from 'react';

const Button = ({ children, variant = 'primary', className = '', disabled, ...props }) => {
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