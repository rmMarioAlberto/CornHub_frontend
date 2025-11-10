import React from 'react';

const Input = ({ type = 'text', placeholder, className = '', ...props }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`input-field ${className}`}
      {...props}
    />
  );
};

export default Input;