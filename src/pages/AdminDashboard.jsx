// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminHeader from '../components/admin/AdminHeader';
import Footer from '../components/common/Footer';
import BackButton from '../components/common/BackButton';
import { FaUsers, FaLeaf, FaMicrochip, FaExclamationTriangle, FaArrowRight } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import { api } from '../api/apiClient';

const AdminDashboard = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const adminName = auth?.user?.nombre?.split(' ')[0] || 'Administrador';

  const [stats, setStats] = useState({
    users: null,
    parcelas: null,
    iotDevices: null,
    alerts: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [usersRes, parcelasRes, iotRes] = await Promise.all([
          api.get('/users/getUsers'),
          api.get('/parcela/getParcelas'),
          api.get('/iot/all')
        ]);

        const usersCount = usersRes.users?.length ?? usersRes.data?.length ?? 0;
        const parcelasCount = parcelasRes.parcelas?.length ?? parcelasRes.data?.length ?? 0;
        const iotCount = Array.isArray(iotRes.data) ? iotRes.data.length : 0;

        const alertsCount = 0;

        setStats({
          users: usersCount,
          parcelas: parcelasCount,
          iotDevices: iotCount,
          alerts: alertsCount,
        });
      } catch (err) {
        console.error('Error cargando dashboard:', err);

        // ← CAMBIO CORRECTO: ahora sí muestra el mensaje real del backend
        if (err.response?.status === 429) {
          setError(err.response?.data?.message || 'Demasiadas peticiones. Intenta nuevamente en 20 segundos.');
        } else {
          setError(err.message || 'Error desconocido al cargar los datos');
        }

        setStats({ users: 0, parcelas: 0, iotDevices: 0, alerts: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCardButton = ({ icon: Icon, title, subtitle, value, to, color = "text-[#2E7D32]", bgHover = "hover:bg-[#4CAF50]/10" }) => (
    <button
      onClick={() => navigate(to)}
      className={`
        group relative card p-8 text-center rounded-2xl
        transition-all duration-300 transform hover:scale-105
        border-2 border-transparent hover:border-[#4CAF50]
        hover:shadow-2xl cursor-pointer overflow-hidden
        ${bgHover}
      `}
      aria-label={`Ir a gestión de ${title.toLowerCase()}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#4CAF50]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <Icon className={`mx-auto text-6xl mb-5 ${color} opacity-90 group-hover:opacity-100 transition-all`} />
      
      <h3 className="text-xl font-bold text-[#2E7D32] mb-2 group-hover:text-[#1B5E20] transition-colors">
        {title}
      </h3>
      
      <p className="text-sm text-gray-600 mb-4">{subtitle}</p>
      
      <div className="text-5xl font-extrabold text-gray-800 mb-3">
        {loading ? (
          <span className="text-gray-400">...</span>
        ) : value !== null && value > 0 ? (
          value
        ) : (
          <span className="text-gray-400 text-4xl">---</span>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 text-[#4CAF50] font-semibold text-sm opacity--0 group-hover:opacity-100 transition-all">
        Gestionar
        <FaArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 flex flex-col">
      <AdminHeader />

      {/* Hero */}
      <section
        className="relative h-80 mb-12 overflow-hidden"
        style={{
          backgroundImage: "url('/assets/images/admin.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Bienvenido, {adminName}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium drop-shadow">
            Panel de Administración • Lettucecurity 2025
          </p>
        </div>
      </section>

      <main className="flex-1 container-main px-6">
        <div className="max-w-7xl mx-auto">

          {error && (
            <div className="alert-banner mb-8 text-center">
              {error}
            </div>
          )}

          {/* Tarjetas Interactivas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <StatCardButton
              icon={FaUsers}
              title="Usuarios"
              subtitle="Registrados en el sistema"
              value={stats.users}
              to="/admin/users"
            />
            <StatCardButton
              icon={FaLeaf}
              title="Parcelas"
              subtitle="Cultivos en monitoreo"
              value={stats.parcelas}
              to="/admin/fields"
            />
            <StatCardButton
              icon={FaMicrochip}
              title="Dispositivos IoT"
              subtitle="Conectados activamente"
              value={stats.iotDevices}
              to="/admin/iot"
            />
            <StatCardButton
              icon={FaExclamationTriangle}
              title="Alertas Activas"
              subtitle="Requieren atención inmediata"
              value={stats.alerts}
              to="/admin/alerts"
              color="text-orange-600"
              bgHover="hover:bg-orange-50"
            />
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#2E7D32] mb-8">
              Acciones Rápidas
            </h2>
            <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
              Haz clic en cualquier tarjeta para gestionar directamente el módulo correspondiente
            </p>
          </div>
        </div>
      </main>

      <Footer className="mt-16" />
    </div>
  );
};

export default AdminDashboard;