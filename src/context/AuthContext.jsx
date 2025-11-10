import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('accessToken');
    return {
      user: savedUser ? JSON.parse(savedUser) : null,
      accessToken: savedToken || null,
    };
  });

  // Función para actualizar auth con merge y sincronizar localStorage
  const updateAuth = (newAuth) => {
    setAuth((prev) => {
      const updated = { ...prev, ...newAuth };
      if (newAuth.user !== undefined) {
        if (newAuth.user) {
          localStorage.setItem('user', JSON.stringify(newAuth.user));
        } else {
          localStorage.removeItem('user');
        }
      }
      if (newAuth.accessToken !== undefined) {
        if (newAuth.accessToken) {
          localStorage.setItem('accessToken', newAuth.accessToken);
        } else {
          localStorage.removeItem('accessToken');
        }
      }
      return updated;
    });
  };

  // Cleanup: Remover si user es null (accessToken ya se maneja en updateAuth)
  useEffect(() => {
    return () => {
      if (!auth.user) localStorage.removeItem('user');
      if (!auth.accessToken) localStorage.removeItem('accessToken');
    };
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, updateAuth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;