const API_URL = 'https://corn-hub-backend.vercel.app/api'; // Ajusta según tu backend
// const API_URL = 'https://corn-hub-backend.vercel.app/api'; // Ajusta según tu backend

export const register = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
    credentials: 'include', // Permitir cookies
  });
  if (!response.ok) throw new Error((await response.json()).message || 'Error al registrar');
  return response.json();
};

export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
    credentials: 'include', // Permitir cookies
  });
  if (!response.ok) throw new Error((await response.json()).message || 'Error al iniciar sesión');
  return response.json();
};

export const logout = async () => {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Enviar cookies
  });
  if (!response.ok) throw new Error((await response.json()).message || 'Error al cerrar sesión');
  return response.json();
};

export const refreshToken = async () => {
  const response = await fetch(`${API_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Enviar cookies
  });
  if (!response.ok) throw new Error((await response.json()).message || 'Error al refrescar token');
  return response.json();
};