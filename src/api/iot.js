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

// MODIFICADO: Ahora acepta coordenadas X e Y
export const assignToParcela = async (idIot, idParcela, coordenadaX, coordenadaY) => {
  return await api.post('/iot/asignarParcela', { 
    idIot, 
    idParcela,
    coordenadaX,
    coordenadaY
  });
};

export const getFreeIots = async () => {
  const data = await api.get('/iot/iotsFree');
  return data.data;
};

export const getIotsParcela = async (idParcela) => {
  const response = await api.post('/parcela/getIotsParcela', { idParcela });
  return response.data?.data || response.data || [];
};