// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, accessToken: null });
  const [loading, setLoading] = useState(true); // ← Estado de carga inicial

  // Carga inicial desde localStorage (una sola vez)
  useEffect(() => {
    const loadAuth = () => {
      try {
        const token = localStorage.getItem('accessToken');
        const user = localStorage.getItem('user');
        const refreshToken = localStorage.getItem('refreshToken');

        setAuth({
          accessToken: token || null,
          user: user ? JSON.parse(user) : null,
          refreshToken: refreshToken || null,
        });
      } catch (err) {
        console.error('Error loading auth from storage', err);
      } finally {
        setLoading(false);
      }
    };

    loadAuth();
  }, []);

  // updateAuth: mergea y sincroniza con localStorage
  const updateAuth = useCallback((newData) => {
    setAuth((prev) => {
      const updated = { ...prev, ...newData };

      if (newData.accessToken !== undefined) {
        newData.accessToken
          ? localStorage.setItem('accessToken', newData.accessToken)
          : localStorage.removeItem('accessToken');
      }

      if (newData.user !== undefined) {
        newData.user
          ? localStorage.setItem('user', JSON.stringify(newData.user))
          : localStorage.removeItem('user');
      }

      if (newData.refreshToken !== undefined) {
        newData.refreshToken
          ? localStorage.setItem('refreshToken', newData.refreshToken)
          : localStorage.removeItem('refreshToken');
      }

      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ auth, updateAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;