// src/hooks/useIoTModules.js
import { useState, useEffect } from 'react';
import useAuth from './useAuth';
import { createIot, getAllIot, deleteIot, assignToParcela, getFreeIots } from '../api/iot';

const useIoTModules = () => {
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;

  const [iots, setIots] = useState([]);
  const [freeIots, setFreeIots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllIot = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllIot(accessToken);
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
      const data = await getFreeIots(accessToken);
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
      await createIot(data, accessToken);
      await fetchAllIot(); // Refetch
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
      await deleteIot(idIot, accessToken);
      await fetchAllIot(); // Refetch
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
      await assignToParcela(idIot, idParcela, accessToken);
      await fetchAllIot(); // Refetch
      await fetchFreeIots();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchAllIot();
      fetchFreeIots();
    }
  }, [accessToken]);

  return { iots, freeIots, loading, error, createNewIot, removeIot, assignIotToParcela, refresh: fetchAllIot };
};

export default useIoTModules;