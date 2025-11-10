// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminHeader from '../components/admin/AdminHeader';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import { FaUser, FaLeaf, FaExclamationTriangle } from 'react-icons/fa';
import { API_URL } from '../utils/env';
import useAuth from '../hooks/useAuth';

const AdminDashboard = () => {
  const { auth } = useAuth();
  const adminName = auth?.user?.nombre || 'Administrador';

  const [usersCount, setUsersCount] = useState(26);
  const [cropsCount, setCropsCount] = useState(12);
  const [alertsCount, setAlertsCount] = useState(4);
  const [error, setError] = useState(null);

  // ---------- FETCH FUNCTIONS (descomentar cuando existan) ----------
  const fetchUsersCount = async () => {
    try {
      const response = await fetch(`${API_URL}/users/count`);
      if (!response.ok) throw new Error('Error al obtener usuarios');
      const { count } = await response.json();
      setUsersCount(count);
    } catch (err) {
      setError('No se pudo conectar con usuarios. Usando datos de ejemplo.');
    }
  };

  const fetchCropsCount = async () => {
    try {
      const response = await fetch(`${API_URL}/fields/active/count`);
      if (!response.ok) throw new Error('Error al obtener cultivos');
      const { count } = await response.json();
      setCropsCount(count);
    } catch (err) {
      setError('No se pudo conectar con cultivos. Usando datos de ejemplo.');
    }
  };

  const fetchAlertsCount = async () => {
    try {
      const response = await fetch(`${API_URL}/alerts/recent/count`);
      if (!response.ok) throw new Error('Error al obtener alertas');
      const { count } = await response.json();
      setAlertsCount(count);
    } catch (err) {
      setError('No se pudo conectar con alertas. Usando datos de ejemplo.');
    }
  };

  useEffect(() => {
    // Descomenta cuando el backend esté listo:
    // fetchUsersCount();
    // fetchCropsCount();
    // fetchAlertsCount();

    // Datos de ejemplo (coinciden con la imagen)
    setUsersCount(26);
    setCropsCount(12);
    setAlertsCount(4);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header con fondo negro */}
      <AdminHeader />

      {/* Hero Section */}
      <section
        className="hero-section h-64 mb-10"
        style={{ backgroundImage: "url('/assets/images/admin.webp')" }}
      >
        <div className="hero-overlay bg-black opacity-50" />
        <div className="hero-content">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Bienvenido, {adminName}
          </h1>
          <p className="text-lg md:text-xl text-white">
            Gestiona Usuarios y crea Cultivos
          </p>
        </div>
      </section>

      {/* Contenedor principal centrado */}
      <main className="container-main flex-1 px-4">
        {/* Tarjetas de estadísticas */}
        <div className="max-w-5xl mx-auto">
          {error && (
            <div className="alert-banner mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Usuarios */}
            <div className="card text-center p-6">
              <FaUser className="mx-auto text-5xl text-verde-profundo mb-3" />
              <h3 className="text-lg font-semibold text-verde-profundo">
                Usuarios
              </h3>
              <p className="text-sm text-gray-600">Registrados</p>
              <p className="text-4xl font-bold text-gray-800 mt-2">
                {usersCount}
              </p>
            </div>

            {/* Cultivos Activos */}
            <div className="card text-center p-6">
              <FaLeaf className="mx-auto text-5xl text-verde-profundo mb-3" />
              <h3 className="text-lg font-semibold text-verde-profundo">
                Cultivos activos
              </h3>
              <p className="text-sm text-gray-600">En monitoreo</p>
              <p className="text-4xl font-bold text-gray-800 mt-2">
                {cropsCount}
              </p>
            </div>

            {/* Alertas Recientes */}
            <div className="card text-center p-6">
              <FaExclamationTriangle className="mx-auto text-5xl text-verde-profundo mb-3" />
              <h3 className="text-lg font-semibold text-verde-profundo">
                Alertas recientes
              </h3>
              <p className="text-sm text-gray-600">Últimas 24h</p>
              <p className="text-4xl font-bold text-gray-800 mt-2">
                {alertsCount}
              </p>
            </div>
          </div>

          {/* Botones de acción */}
          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="primary" as={Link} to="/admin/users">
              Gestionar Usuarios
            </Button>
            <Button variant="primary" as={Link} to="/admin/iot">
              Gestionar IoT
            </Button>
            <Button variant="primary" as={Link} to="/admin/fields">
              Gestionar Parcelas
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer className="mt-auto" />
    </div>
  );
};

export default AdminDashboard;