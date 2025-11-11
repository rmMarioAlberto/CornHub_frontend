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
      const data = await getAllIot();
      setIots(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFreeIots = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFreeIots();
      setFreeIots(data);
    } catch (err) {
      setError(err.message);
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
    } catch (err) {
      setError(err.message);
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
    } catch (err) {
      setError(err.message);
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
      setError(err.message);
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
  };
};

export default useIoTModules;