// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminHeader from '../components/admin/AdminHeader';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import { FaUser, FaLeaf, FaExclamationTriangle } from 'react-icons/fa';
import { API_URL } from '../utils/env';

const AdminDashboard = () => {
  const [usersCount, setUsersCount] = useState(26);   // placeholder
  const [cropsCount, setCropsCount] = useState(12);   // placeholder
  const [alertsCount, setAlertsCount] = useState(4); // placeholder
  const [error, setError] = useState(null);

  /* ---------- WS (descomentar cuando existan) ---------- */
  const fetchUsersCount = async () => {
    try {
      const response = await fetch(`${API_URL}/users/count`);
      if (!response.ok) throw new Error('Error al obtener conteo de usuarios');
      const { count } = await response.json();
      setUsersCount(count);
    } catch (err) {
      setError('No se pudo conectar con el servicio de usuarios. Usando datos placeholders.');
    }
  };

  const fetchCropsCount = async () => {
    try {
      const response = await fetch(`${API_URL}/fields/active/count`);
      if (!response.ok) throw new Error('Error al obtener conteo de cultivos');
      const { count } = await response.json();
      setCropsCount(count);
    } catch (err) {
      setError('No se pudo conectar con el servicio de cultivos. Usando datos placeholders.');
    }
  };

  const fetchAlertsCount = async () => {
    try {
      const response = await fetch(`${API_URL}/alerts/recent/count`);
      if (!response.ok) throw new Error('Error al obtener conteo de alertas');
      const { count } = await response.json();
      setAlertsCount(count);
    } catch (err) {
      setError('No se pudo conectar con el servicio de alertas. Usando datos placeholders.');
    }
  };

  useEffect(() => {
    // fetchUsersCount();
    // fetchCropsCount();
    // fetchAlertsCount();

    // placeholders mientras no hay WS
    setUsersCount(26);
    setCropsCount(12);
    setAlertsCount(4);
  }, []);
  /* ---------------------------------------------------- */

  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-64 mb-8"
        style={{ backgroundImage: "url('/assets/images/admin.webp')" }}
      >
        <div className="absolute inset-0 bg-white opacity-40" />
        <div className="relative flex items-center justify-center h-full">
          <div className="text-center z-10">
            <h1 className="text-4xl font-poppins font-semibold text-white mb-2">
              Bienvenido, Administrador
            </h1>
            <p className="text-lg font-poppins text-white">
              Supervisa usuarios y administra cultivos
            </p>
          </div>
        </div>
      </section>

      {/* ---------- CONTENEDOR CENTRADO DE ESTADÍSTICAS ---------- */}
      <div className="max-w-4xl mx-auto w-full px-4 mb-8">
        <div className="bg-gray-200 p-8 rounded-lg shadow-md">
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* USUARIOS */}
            <div className="flex flex-col items-center gap-2">
              <FaUser className="text-verde-profundo text-5xl" />
              <h3 className="text-xl font-poppins text-verde-profundo">
                Usuarios Registrados
              </h3>
              <p className="text-3xl font-bold">{usersCount}</p>
            </div>

            {/* CULTIVOS */}
            <div className="flex flex-col items-center gap-2">
              <FaLeaf className="text-verde-profundo text-5xl" />
              <h3 className="text-xl font-poppins text-verde-profundo">
                Cultivos Activos
              </h3>
              <p className="text-3xl font-bold">{cropsCount}</p>
            </div>

            {/* ALERTAS */}
            <div className="flex flex-col items-center gap-2">
              <FaExclamationTriangle className="text-verde-profundo text-5xl" />
              <h3 className="text-xl font-poppins text-verde-profundo">
                Alertas Recientes
              </h3>
              <p className="text-3xl font-bold">{alertsCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-center space-x-6 mb-8">
        <Button variant="primary" as={Link} to="/admin/users">
          Gestionar Usuarios
        </Button>
        <Button variant="primary" as={Link} to="/admin/create-crop">
          Crear Nuevo Cultivo
        </Button>
      </div>

      <Footer className="mt-auto" />
    </div>
  );
};

export default AdminDashboard;