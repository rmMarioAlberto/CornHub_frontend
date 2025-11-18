// src/hooks/useCrops.js
import { useState, useEffect } from 'react';
import { getAllCrops } from '../api/crops';

const useCrops = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCrops = async () => {
    setLoading(true);
    try {
      const data = await getAllCrops();            // devuelve array de cultivos
      setCrops(Array.isArray(data) ? data : data.cultivo || []);
    } catch (err) {
      setError(err.message || 'Error al cargar cultivos');
      setCrops([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  return { crops, loading, error, refresh: fetchCrops };
};

export default useCrops;