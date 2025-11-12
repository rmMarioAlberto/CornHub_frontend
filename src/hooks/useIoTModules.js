// src/hooks/useIoTModules.js
import { useState, useEffect } from 'react';
import { createIot, getAllIot, deleteIot, assignToParcela, getFreeIots } from '../api/iot';

const useIoTModules = () => {
  const [iots, setIots] = useState([]);
  const [freeIots, setFreeIots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllIot = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllIot();
      // Aseguramos que siempre sea un array
      const data = Array.isArray(response) ? response : (response?.data || []);
      setIots(data);
    } catch (err) {
      setError(err.message || 'Error al cargar módulos IoT');
      setIots([]); // Fallback seguro
    } finally {
      setLoading(false);
    }
  };

  const fetchFreeIots = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getFreeIots();
      const data = Array.isArray(response) ? response : (response?.data || []);
      setFreeIots(data);
    } catch (err) {
      setError(err.message || 'Error al cargar IoTs libres');
      setFreeIots([]);
    } finally {
      setLoading(false);
    }
  };

  const createNewIot = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await createIot(data);
      await fetchAllIot();
      await fetchFreeIots(); // Actualiza también los libres
    } catch (err) {
      setError(err.message || 'Error al crear módulo IoT');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeIot = async (idIot) => {
    setLoading(true);
    setError(null);
    try {
      await deleteIot(idIot);
      await fetchAllIot();
      await fetchFreeIots();
    } catch (err) {
      setError(err.message || 'Error al eliminar módulo IoT');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const assignIotToParcela = async (idIot, idParcela) => {
    setLoading(true);
    setError(null);
    try {
      await assignToParcela(idIot, idParcela);
      await fetchAllIot();
      await fetchFreeIots();
    } catch (err) {
      setError(err.message || 'Error al asignar módulo a parcela');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      await Promise.all([fetchAllIot(), fetchFreeIots()]);
    };
    load();
  }, []);

  return {
    iots,
    freeIots,
    loading,
    error,
    createNewIot,
    removeIot,
    assignIotToParcela,
    refresh: fetchAllIot,
    refreshFree: fetchFreeIots,
  };
};

export default useIoTModules;