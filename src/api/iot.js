// src/api/iot.js
import { API_URL } from '../utils/env';

export const createIot = async (data, accessToken) => {
  const response = await fetch(`${API_URL}/iot/create`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al crear IoT');
  }

  return await response.json();
};

export const getAllIot = async (accessToken) => {
  const response = await fetch(`${API_URL}/iot/all`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al obtener IoTs');
  }

  const data = await response.json();
  return data.iots; // Asumiendo array 'iots' basado en Swagger similar
};

export const deleteIot = async (idIot, accessToken) => {
  const response = await fetch(`${API_URL}/iot/delete`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idIot }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al eliminar IoT');
  }

  return await response.json();
};

export const assignToParcela = async (idIot, idParcela, accessToken) => {
  const response = await fetch(`${API_URL}/iot/asignarParcela`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idIot, idParcela }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al asignar parcela');
  }

  return await response.json();
};

export const getFreeIots = async (accessToken) => {
  const response = await fetch(`${API_URL}/iot/iotsFree`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al obtener IoTs libres');
  }

  const data = await response.json();
  return data.iotsFree; // Asumiendo array 'iotsFree'
};