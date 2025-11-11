// src/api/crops.js
import { api } from './apiClient';

export const getAllCrops = async () => {
  const data = await api.get('/cultivo/getCultivos');
  return data.cultivo;
};

export const getCropById = async (id) => {
  const data = await api.post('/cultivo/getCultivo', { idCultivo: id });
  return data.cultivo;
};