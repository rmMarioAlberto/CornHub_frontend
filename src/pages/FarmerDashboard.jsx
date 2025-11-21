// src/pages/FarmerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Thermometer,
  Droplet,
  FlaskConical,
  HeartPulse,
  AlertTriangle,
} from 'lucide-react';

import useAuth from '../hooks/useAuth';
import { api } from '../api/apiClient'; // ← Usamos apiClient
import FarmerHeader from '../components/farmer/FarmerHeader';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import AlertBanner from '../components/farmer/AlertBanner';
import ChatbotWidget from '../components/chatbot/ChatbotWidget';

// Datos mock (solo se usan si el backend falla)
const MOCK_PARCELAS = [
  { id_parcela: 1, nombre: 'Parcela Norte', descripcion: 'Lechugas romanas', largo: 50, ancho: 30 },
  { id_parcela: 2, nombre: 'Invernadero 1', descripcion: 'Hidropónico experimental', largo: 40, ancho: 25 },
];

/* -------------------------------------------------------------------------- */
/*                        Cálculo de valores del dashboard                    */
/* -------------------------------------------------------------------------- */
const getDashboardData = (cycleData) => {
  if (!cycleData) {
    return {
      temp: '--',
      hum: '--',
      ph: '--',
      health: 'Sin ciclo activo',
      tempStatus: 'warning',
      humStatus: 'warning',
      phStatus: 'warning',
      healthStatus: 'warning',
    };
  }

  const allReadings = cycleData.stages.flatMap((s) => s.readings || []);

  if (allReadings.length === 0) {
    return {
      temp: 'Sin datos',
      hum: 'Sin datos',
      ph: 'Sin datos',
      health: 'Sin datos recientes',
      tempStatus: 'warning',
      humStatus: 'warning',
      phStatus: 'warning',
      healthStatus: 'warning',
    };
  }

  // Última lectura por módulo IoT
  const latestPerIot = {};
  allReadings.forEach((r) => {
    const date = new Date(r.hora);
    if (!latestPerIot[r.id_iot] || date > latestPerIot[r.id_iot].date) {
      latestPerIot[r.id_iot] = { reading: r, date };
    }
  });

  const latestReadings = Object.values(latestPerIot).map((o) => o.reading);

  const temps = [];
  const hums = [];
  const phs = [];

  let tempStatus = 'success';
  let humStatus = 'success';
  let phStatus = 'success';
  let healthStatus = 'success';

  latestReadings.forEach((reading) => {
    reading.sensores.forEach((s) => {
      const val = parseFloat(s.lectura);
      if (isNaN(val)) return;

      const lowerName = s.nombre.toLowerCase();

      if (lowerName.includes('temperatura')) {
        temps.push(val);
        if (s.status === 'danger') tempStatus = 'danger';
        else if (s.status === 'warning' && tempStatus !== 'danger') tempStatus = 'warning';
      }
      if (lowerName.includes('humedad')) {
        hums.push(val);
        if (s.status === 'danger') humStatus = 'danger';
        else if (s.status === 'warning' && humStatus !== 'danger') humStatus = 'warning';
      }
      if (lowerName.includes('ph') || lowerName.includes('p h')) {
        phs.push(val);
        if (s.status === 'danger') phStatus = 'danger';
        else if (s.status === 'warning' && phStatus !== 'danger') phStatus = 'warning';
      }

      // Salud general
      if (s.status === 'danger' || reading.overall_status === 'danger') healthStatus = 'danger';
      else if (
        (s.status === 'warning' || reading.overall_status === 'warning') &&
        healthStatus !== 'danger'
      ) {
        healthStatus = 'warning';
      }
    });
  });

  const avg = (arr) => (arr.length === 0 ? '--' : (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1));

  const healthText = {
    success: 'Óptima',
    warning: 'Requiere atención',
    danger: 'Crítico',
  }[healthStatus];

  return {
    temp: avg(temps) + ' °C',
    hum: avg(hums) + ' %',
    ph: avg(phs),
    health: healthText,
    tempStatus,
    humStatus,
    phStatus,
    healthStatus,
  };
};

/* -------------------------------------------------------------------------- */
/*                             Componente principal                           */
/* -------------------------------------------------------------------------- */
const FarmerDashboard = () => {
  const { auth } = useAuth();

  const [parcelas, setParcelas] = useState([]);
  const [selectedParcela, setSelectedParcela] = useState(null);
  const [cycleData, setCycleData] = useState(null); // null → sin ciclo, object → tiene ciclo
  const [cycleLoading, setCycleLoading] = useState(false);
  const [cycleError, setCycleError] = useState(null);
  const [loadingParcelas, setLoadingParcelas] = useState(true);

  /* ---------- Cargar lista de parcelas ---------- */
  const loadParcelas = async () => {
    try {
      const res = await api.get('/parcela/getParcelasUser');
      const array = Array.isArray(res) ? res : res.parcelas || [];
      setParcelas(array);
      if (array.length > 0) setSelectedParcela(array[0]);
    } catch (err) {
      console.warn('Backend parcelas falló → usando mock', err);
      setParcelas(MOCK_PARCELAS);
      setSelectedParcela(MOCK_PARCELAS[0]);
    } finally {
      setLoadingParcelas(false);
    }
  };

  /* ---------- Cargar datos completos del ciclo activo ---------- */
  const loadCycleData = async (idParcela) => {
    setCycleLoading(true);
    setCycleError(null);
    try {
      const { data } = await api.post('/parcela/dataParcela', { idParcela });
      setCycleData(data);
    } catch (err) {
      if (err.message?.includes('404') || err.message?.includes('No se encontró')) {
        setCycleData(null); // No hay ciclo activo
      } else {
        setCycleError(err.message || 'Error al cargar los datos del ciclo');
      }
    } finally {
      setCycleLoading(false);
    }
  };

  /* ---------- Crear nuevo ciclo ---------- */
  const handleCreateCycle = async () => {
    setCycleLoading(true);
    setCycleError(null);
    try {
      await api.post('/parcela/createCycle', { idParcela: selectedParcela.id_parcela });
      await loadCycleData(selectedParcela.id_parcela);
    } catch (err) {
      setCycleError(err.message || 'No se pudo crear el ciclo');
    } finally {
      setCycleLoading(false);
    }
  };

  /* ---------- Cambiar etapa actual ---------- */
  const handleStageChange = async (e) => {
    const newIndex = Number(e.target.value);
    if (newIndex === cycleData.current_stage_index) return;

    const stageName = cycleData.stages[newIndex].stage_name;
    if (!window.confirm(`¿Avanzar a la etapa "${stageName}"? Se cerrará la etapa actual.`)) return;

    setCycleLoading(true);
    try {
      await api.post('/parcela/updateCurrentStage', {
        idParcela: selectedParcela.id_parcela,
        stageIndex: newIndex,
      });
      await loadCycleData(selectedParcela.id_parcela);
    } catch (err) {
      alert('Error al cambiar la etapa: ' + err.message);
    } finally {
      setCycleLoading(false);
    }
  };

  /* ---------- Effects ---------- */
  useEffect(() => {
    if (auth?.accessToken) loadParcelas();
  }, [auth?.accessToken]);

  useEffect(() => {
    if (selectedParcela) loadCycleData(selectedParcela.id_parcela);
  }, [selectedParcela]);

  const dashboard = getDashboardData(cycleData);

  /* ---------- Render de carga inicial ---------- */
  if (loadingParcelas) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <FarmerHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-xl text-gray-700">Cargando tus parcelas...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ---------- Sin parcelas registradas ---------- */
  if (parcelas.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <FarmerHeader />
        <main className="flex-1 container-main py-20 text-center">
          <h2 className="text-4xl font-bold text-verde-profundo mb-6">
            ¡Bienvenido a Lettucecurity!
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Aún no tienes parcelas registradas.
          </p>
          <Link to="/field-registration">
            <Button variant="primary" className="px-10 py-4 text-lg">
              Registrar mi primera parcela
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  /* ---------- Dashboard completo ---------- */
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <FarmerHeader />

      {/* Hero */}
      <section
        className="hero-section relative h-80 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/images/cultivo.jpg')" }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="text-5xl md:text-6xl font-bold mb-3">
            {selectedParcela?.nombre || 'Mis Cultivos'}
          </h1>
          <p className="text-xl md:text-2xl">Monitoreo en tiempo real</p>
        </div>
      </section>

      <main className="flex-1 container-main py-10">

        {/* Selector de parcela */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white rounded-xl shadow-lg p-8 card">
            <label className="form-label text-lg">Parcela activa</label>
            <select
              className="input-field text-lg py-3"
              value={selectedParcela?.id_parcela || ''}
              onChange={(e) => {
                const nueva = parcelas.find((p) => p.id_parcela === Number(e.target.value));
                setSelectedParcela(nueva);
              }}
            >
              {parcelas.map((p) => (
                <option key={p.id_parcela} value={p.id_parcela}>
                  {p.nombre} {p.descripcion ? `- ${p.descripcion}` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Estado del ciclo */}
        {cycleLoading && (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-xl">Cargando datos del ciclo...</p>
          </div>
        )}

        {cycleError && (
          <div className="max-w-4xl mx-auto mb-8">
            <AlertBanner>{cycleError}</AlertBanner>
          </div>
        )}

        {/* No hay ciclo activo */}
        {!cycleLoading && cycleData === null && selectedParcela && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="card p-10 text-center">
              <h3 className="text-2xl font-bold mb-4 text-red-600">
                No hay ciclo de crecimiento activo
              </h3>
              <p className="text-lg mb-8">
                Para comenzar a recibir datos de tus módulos IoT debes iniciar un ciclo.
              </p>
              <Button variant="primary" onClick={handleCreateCycle} disabled={cycleLoading}>
                {cycleLoading ? 'Creando ciclo...' : 'Iniciar Ciclo de Crecimiento'}
              </Button>
            </div>
          </div>
        )}

        {/* Ciclo activo */}
        {!cycleLoading && cycleData && (
          <>
            {/* Información de etapa */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-green-800">
                {cycleData.cultivo_name} – Etapa:{' '}
                {cycleData.stages[cycleData.current_stage_index].stage_name}
              </h2>
              <p className="text-xl mt-4">
                Ciclo #{cycleData.ciclo_num} • Inicio:{' '}
                {new Date(cycleData.startDate).toLocaleDateString('es-ES')}
              </p>
              <p className="text-lg mt-2">
                Progreso: Etapa {cycleData.current_stage_index + 1} de {cycleData.stages.length}
              </p>

              <div className="mt-6 inline-block">
                <select
                  className="input-field py-3 px-8 text-lg rounded-lg"
                  value={cycleData.current_stage_index}
                  onChange={handleStageChange}
                  disabled={cycleLoading}
                >
                  {cycleData.stages.map((stage, i) => (
                    <option key={i} value={i}>
                      {stage.stage_name}{' '}
                      {i === cycleData.current_stage_index
                        ? '(Actual)'
                        : i > cycleData.current_stage_index
                        ? '(Pendiente)'
                        : '(Completada)'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Alertas */}
            {dashboard.healthStatus !== 'success' && (
              <div className="max-w-5xl mx-auto mb-8">
                <AlertBanner>
                  <p className="font-bold flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    ¡Atención! Se han detectado problemas en tu cultivo
                  </p>
                  <p>Revisa los detalles para más información.</p>
                </AlertBanner>
              </div>
            )}

            {/* Tarjetas de sensores */}
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <SensorCard
                icon={<Thermometer className="w-12 h-12 text-orange-600" />}
                label="Temperatura del sustrato"
                value={dashboard.temp}
                status={dashboard.tempStatus}
              />
              <SensorCard
                icon={<Droplet className="w-12 h-12 text-blue-600" />}
                label="Humedad del sustrato"
                value={dashboard.hum}
                status={dashboard.humStatus}
              />
              <SensorCard
                icon={<FlaskConical className="w-12 h-12 text-indigo-600" />}
                label="pH del sustrato"
                value={dashboard.ph}
                status={dashboard.phStatus}
              />
              <SensorCard
                icon={
                  <HeartPulse
                    className={`w-12 h-12 ${
                      dashboard.healthStatus === 'danger' ? 'text-red-600' : 'text-green-600'
                    }`}
                  />
                }
                label="Salud general"
                value={dashboard.health}
                status={dashboard.healthStatus}
              />
            </div>

            <div className="text-center">
              <Link to={`/field-details/${selectedParcela.id_parcela}`}>
                <Button variant="primary" className="px-8 py-3">
                  Ver detalles completos y gráficos
                </Button>
              </Link>
            </div>
          </>
        )}
      </main>

      {selectedParcela && <ChatbotWidget selectedParcela={selectedParcela} />}

      <Footer />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                               SensorCard (reutilizable)                     */
/* -------------------------------------------------------------------------- */
const SensorCard = ({ icon, label, value, status = 'success' }) => {
  const badgeClass = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
  }[status];

  const badgeText = {
    success: 'Óptimo',
    warning: 'Atención',
    danger: 'Crítico',
  }[status];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 card text-center hover:shadow-xl transition-shadow">
      {icon}
      <p className="mt-4 text-gray-600 font-medium">{label}</p>
      <p className="text-4xl font-bold text-verde-profundo my-3">{value}</p>
      <span className={badgeClass}>{badgeText}</span>
    </div>
  );
};

export default FarmerDashboard;