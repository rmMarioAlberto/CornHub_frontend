// src/api/fields.js
import { api } from './apiClient';

// --- FUNCIONES EXISTENTES ---
export const getAllFields = async () => {
  return await api.get('/parcela/getParcelas');
};

export const getUserFields = async () => {
  return await api.get('/parcela/getParcelasUser');
};

export const createField = async (data) => {
  return await api.post('/parcela/createParcela', data);
};

// --- NUEVOS WS AÑADIDOS ---

// Crear un nuevo ciclo (POST /parcela/createCycle)
export const createCycle = async (idParcela) => {
  return await api.post('/parcela/createCycle', { idParcela });
};

// Actualizar etapa actual (POST /parcela/updateCurrentStage)
export const updateCurrentStage = async (idParcela, stageIndex) => {
  return await api.post('/parcela/updateCurrentStage', { idParcela, stageIndex });
};

// Obtener solo etapas sin lecturas (POST /parcela/stageParcela)
// Útil si quisieras actualizar solo la cabecera sin recargar gráficas pesadas
export const getStageParcela = async (idParcela) => {
  return await api.post('/parcela/stageParcela', { idParcela });
};

// Finalizar el ciclo activo (POST /parcela/endCycle)
export const endCycle = async (idParcela) => {
  return await api.post('/parcela/endCycle', { idParcela });
};

// Obtener IoTs asignados (POST /parcela/getIotsParcela)
export const getIotsParcela = async (idParcela) => {
  // Nota: El backend espera un POST según tu documentación
  return await api.post('/parcela/getIotsParcela', { idParcela });
};