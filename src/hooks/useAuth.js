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
      const raw = await login({ correo: email, contra: password });

      // La API ahora puede devolver la carga útil dentro de `data`, por ejemplo:
      // { statusCode, message, data: { accessToken, refreshToken, user } }
      // Normalizamos para aceptar ambos formatos (antiguo y nuevo).
      const payload = raw?.data ?? raw;

      const accessToken = payload?.accessToken ?? null;
      const refreshToken = payload?.refreshToken ?? null; // NO almacenar en localStorage

      // El usuario puede venir bajo `user` o `usuario` (o no venir).
      const userObj = payload?.user ?? payload?.usuario ?? null;

      // Guardar en el contexto — `user` puede ser null si el backend no lo retornó.
      setAuth({ accessToken, user: userObj });

      // Guardar solo si existe el usuario en la respuesta
      if (userObj) localStorage.setItem('user', JSON.stringify(userObj));

      // IMPORTANTE: por seguridad no guardamos `refreshToken` en localStorage.
      // Lo ideal es que el servidor devuelva el refresh token como cookie httpOnly
      // y que `fetch(..., credentials: 'include')` lo envíe automáticamente.
      // Si el backend devuelve refreshToken en la respuesta JSON, evita almacenarlo
      // en localStorage/sessionStorage para reducir el riesgo de XSS.

      // Determinar ruta de redirección de forma segura. Si no hay user, redirigimos a '/farmer'.
      const redirectPath = userObj?.tipo_usuario === 2 ? '/admin' : '/farmer'; // Por alguna razón registraron el 2 como admin
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
      const raw = await refreshToken();
      const payload = raw?.data ?? raw;
      const accessToken = payload?.accessToken ?? null;

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