import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminHeader from '../components/admin/AdminHeader';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import { FaUser, FaLeaf, FaExclamationTriangle } from 'react-icons/fa'; // Asumiendo react-icons instalado
import { API_URL } from '../utils/env'; // Para las llamadas al API

const AdminDashboard = () => {
  const [usersCount, setUsersCount] = useState(26); // Placeholder hardcoded
  const [cropsCount, setCropsCount] = useState(12); // Placeholder hardcoded
  const [alertsCount, setAlertsCount] = useState(4); // Placeholder hardcoded
  const [error, setError] = useState(null);

  // Función para fetch de conteo de usuarios
  const fetchUsersCount = async () => {
    try {
      const response = await fetch(`${API_URL}/users/count`);
      if (!response.ok) throw new Error('Error al obtener conteo de usuarios');
      const data = await response.json();
      setUsersCount(data.count);
    } catch (err) {
      setError('No se pudo conectar con el servicio de usuarios. Usando datos placeholders.');
    }
  };

  // Función para fetch de conteo de cultivos activos
  const fetchCropsCount = async () => {
    try {
      const response = await fetch(`${API_URL}/fields/active/count`);
      if (!response.ok) throw new Error('Error al obtener conteo de cultivos');
      const data = await response.json();
      setCropsCount(data.count);
    } catch (err) {
      setError('No se pudo conectar con el servicio de cultivos. Usando datos placeholders.');
    }
  };

  // Función para fetch de conteo de alertas recientes
  const fetchAlertsCount = async () => {
    try {
      const response = await fetch(`${API_URL}/alerts/recent/count`);
      if (!response.ok) throw new Error('Error al obtener conteo de alertas');
      const data = await response.json();
      setAlertsCount(data.count);
    } catch (err) {
      setError('No se pudo conectar con el servicio de alertas. Usando datos placeholders.');
    }
  };

  useEffect(() => {
    // Descomenta estas líneas cuando los WS estén listos para pruebas
    // fetchUsersCount();
    // fetchCropsCount();
    // fetchAlertsCount();

    // Por ahora, setea placeholders hardcoded
    setUsersCount(26);
    setCropsCount(12);
    setAlertsCount(4);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />

      {/* Hero Section with Background Image */}
      <section
        className="relative bg-cover bg-center h-64 mb-8"
        style={{ backgroundImage: "url('/assets/images/admin.webp')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative flex items-center justify-center h-full">
          <div className="text-center z-10">
            <h1 className="text-4xl font-poppins font-semibold text-white mb-2">Bienvenido, Administrador</h1>
            <p className="text-lg font-poppins text-white">Supervisa usuarios y administra cultivos</p>
          </div>
        </div>
      </section>

      {/* Div flotante con stats */}
      <div className="mx-auto w-4/5 bg-gray-200 p-8 rounded-lg shadow-md mb-8">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex justify-around text-center">
          <div>
            <FaUser className="text-verde-profundo text-4xl mx-auto mb-2" />
            <h3 className="text-xl font-poppins text-verde-profundo">Usuarios Registrados</h3>
            <p className="text-2xl font-bold">{usersCount}</p>
          </div>
          <div>
            <FaLeaf className="text-verde-profundo text-4xl mx-auto mb-2" />
            <h3 className="text-xl font-poppins text-verde-profundo">Cultivos Activos</h3>
            <p className="text-2xl font-bold">{cropsCount}</p>
          </div>
          <div>
            <FaExclamationTriangle className="text-verde-profundo text-4xl mx-auto mb-2" />
            <h3 className="text-xl font-poppins text-verde-profundo">Alertas Recientes</h3>
            <p className="text-2xl font-bold">{alertsCount}</p>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-center space-x-4 mb-8">
        <Button variant="primary" as={Link} to="/admin/users">Gestionar Usuarios</Button>
        <Button variant="primary" as={Link} to="/admin/create-crop">Crear Nuevo Cultivo</Button>
      </div>

      <Footer className="mt-auto" />
    </div>
  );
};

export default AdminDashboard;