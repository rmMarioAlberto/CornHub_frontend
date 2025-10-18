import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? { user: JSON.parse(savedUser), accessToken: null } : { user: null, accessToken: null };
  });

  // Actualizar el contexto cuando el estado cambia
  const updateAuth = (newAuth) => {
    setAuth((prev) => {
      const updatedAuth = { ...prev, ...newAuth };
      if (newAuth.user) {
        localStorage.setItem('user', JSON.stringify(newAuth.user));
      } else if (newAuth.user === null) {
        localStorage.removeItem('user');
      }
      return updatedAuth;
    });
  };

  // Efecto para limpiar localStorage si el usuario se desconecta manualmente
  useEffect(() => {
    return () => {
      if (!auth.user) {
        localStorage.removeItem('user');
      }
    };
  }, [auth.user]);

  return (
    <AuthContext.Provider value={{ auth, updateAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;