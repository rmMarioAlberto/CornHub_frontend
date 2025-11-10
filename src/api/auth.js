// src/api/auth.js
import { api } from './apiClient'; // Importa el cliente centralizado

export const register = async (userData) => {
  return api.post('/auth/register', userData);
};

export const login = async (credentials) => {
  return api.post('/auth/login', credentials);
};

export const logout = async () => {
  return api.post('/auth/logout');
};

export const refreshToken = async () => {
  // Nota: No usar directamente; apiClient lo maneja internamente.
  // Si necesitas llamar manualmente, usa api.post('/auth/refresh-token');
  return api.post('/auth/refresh-token');
};