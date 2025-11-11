// src/api/auth.js
import { api } from './apiClient';

export const register = async (userData) => {
  return api.post('/auth/register', userData);
};

export const login = async (credentials) => {
  return api.post('/auth/login', credentials);
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

export const refreshToken = async () => {
  return api.get('/auth/refreshToken');
};