// src/pages/FieldDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, AlertTriangle, Camera, Thermometer, Droplet, FlaskConical, 
  LayoutDashboard, Filter, Calendar, CheckSquare, Square 
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

import { api } from '../api/apiClient';
import { getIotsParcela } from '../api/iot';
import useAuth from '../hooks/useAuth';
import FarmerHeader from '../components/farmer/FarmerHeader';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import AlertBanner from '../components/farmer/AlertBanner';

import FieldMap from '../components/farmer/FieldMap';
import { calculateFieldCoverage } from '../utils/calculateIoTModules';

const FieldDetails = () => {
  const { id } = useParams();
  const { auth } = useAuth();

  // Estados de Datos
  const [cycleData, setCycleData] = useState(null);
  const [parcelaInfo, setParcelaInfo] = useState(null);
  const [fieldIots, setFieldIots] = useState([]);
  const [coverageData, setCoverageData] = useState(null);
  
  // Estados de Filtros
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedIots, setSelectedIots] = useState([]); // Array de IDs

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar datos del ciclo (ahora acepta filtros)
  const fetchCycleData = async (filters = {}) => {
    try {
      const payload = { 
        idParcela: Number(id),
        ...filters
      };
      
      const resCycle = await api.post('/parcela/dataParcela', payload);
      const cycleBody = resCycle.data || resCycle;
      setCycleData(cycleBody.data || cycleBody);
    } catch (cycleErr) {
       if (!cycleErr.message?.includes('404') && cycleErr.response?.status !== 404) {
         console.error("Error cargando ciclo:", cycleErr);
       } else {
         setCycleData(null); // 404 es válido si no hay ciclo
       }
    }
  };

  // Carga Inicial
  useEffect(() => {
    const initLoad = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Info Parcela
        const resInfo = await api.get('/parcela/getParcelasUser');
        const infoBody = resInfo.data || resInfo;
        const listaParcelas = infoBody.parcelas || [];
        const foundInfo = listaParcelas.find(p => p.id_parcela === Number(id));
        setParcelaInfo(foundInfo || { nombre: 'Parcela desconocida', ancho: 0, largo: 0 });

        // 2. IoTs (Necesarios para el mapa y para llenar el filtro)
        if (foundInfo) {
            const resIots = await getIotsParcela(Number(id));
            const iotsBody = resIots.data || resIots; 
            const iotsList = Array.isArray(iotsBody) ? iotsBody : [];
            setFieldIots(iotsList);

            // Calcular cobertura
            const activeIots = iotsList.filter(i => i.status === 1).length;
            const stats = calculateFieldCoverage(foundInfo.ancho, foundInfo.largo, activeIots);
            setCoverageData(stats);
        }

        // 3. Cargar Ciclo (Sin filtros iniciales)
        await fetchCycleData();

      } catch (err) {
        console.error(err);
        setError('Error al cargar la información de la parcela');
      } finally {
        setLoading(false);
      }
    };

    if (auth?.accessToken) initLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, auth]);

  // Manejador de Filtros
  const handleApplyFilters = () => {
      const filters = {};
      if (selectedIots.length > 0) filters.idIots = selectedIots;
      if (startDate) filters.fechaInicio = startDate;
      if (endDate) filters.fechaFin = endDate;

      // Recargar datos del ciclo con los filtros
      setLoading(true);
      fetchCycleData(filters).finally(() => setLoading(false));
  };

  // Manejador de selección de IoTs en el filtro
  const toggleIotSelection = (iotId) => {
      setSelectedIots(prev => 
          prev.includes(iotId) 
          ? prev.filter(id => id !== iotId) 
          : [...prev, iotId]
      );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <FarmerHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-16 h-16 border-8 border-green-700 border-t-transparent rounded-full mx-auto mb-6"></div>
            <p className="text-2xl text-gray-700">Cargando detalles...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <FarmerHeader />
        <main className="flex-1 container-main py-20 text-center">
          <AlertTriangle className="w-24 h-24 text-red-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-red-700 mb-4">Error</h2>
          <p className="text-xl text-gray-600 mb-8">{error}</p>
          <Link to="/farmer">
            <Button variant="primary">Volver al Dashboard</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const hasCycle = cycleData && cycleData.stages;
  const currentStage = hasCycle ? cycleData.stages[cycleData.current_stage_index] : null;
  
  // Datos para gráficos
  const readings = hasCycle ? cycleData.stages.flatMap(s => s.readings) : [];
  // Ordenar cronológicamente
  const sortedReadings = readings.sort((a, b) => new Date(a.hora) - new Date(b.hora)); 
  // Si no hay filtros de fecha, limitamos a 20 para que no se sature la gráfica por defecto,
  // pero si hay filtros, mostramos todo lo que devolvió el backend.
  const displayReadings = (startDate || endDate) ? sortedReadings : sortedReadings.slice(-20);

  const chartData = displayReadings.map(r => {
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-poppins">
      <FarmerHeader />

      {/* Hero - Color de Texto Ajustado */}
      <section className="bg-gradient-to-b from-[#2E5C3F] to-[#1e3d2a] text-white py-16 shadow-md">
        <div className="container-main">
          <Link to="/farmer" className="inline-flex items-center gap-2 text-white hover:text-[#C3D18D] mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Volver al Dashboard
          </Link>
          
          {/* Título con sombra para mejor contraste */}
          <h1 className="text-5xl font-bold mb-4 drop-shadow-md">
             {parcelaInfo?.nombre || 'Mi Parcela'}
          </h1>
          
          {hasCycle ? (
            <>
                <p className="text-2xl opacity-90 font-light text-gray-100">
                    {cycleData.cultivo_name} • Ciclo #{cycleData.ciclo_num}
                </p>
                <p className="text-xl mt-2 text-[#C3D18D] font-medium">
                    Etapa actual: {currentStage.stage_name}
                </p>
            </>
          ) : (
            <p className="text-xl opacity-80">Sin ciclo de cultivo activo</p>
          )}
        </div>
      </section>

      <main className="flex-1 container-main py-12 space-y-12">

        {/* 1. MAPA Y COBERTURA */}
        {coverageData && (
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats Panel */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-1 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-green-800 mb-6 flex items-center gap-2">
                            <LayoutDashboard className="w-5 h-5" /> Cobertura del Campo
                        </h3>
                        
                        <div className="text-center py-4">
                            <div className="relative w-32 h-32 mx-auto mb-4 rounded-full border-8 border-gray-100 flex items-center justify-center">
                                <div className="text-3xl font-bold text-green-800">{coverageData.currentCoveragePercent}%</div>
                            </div>
                            <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Cobertura Estratégica</p>
                            <p className={`text-lg font-bold mt-1 ${coverageData.color}`}>
                                {coverageData.status}
                            </p>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4 text-sm space-y-3 text-gray-600">
                        <div className="flex justify-between">
                            <span>Dimensiones:</span>
                            <span className="font-semibold text-gray-800">{parcelaInfo.ancho}m x {parcelaInfo.largo}m</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Área Total:</span>
                            <span className="font-semibold text-gray-800">{coverageData.totalArea} m²</span>
                        </div>
                        <div className="flex justify-between">
                            <span>IoTs Activos:</span>
                            <span className="font-semibold text-gray-800">{fieldIots.filter(i=>i.status===1).length}</span>
                        </div>
                        <div className="flex justify-between bg-green-50 p-2 rounded text-green-800">
                            <span>Recomendados:</span>
                            <span className="font-bold">{coverageData.recommendedIots} dispositivos</span>
                        </div>
                    </div>
                </div>

                {/* Mapa */}
                <div className="lg:col-span-2">
                    <FieldMap 
                        width={parseFloat(parcelaInfo.ancho)} 
                        length={parseFloat(parcelaInfo.largo)} 
                        iots={fieldIots} 
                    />
                </div>
            </section>
        )}

        {/* 2. SECCIÓN DE FILTROS (NUEVO) */}
        {hasCycle && (
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-[#2E5C3F] mb-4 flex items-center gap-2">
                    <Filter className="w-5 h-5" /> Filtros de Monitoreo
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                    {/* Rango de Fechas */}
                    <div>
                        <label className="block text-sm text-gray-600 mb-1 font-medium">Fecha Inicio</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                            <input 
                                type="date" 
                                className="w-full pl-10 p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#6DA544] outline-none"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1 font-medium">Fecha Fin</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                            <input 
                                type="date" 
                                className="w-full pl-10 p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#6DA544] outline-none"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Selección de IoTs */}
                    <div className="lg:col-span-1">
                        <label className="block text-sm text-gray-600 mb-1 font-medium">Dispositivos IoT</label>
                        <div className="flex flex-wrap gap-2">
                            {fieldIots.map(iot => (
                                <button 
                                    key={iot.id_iot}
                                    onClick={() => toggleIotSelection(iot.id_iot)}
                                    className={`text-xs px-3 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                                        selectedIots.includes(iot.id_iot) 
                                        ? 'bg-[#2E5C3F] text-white border-[#2E5C3F]' 
                                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {selectedIots.includes(iot.id_iot) ? <CheckSquare size={14}/> : <Square size={14}/>}
                                    {iot.descripcion || `IoT #${iot.id_iot}`}
                                </button>
                            ))}
                            {fieldIots.length === 0 && <span className="text-xs text-gray-400 italic">No hay dispositivos.</span>}
                        </div>
                    </div>

                    {/* Botón Aplicar */}
                    <div>
                        <Button 
                            variant="primary" 
                            className="w-full py-2 bg-[#6DA544] hover:bg-[#5c8d39]"
                            onClick={handleApplyFilters}
                        >
                            Aplicar Filtros
                        </Button>
                    </div>
                </div>
            </section>
        )}

        {/* 3. Resto de Secciones (Gráficos, Alertas, Fotos) */}
        {hasCycle && (
          <>
            {/* Alertas */}
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
                  <Thermometer className="w-8 h-8 text-orange-600" /> Temperatura (°C)
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
                  <Droplet className="w-8 h-8 text-blue-600" /> Humedad (%)
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
                  <FlaskConical className="w-8 h-8 text-indigo-600" /> pH del sustrato
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

            {/* Fotos */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
                <Camera className="inline-block w-10 h-10 mr-3" />
                Últimas fotografías del cultivo
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Invertimos y tomamos las últimas 6 */}
                {[...currentStage.readings].reverse().slice(0, 6).map((reading, i) => (
                  <div key={i} className="card overflow-hidden group">
                    <div className="relative h-64">
                        <img
                        src={reading.imagen || '/assets/images/test.jpg'}
                        alt={`Foto tomada el ${new Date(reading.hora).toLocaleString()}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                         {/* Badge IA */}
                         <div className="absolute top-2 right-2">
                            <span className={`px-2 py-1 rounded text-xs font-bold bg-white/90 shadow-sm ${
                                reading.image_result?.toLowerCase().includes('healthy') || reading.image_result?.toLowerCase().includes('sana') 
                                ? 'text-green-700' : 'text-red-600'
                            }`}>
                                {reading.image_result || 'Analizando...'}
                            </span>
                        </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-600 font-bold">
                        {new Date(reading.hora).toLocaleString('es-MX')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="text-center">
          <Link to="/farmer">
            <Button variant="primary" size="lg" className="px-12 py-4 text-xl shadow-lg">
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