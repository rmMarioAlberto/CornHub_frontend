// src/api/iot.js
import { api } from './apiClient';

export const createIot = async (data) => {
  return await api.post('/iot/create', data);
};

export const getAllIot = async () => {
  const data = await api.get('/iot/all');
  return data.data;
};

export const deleteIot = async (idIot) => {
  return await api.post('/iot/delete', { idIot });
};

export const assignToParcela = async (idIot, idParcela) => {
  return await api.post('/iot/asignarParcela', { idIot, idParcela });
};

export const getFreeIots = async () => {
  const data = await api.get('/iot/iotsFree');
  return data.data;
};

// --- NUEVO ---
export const getIotsParcela = async (idParcela) => {
  const response = await api.post('/parcela/getIotsParcela', { idParcela });
  // La respuesta del backend es { statusCode: 200, data: [ ... ] }
  // Si tu apiClient devuelve response.data automáticamente, esto retorna el objeto JSON.
  // Si devuelve axios response, accedemos a .data.
  return response.data || response; 
};