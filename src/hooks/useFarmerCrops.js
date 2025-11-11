// src/hooks/useFarmerCrops.js
import { useState, useEffect } from 'react';
import { getAllCrops } from '../api/crops';

const useFarmerCrops = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        setLoading(true);
        const data = await getAllCrops(); // Sin token
        setCrops(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCrops();
  }, []);

  return { crops, loading, error };
};

export default useFarmerCrops;