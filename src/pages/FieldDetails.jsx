// src/pages/FieldDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Camera, Thermometer, Droplet, FlaskConical } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { api } from '../api/apiClient';
import useAuth from '../hooks/useAuth';
import FarmerHeader from '../components/farmer/FarmerHeader';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import AlertBanner from '../components/farmer/AlertBanner';

const FieldDetails = () => {
  const { id } = useParams(); // id_parcela
  const { auth } = useAuth();

  const [cycleData, setCycleData] = useState(null);
  const [parcelaInfo, setParcelaInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post('/parcela/dataParcela', { idParcela: Number(id) });
        setCycleData(response.data);

        // Obtener info básica de la parcela (nombre, dimensiones, etc.)
        const parcelasRes = await api.get('/parcela/getParcelasUser');
        const parcelas = Array.isArray(parcelasRes) ? parcelasRes : parcelasRes.parcelas || [];
        const found = parcelas.find(p => p.id_parcela === Number(id));
        setParcelaInfo(found || { nombre: 'Parcela desconocida' });
      } catch (err) {
        setError(err.message || 'No se pudieron cargar los datos de la parcela');
      } finally {
        setLoading(false);
      }
    };

    if (auth?.accessToken) fetchData();
  }, [id, auth]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <FarmerHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-16 h-16 border-8 border-green-700 border-t-transparent rounded-full mx-auto mb-6"></div>
            <p className="text-2xl text-gray-700">Cargando detalles de tu cultivo...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !cycleData) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <FarmerHeader />
        <main className="flex-1 container-main py-20 text-center">
          <AlertTriangle className="w-24 h-24 text-red-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-red-700 mb-4">Error al cargar la parcela</h2>
          <p className="text-xl text-gray-600 mb-8">{error || 'No se encontraron datos'}</p>
          <Link to="/farmer">
            <Button variant="primary">Volver al Dashboard</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Preparar datos para gráficos (últimas 20 lecturas por sensor)
  const readings = cycleData.stages.flatMap(s => s.readings);
  const sortedReadings = readings.sort((a, b) => new Date(a.hora) - new Date(b.hora)).slice(-20);

  const chartData = sortedReadings.map(r => {
    const temp = r.sensores.find(s => s.nombre.toLowerCase().includes('temperatura'))?.lectura || null;
    const hum = r.sensores.find(s => s.nombre.toLowerCase().includes('humedad'))?.lectura || null;
    const ph = r.sensores.find(s => s.nombre.toLowerCase().includes('ph'))?.lectura || null;

    return {
      hora: new Date(r.hora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      fecha: new Date(r.hora).toLocaleDateString('es-ES'),
      temperatura: temp ? parseFloat(temp) : null,
      humedad: hum ? parseFloat(hum) : null,
      ph: ph ? parseFloat(ph) : null,
    };
  });

  const currentStage = cycleData.stages[cycleData.current_stage_index];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <FarmerHeader />

      {/* Hero con nombre y botón volver */}
      <section className="bg-gradient-to-b from-green-800 to-green-900 text-white py-16">
        <div className="container-main">
          <Link to="/farmer" className="inline-flex items-center gap-2 text-white hover:text-green-200 mb-6">
            <ArrowLeft className="w-5 h-5" />
            Volver al Dashboard
          </Link>
          <h1 className="text-5xl font-bold text-white mb-4">{parcelaInfo?.nombre || 'Mi Parcela'}</h1>
          <p className="text-2xl opacity-90">
            {cycleData.cultivo_name} • Ciclo #{cycleData.ciclo_num}
          </p>
          <p className="text-xl mt-2">
            Etapa actual: <strong>{currentStage.stage_name}</strong>
          </p>
        </div>
      </section>

      <main className="flex-1 container-main py-12">

        {/* Alertas críticas */}
        {currentStage.readings.some(r => r.overall_status === 'danger') && (
          <AlertBanner className="mb-10">
            <p className="font-bold flex items-center gap-3 text-lg">
              <AlertTriangle className="w-6 h-6" />
              ¡Alerta crítica detectada en tu cultivo!
            </p>
            <p>Revisa las imágenes y valores de sensores inmediatamente.</p>
          </AlertBanner>
        )}

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="card p-8">
            <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-3">
              <Thermometer className="w-8 h-8 text-orange-600" />
              Temperatura (°C)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hora" />
                <YAxis domain={[15, 35]} />
                <Tooltip />
                <Line type="monotone" dataKey="temperatura" stroke="#ea580c" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-8">
            <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-3">
              <Droplet className="w-8 h-8 text-blue-600" />
              Humedad (%)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hora" />
                <YAxis domain={[40, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="humedad" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-8">
            <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-3">
              <FlaskConical className="w-8 h-8 text-indigo-600" />
              pH del sustrato
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hora" />
                <YAxis domain={[5, 8]} />
                <Tooltip />
                <Line type="monotone" dataKey="ph" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Últimas imágenes */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
            <Camera className="inline-block w-10 h-10 mr-3" />
            Últimas fotografías del cultivo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentStage.readings.slice(-6).reverse().map((reading, i) => (
              <div key={i} className="card overflow-hidden group">
                <img
                  src={reading.imagen || '/assets/images/test.jpg'}
                  alt={`Foto tomada el ${new Date(reading.hora).toLocaleString()}`}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-4">
                  <p className="text-sm text-gray-600">
                    {new Date(reading.hora).toLocaleString('es-MX')}
                  </p>
                  <p className="font-medium mt-1">
                    Estado IA: <span className={
                      reading.image_result?.includes('sana') ? 'text-green-600' :
                      reading.image_result?.includes('plaga') ? 'text-red-600' : 'text-orange-600'
                    }>
                      {reading.image_result || 'Sin análisis'}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botón volver */}
        <div className="text-center">
          <Link to="/farmer">
            <Button variant="primary" size="lg" className="px-12 py-4 text-xl">
              Volver al Dashboard
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FieldDetails;