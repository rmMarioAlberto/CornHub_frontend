// src/api/users.js
import { api } from './apiClient';

export const createUser = async (userData) => {
  return await api.post('/users/create', userData);
};

export const getAllUsers = async () => {
  const data = await api.get('/users/getUsers');
  return data.usuarios || data;
};