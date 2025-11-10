// src/api/users.js
import { API_URL } from '../utils/env';

const headers = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

export const createUser = async (userData, token) => {
  const res = await fetch(`${API_URL}/users/create`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al crear usuario');
  }

  return res.json();
};

export const getAllUsers = async (token) => {
  const res = await fetch(`${API_URL}/users/getUsers`, {
    method: 'GET',
    headers: headers(token),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al obtener usuarios');
  }

  const data = await res.json();
  return data.usuarios || data; // Ajustar según respuesta real
};