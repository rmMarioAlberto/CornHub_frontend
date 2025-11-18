// src/api/auth.js
import { api } from './apiClient';

export const register = async (userData) => {
  return api.post('/auth/register', userData);
};

export const login = async (credentials) => {
  return api.post('/auth/login', credentials);
};

// ← CAMBIO CLAVE: ahora es DELETE
export const logout = async () => {
  try {
    await api.delete('/auth/logout');  // <-- DELETE en vez de POST
  } catch (err) {
    // Si el backend ya invalidó el token, 401 es esperado → no rompemos nada
    console.warn('Logout server error (probablemente token ya inválido):', err);
  } finally {
    // Siempre limpiamos el cliente aunque el server falle
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};

export const refreshToken = async () => {
  return api.get('/auth/refreshToken');
};