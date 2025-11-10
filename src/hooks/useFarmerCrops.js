// src/hooks/useFarmerCrops.js
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getAllCrops } from '../api/crops';

const useFarmerCrops = () => {
  const { auth } = useAuth();
  const token = auth?.accessToken;

  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCrops = async () => {
      if (!token) return;
      try {
        const data = await getAllCrops(token);
        setCrops(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCrops();
  }, [token]);

  return { crops, loading, error };
};

export default useFarmerCrops;