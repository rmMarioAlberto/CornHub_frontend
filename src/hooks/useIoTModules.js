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
      const data = Array.isArray(response)
        ? response
        : (response?.data || response?.parcelas || []);
      setIots(data);
    } catch (err) {
      setError(err.message || 'Error al cargar módulos IoT');
      setIots([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFreeIots = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getFreeIots();
      const data = Array.isArray(response)
        ? response
        : (response?.data || response?.parcelas || []);
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
      await fetchFreeIots();
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

  // MODIFICADO: Recibe coordenadas
  const assignIotToParcela = async (idIot, idParcela, x, y) => {
    setLoading(true);
    setError(null);
    try {
      await assignToParcela(idIot, idParcela, x, y);
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