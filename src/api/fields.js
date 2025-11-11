// src/api/fields.js
import { api } from './apiClient';

export const getAllFields = async () => {
  return await api.get('/parcela/getParcelas');
};

export const getUserFields = async () => {
  return await api.get('/parcela/getParcelasUser');
};

export const createField = async (data) => {
  return await api.post('/parcela/createParcela', data);
};