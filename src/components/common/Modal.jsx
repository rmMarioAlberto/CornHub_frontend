import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-verde-profundo hover:text-verde-brillante"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;