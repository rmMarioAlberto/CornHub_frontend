import React from 'react';

const Input = ({ type = 'text', placeholder, className = '', ...props }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`w-full p-3 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-verde-profundo ${className}`}
      {...props}
    />
  );
};

export default Input;