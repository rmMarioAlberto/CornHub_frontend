// src/components/common/LogoutButton.jsx
import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import Button from './Button';

const LogoutButton = ({ variant = 'secondary', className = '' }) => {
  const { logoutUser, loading } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleLogoutClick = () => {
    setShowModal(true);
  };

  const handleConfirm = async () => {
    setShowModal(false);
    await logoutUser();
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <>
      <Button
        variant={variant}
        onClick={handleLogoutClick}
        disabled={loading}
        className={`font-medium text-xs sm:text-sm lg:text-base ${className}`}
      >
        {loading ? 'Cerrando...' : 'Cerrar sesión'}
      </Button>

      {showModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-gray-900/70 backdrop-blur-sm animate-fadeIn"
          onClick={handleCancel}
        >
          <div
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-[360px] sm:max-w-md overflow-hidden transform transition-all duration-300 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#EF4444]"></div>

            <div className="p-6 sm:p-8">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#EF4444] rounded-full blur-xl opacity-30 animate-pulse"></div>
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-[#EF4444] rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-3 tracking-tight">
                  ¿Cerrar Sesión?
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-sm mx-auto">
                  Tu sesión actual se cerrará y tendrás que iniciar sesión nuevamente para acceder al sistema.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                  className="flex-1 text-[#1A1A1A] hover:opacity-90"
                >
                  Cancelar
                </Button>

                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-1 px-5 py-3.5 text-sm sm:text-base font-semibold text-white bg-[#EF4444] hover:bg-[#DC2626] rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:hover:shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Cerrando...
                    </span>
                  ) : (
                    'Sí, cerrar sesión'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoutButton;