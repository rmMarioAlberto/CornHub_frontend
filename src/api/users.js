// src/api/users.js
import { api } from './apiClient';

export const createUser = async (userData) => {
  return await api.post('/users/create', userData);
};

export const getAllUsers = async () => {
  const response = await api.get('/users/getUsers');
  
  return response.users || response.data?.users || response || [];
};