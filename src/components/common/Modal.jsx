// src/components/common/Modal.jsx
import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* FONDO CON TRANSPARENCIA REAL (funciona al 100%) */}
      <div
        className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal con animación */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 
                   max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="p-8">
          {/* Título */}
          {title && (
            <h2 className="text-2xl font-bold text-green-800 mb-6 pr-10">
              {title}
            </h2>
          )}

          {/* Botón X */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-4xl text-gray-500 hover:text-red-600 
                       transition-all hover:scale-125 font-light"
            aria-label="Cerrar"
          >
            ×
          </button>

          {/* Contenido */}
          <div className="text-gray-700">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;