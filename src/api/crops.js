// src/api/crops.js
import { API_URL } from '../utils/env';

const headers = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

export const getAllCrops = async (token) => {
  const res = await fetch(`${API_URL}/cultivo/getCultivos`, {
    headers: headers(token),
  });
  if (!res.ok) throw new Error('Error al obtener cultivos');
  const data = await res.json();
  return data.cultivo;
};

export const getCropById = async (id, token) => {
  const res = await fetch(`${API_URL}/cultivo/getCultivo`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ idCultivo: id }),
  });
  if (!res.ok) throw new Error('Cultivo no encontrado');
  const data = await res.json();
  return data.cultivo;
};