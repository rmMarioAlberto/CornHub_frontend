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
      // El backend puede devolver el nuevo usuario en `data.usuario`.
      // Proteger en caso de que la respuesta no incluya `usuario`.
      const newUser = data?.usuario ?? null;
      setAuth({ user: newUser });
      if (newUser) localStorage.setItem('user', JSON.stringify(newUser));
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
      // La respuesta actual del servidor devuelve sólo accessToken/refreshToken.
      // En el futuro se espera que también devuelva `usuario` y `tipo_usuario`.
      // Ejemplo esperado (futuro): { accessToken, usuario: { id: 1, nombre: 'x', tipo_usuario: 1 } }
      const { accessToken, usuario } = data;

      // Guardar en el contexto — `user` puede ser null si el backend no lo retornó.
      const user = usuario ?? null;
      setAuth({ accessToken, user });

      // Guardar solo si existe el usuario en la respuesta
      if (user) localStorage.setItem('user', JSON.stringify(user));

      // Determinar ruta de redirección de forma segura.
      // Usamos optional chaining para evitar "Cannot read properties of undefined"
      // Si `usuario` no viene, por ahora redirigimos a '/farmer' por defecto.
      const redirectPath = user?.tipo_usuario === 1 ? '/admin' : '/farmer';
      navigate(redirectPath);

      /*
        Nota para el futuro (cuando el backend incluya `usuario` y `tipo_usuario`):
        - Si el backend devuelve `usuario` como un arreglo, por ejemplo `usuario: [ {...} ]`,
          extraer el elemento correcto antes de usarlo:

            // Ejemplo si backend devuelve array:
            // const usuarioArray = data.usuario;
            // const usuarioObj = Array.isArray(usuarioArray) ? usuarioArray[0] : usuarioArray;
            // const user = usuarioObj ?? null;

        - Luego usar `user?.tipo_usuario` para decidir la ruta.
      */
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
      // Mantener la forma esperada del estado `auth` (objeto) para evitar errores
      // en componentes que acceden a `auth.user`. Usar objeto con user null.
      setAuth({ user: null, accessToken: null });
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
export { useAuth };