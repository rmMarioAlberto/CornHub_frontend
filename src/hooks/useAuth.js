import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { login, logout, refreshToken, register } from '../api/auth';

const useAuth = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para registrar un usuario
  const registerUser = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const data = await register(userData);
      setAuth({ user: data.usuario });
      localStorage.setItem('user', JSON.stringify(data.usuario));
      navigate('/login'); // Redirigir a login tras registro
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para iniciar sesión
  const loginUser = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const data = await login({ correo: email, contra: password });
      const { accessToken, usuario } = data;

      setAuth({ accessToken, user: usuario });
      localStorage.setItem('user', JSON.stringify(usuario));
      const redirectPath = usuario.tipo_usuario === 1 ? '/admin' : '/farmer';
      navigate(redirectPath);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logoutUser = async () => {
    setLoading(true);
    setError(null);

    try {
      await logout();
      setAuth(null);
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para refrescar el token de acceso
  const refreshAuthToken = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await refreshToken();
      const { accessToken } = data;

      setAuth((prev) => ({
        ...prev,
        accessToken,
      }));
    } catch (err) {
      setError(err.message);
      logoutUser(); // Forzar logout si falla el refresco
    } finally {
      setLoading(false);
    }
  };

  // Efecto para refrescar el token automáticamente
  useEffect(() => {
    let interval;
    if (auth?.accessToken) {
      interval = setInterval(() => {
        refreshAuthToken();
      }, 12 * 60 * 1000); // Refrescar cada 12 minutos
    }
    return () => clearInterval(interval);
  }, [auth?.accessToken]);

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