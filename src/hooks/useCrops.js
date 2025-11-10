// src/hooks/useCrops.js
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getAllCrops, getCropById } from '../api/crops';

const useCrops = () => {
  const { auth } = useAuth();
  const token = auth?.accessToken;

  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCrops = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getAllCrops(token);
      setCrops(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCrop = async (id) => {
    setLoading(true);
    try {
      const data = await getCropById(id, token);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, [token]);

  return { crops, loading, error, fetchCrop, refresh: fetchCrops };
};

export default useCrops;