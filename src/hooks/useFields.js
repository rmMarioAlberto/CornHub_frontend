// src/hooks/useFields.js
import { useState, useEffect } from 'react';
import useAuth from './useAuth';
import { getAllFields, getUserFields, createField } from '../api/fields';

const useFields = () => {
  const { auth } = useAuth();
  const isAdmin = auth?.user?.tipo_usuario === 2;

  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFields = async () => {
    setLoading(true);
    setError(null);
    try {
      const raw = isAdmin ? await getAllFields() : await getUserFields();
      const parcelas = raw?.parcelas || raw || [];

      const mapped = parcelas.map(p => ({
        id_parcela: p.id_parcela || p.idParcela,
        id_usuario: p.id_usuario || p.idUsuario,
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
    setError(null);
    try {
      await createField(data);
      await fetchFields();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.accessToken) {
      fetchFields();
    }
  }, [auth?.accessToken, isAdmin]);

  return { fields, loading, error, createNewField, refresh: fetchFields };
};

export default useFields;