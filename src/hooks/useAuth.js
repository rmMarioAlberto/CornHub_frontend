// src/hooks/useAuth.js
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { login, logout, refreshToken, register } from '../api/auth';

const useAuth = () => {
  const { auth, updateAuth, loading: contextLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // === REGISTER ===
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

  // === LOGIN ===
  const loginUser = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const raw = await login({ correo: email, contra: password });
      const payload = raw?.data ?? raw;

      const accessToken = payload?.accessToken ?? null;
      const refreshToken = payload?.refreshToken ?? null;
      const userObj = payload?.user ?? payload?.usuario ?? null;

      updateAuth({ accessToken, refreshToken, user: userObj });

      const redirectPath = userObj?.tipo_usuario === 2 ? '/admin' : '/farmer';
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // === LOGOUT ===
  const logoutUser = async () => {
    setLoading(true);
    setError(null);
    try {
      await logout(); // ← ahora llama al DELETE correcto
      updateAuth({ user: null, accessToken: null, refreshToken: null });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      navigate('/login', { replace: true }); // ← evita volver atrás con el botón del navegador
    }
  };

  // === REFRESH TOKEN ===
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

  // === Auto-refresh cada 12 minutos (si hay token) ===
  useEffect(() => {
    if (!auth?.accessToken) return;

    const interval = setInterval(refreshAuthToken, 12 * 60 * 1000);
    return () => clearInterval(interval);
  }, [auth?.accessToken]);

  // === Limpiar tokens al entrar a /login ===
  useEffect(() => {
    if (window.location.pathname === '/login') {
      updateAuth({ accessToken: null, refreshToken: null, user: null });
    }
  }, []);

  return {
    auth,
    updateAuth,
    loading: loading || contextLoading,
    error,
    registerUser,
    loginUser,
    logoutUser,
    refreshAuthToken,
  };
};

export default useAuth;