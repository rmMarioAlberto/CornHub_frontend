// src/hooks/useFields.js
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getAllFields, getUserFields, createField } from '../api/fields';

const useFields = () => {
  const { auth } = useAuth();
  const token = auth?.accessToken;
  const isAdmin = auth?.user?.tipo_usuario === 2;

  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFields = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const raw = isAdmin ? await getAllFields(token) : await getUserFields(token);
      const parcelas = raw?.parcelas || raw || [];

      // Mapeo seguro: garantiza id_parcela
      const mapped = parcelas.map(p => ({
        id_parcela: p.id_parcela || p.idParcela,
        nombre: p.nombre || 'Sin nombre',
        descripcion: p.descripcion || '',
        largo: p.largo || 0,
        ancho: p.ancho || 0,
        latitud: p.latitud || 0,
        longitud: p.longitud || 0,
        idCultivo: p.idCultivo || p.id_cultivo,
      }));

      setFields(mapped);
    } catch (err) {
      setError(err.message || 'Error al cargar parcelas');
    } finally {
      setLoading(false);
    }
  };

  const createNewField = async (data) => {
    setLoading(true);
    try {
      await createField(data, token);
      await fetchFields();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, [token, isAdmin]);

  return { fields, loading, error, createNewField, refresh: fetchFields };
};

export default useFields;