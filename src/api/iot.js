// src/api/iot.js
import { api } from './apiClient';

export const createIot = async (data) => {
  return await api.post('/iot/create', data);
};

export const getAllIot = async () => {
  const data = await api.get('/iot/all');
  return data.iots;
};

export const deleteIot = async (idIot) => {
  return await api.post('/iot/delete', { idIot });
};

export const assignToParcela = async (idIot, idParcela) => {
  return await api.post('/iot/asignarParcela', { idIot, idParcela });
};

export const getFreeIots = async () => {
  const data = await api.get('/iot/iotsFree');
  return data.iotsFree;
};