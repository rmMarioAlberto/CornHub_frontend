// src/api/fields.js
import { API_URL } from '../utils/env';

const headers = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

export const getAllFields = async (token) => {
  const res = await fetch(`${API_URL}/parcela/getParcelas`, {
    headers: headers(token),
  });
  if (!res.ok) throw new Error('Error al obtener parcelas');
  return await res.json();
};

export const getUserFields = async (token) => {
  const res = await fetch(`${API_URL}/parcela/getParcelasUser`, {
    headers: headers(token),
  });
  if (!res.ok) throw new Error('Error al obtener tus parcelas');
  return await res.json();
};

export const createField = async (data, token) => {
  const res = await fetch(`${API_URL}/parcela/createParcela`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear parcela');
  return await res.json();
};