import React from 'react';

const Input = ({ label, type = 'text', value, onChange, className }) => {
  return (
    <div className="mb-4">
      <label className="block text-verde-medio mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border border-verde-aqua rounded-md focus:outline-none focus:border-verde-brillante ${className}`}
      />
    </div>
  );
};

export default Input;