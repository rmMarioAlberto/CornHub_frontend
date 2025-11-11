// src/hooks/useAuth.js
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { login, logout, refreshToken, register } from '../api/auth';

const useAuth = () => {
  const { auth, updateAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registerUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await register(userData);
      const newUser = data?.usuario ?? null;
      updateAuth({ user: newUser });
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const raw = await login({ correo: email, contra: password });
      const payload = raw?.data ?? raw;

      const accessToken = payload?.accessToken ?? null;
      const refreshToken = payload?.refreshToken ?? null;
      const userObj = payload?.user ?? payload?.usuario ?? null;

      updateAuth({ accessToken, user: userObj });

      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
        console.log('refreshToken guardado:', refreshToken);
      }

      const redirectPath = userObj?.tipo_usuario === 2 ? '/admin' : '/farmer';
      navigate(redirectPath);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);
    setError(null);
    try {
      await logout();
      updateAuth({ user: null, accessToken: null });
      localStorage.removeItem('refreshToken');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshAuthToken = async () => {
    setLoading(true);
    setError(null);
    try {
      const raw = await refreshToken();
      const payload = raw?.data ?? raw;
      const accessToken = payload?.accessToken ?? null;
      updateAuth({ accessToken });
    } catch (err) {
      setError(err.message);
      await logoutUser();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    if (auth?.accessToken) {
      interval = setInterval(refreshAuthToken, 12 * 60 * 1000);
    }
    return () => clearInterval(interval);
  }, [auth?.accessToken]);

  // === LIMPIAR TOKENS AL CARGAR /login ===
  useEffect(() => {
    if (window.location.pathname === '/login') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }, []);

  return {
    auth,
    registerUser,
    loginUser,
    logoutUser,
    refreshAuthToken,
    loading,
    error,
  };
};

export default useAuth;