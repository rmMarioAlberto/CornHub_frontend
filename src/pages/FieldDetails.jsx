// src/pages/FieldDetails.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, Camera, Thermometer, Droplet, FlaskConical, 
  LayoutDashboard, Filter, Calendar, CheckSquare, Square, ChevronDown,
  XCircle, CheckCircle, PlayCircle, MapPin, Sprout,
  Activity, Image as ImageIcon // Iconos para estados vacíos
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

import { api } from '../api/apiClient';
import { 
  getUserFields, 
  createCycle, 
  updateCurrentStage, 
  endCycle, 
  getIotsParcela 
} from '../api/fields'; 

import useAuth from '../hooks/useAuth';
import FarmerHeader from '../components/farmer/FarmerHeader';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import AlertBanner from '../components/farmer/AlertBanner';
import FieldMap from '../components/farmer/FieldMap';
import { calculateFieldCoverage } from '../utils/calculateIoTModules';

const FieldDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  
  const dropdownRef = useRef(null);

  // Estados de Datos
  const [parcelas, setParcelas] = useState([]);
  const [cycleData, setCycleData] = useState(null);
  const [parcelaInfo, setParcelaInfo] = useState(null);
  const [fieldIots, setFieldIots] = useState([]);
  const [coverageData, setCoverageData] = useState(null);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Estados de Filtros
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedIots, setSelectedIots] = useState([]); 

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cycleActionLoading, setCycleActionLoading] = useState(false);

  // --- DETECTAR CLICK FUERA DEL DROPDOWN ---
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  // --- FUNCIONES DEL CICLO ---
  const handleCreateCycle = async () => {
    if (!id) return;
    setCycleActionLoading(true);
    try {
      await createCycle(Number(id));
      await fetchCycleData(); 
    } catch (err) {
      alert(err.message || 'No se pudo crear el ciclo');
    } finally {
      setCycleActionLoading(false);
    }
  };

  const handleStageChange = async (e) => {
    const newIndex = Number(e.target.value);
    if (!cycleData || newIndex === cycleData.current_stage_index) return;

    const stageName = cycleData.stages[newIndex].stage_name;
    if (!window.confirm(`¿Avanzar a la etapa "${stageName}"? Se cerrará la etapa actual.`)) return;

    setCycleActionLoading(true);
    try {
      await updateCurrentStage(Number(id), newIndex);
      await fetchCycleData(); 
    } catch (err) {
      alert('Error al cambiar la etapa: ' + err.message);
    } finally {
      setCycleActionLoading(false);
    }
  };

  const handleEndCycle = async () => {
    if (!window.confirm("¿Estás seguro de FINALIZAR el ciclo actual?")) return;

    setCycleActionLoading(true);
    try {
      await endCycle(Number(id));
      await fetchCycleData(); 
    } catch (err) {
      alert('Error al finalizar el ciclo: ' + err.message);
    } finally {
      setCycleActionLoading(false);
    }
  };

  const fetchCycleData = async (filters = {}) => {
    if (!id) return;
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
         setCycleData(null); 
       }
    }
  };

  useEffect(() => {
    const initLoad = async () => {
      setLoading(true);
      setError(null);
      try {
        const resInfo = await getUserFields();
        const infoBody = resInfo.data || resInfo;
        const listaParcelas = Array.isArray(infoBody) ? infoBody : (infoBody.parcelas || []);
        setParcelas(listaParcelas);

        if (!id && listaParcelas.length > 0) {
            navigate(`/farmer/${listaParcelas[0].id_parcela}`, { replace: true });
            return;
        }

        if (listaParcelas.length === 0) {
            setError("No tienes parcelas registradas.");
            setLoading(false);
            return;
        }

        const currentId = Number(id);
        const foundInfo = listaParcelas.find(p => p.id_parcela === currentId);
        setParcelaInfo(foundInfo || { nombre: 'Parcela desconocida', ancho: 0, largo: 0 });

        if (foundInfo) {
            const resIots = await getIotsParcela(currentId);
            const iotsBody = resIots.data || resIots; 
            const iotsList = Array.isArray(iotsBody) ? iotsBody : [];
            setFieldIots(iotsList);

            const activeIots = iotsList.filter(i => i.status === 1).length;
            const stats = calculateFieldCoverage(foundInfo.ancho, foundInfo.largo, activeIots);
            setCoverageData(stats);
        }

        await fetchCycleData();

      } catch (err) {
        console.error(err);
        setError('Error al cargar la información de la parcela');
      } finally {
        if (id) setLoading(false);
      }
    };

    if (auth?.accessToken) initLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, auth, navigate]);

  const handleApplyFilters = () => {
      const filters = {};
      if (selectedIots.length > 0) filters.idIots = selectedIots;
      if (startDate) filters.fechaInicio = startDate;
      if (endDate) filters.fechaFin = endDate;
      setLoading(true);
      fetchCycleData(filters).finally(() => setLoading(false));
  };

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
           <div className="animate-spin w-16 h-16 border-8 border-green-700 border-t-transparent rounded-full"></div>
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
        </main>
        <Footer />
      </div>
    );
  }

  const hasCycle = cycleData && cycleData.stages;
  const isCycleActive = hasCycle && !cycleData.endDate;
  const currentStage = hasCycle ? cycleData.stages[cycleData.current_stage_index] : null;
  
  // Obtenemos lecturas y validamos que sea un array
  const readings = hasCycle ? cycleData.stages.flatMap(s => s.readings || []) : [];
  const sortedReadings = readings.sort((a, b) => new Date(a.hora) - new Date(b.hora)); 
  const displayReadings = (startDate || endDate) ? sortedReadings : sortedReadings.slice(-20);

  // Mapeo seguro para gráficas
  const chartData = displayReadings.map(r => {
    const getVal = (type) => {
        if(!r.sensores) return null;
        const s = r.sensores.find(s => s.nombre && s.nombre.toLowerCase().includes(type.toLowerCase()));
        if (!s) return null;
        const val = parseFloat(s.lectura);
        return isNaN(val) ? null : val;
    };

    return {
      hora: new Date(r.hora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      fecha: new Date(r.hora).toLocaleDateString('es-ES'),
      temperatura: getVal('temperatura'),
      humedad: getVal('humedad'),
      ph: getVal('ph'),
    };
  });

  // Cálculo SVG
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const rawPercent = coverageData ? coverageData.currentCoveragePercent : 0;
  const percent = Math.min(Math.max(parseFloat(rawPercent) || 0, 0), 100);
  const offset = circumference - (percent / 100) * circumference;

  // Variables para saber si hay datos que mostrar
  const hasData = chartData.length > 0;
  const hasStageImages = currentStage && currentStage.readings && currentStage.readings.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-poppins">
      <FarmerHeader />

      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="container-main py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-3 w-full sm:w-auto z-30" ref={dropdownRef}>
                <div className="bg-green-100 p-2 rounded-lg text-green-700">
                    <LayoutDashboard size={20} />
                </div>
                
                <div className="relative">
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-3 bg-white border border-gray-300 hover:border-green-500 text-gray-700 py-2 px-4 rounded-xl shadow-sm transition-all min-w-[240px] justify-between group"
                    >
                        <span className="font-semibold text-sm truncate max-w-[180px]">
                            {parcelaInfo?.nombre || 'Seleccionar Parcela'}
                        </span>
                        <ChevronDown size={16} className={`transition-transform duration-200 text-gray-400 group-hover:text-green-600 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-full min-w-[280px] bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-left z-50">
                            <div className="max-h-60 overflow-y-auto py-1">
                                {parcelas.map(p => (
                                    <button
                                        key={p.id_parcela}
                                        onClick={() => {
                                            navigate(`/farmer/${p.id_parcela}`);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-gray-50 transition-colors border-b last:border-0 border-gray-50 ${
                                            p.id_parcela === Number(id) ? 'bg-green-50 text-green-800 font-semibold' : 'text-gray-600'
                                        }`}
                                    >
                                        <MapPin size={16} className={p.id_parcela === Number(id) ? 'text-green-600' : 'text-gray-400'} />
                                        <div className="flex flex-col">
                                            <span>{p.nombre}</span>
                                            {p.descripcion && <span className="text-xs text-gray-400 font-normal truncate">{p.descripcion}</span>}
                                        </div>
                                        {p.id_parcela === Number(id) && <CheckCircle size={14} className="ml-auto text-green-600"/>}
                                    </button>
                                ))}
                            </div>
                            <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
                                <span className="text-xs text-gray-400">Total: {parcelas.length} parcelas</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {!isCycleActive && (
                 <Button 
                    variant="primary" 
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-200"
                    onClick={handleCreateCycle}
                    disabled={cycleActionLoading}
                >
                    <Sprout size={16} className="mr-2"/>
                    {cycleActionLoading ? 'Iniciando...' : 'Iniciar Nuevo Ciclo'}
                </Button>
            )}
        </div>
      </div>

      <section className="bg-gradient-to-b from-[#2E5C3F] to-[#1e3d2a] text-white py-16 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        <div className="container-main relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
             {parcelaInfo?.nombre || 'Mi Parcela'}
          </h1>
          
          {hasCycle ? (
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="max-w-2xl">
                    <p className="text-2xl md:text-3xl opacity-90 font-light text-gray-100 tracking-tight">
                        {cycleData.cultivo_name} <span className="text-white/40 mx-2">|</span> Ciclo #{cycleData.ciclo_num}
                    </p>
                    
                    {isCycleActive ? (
                         <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C3D18D]/20 text-[#C3D18D] border border-[#C3D18D]/30 backdrop-blur-sm">
                            <PlayCircle className="w-5 h-5" />
                            <span className="font-semibold text-lg">Etapa: {currentStage.stage_name}</span>
                        </div>
                    ) : (
                        <div className="mt-4 flex items-center gap-2 bg-green-500/20 w-fit px-5 py-3 rounded-full border border-green-400/30 backdrop-blur-sm">
                            <CheckCircle className="text-green-400 w-6 h-6" />
                            <span className="text-green-100 font-bold text-lg">Ciclo Finalizado el {new Date(cycleData.endDate).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>

                {isCycleActive && (
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-2xl min-w-[320px] lg:min-w-[400px] flex-shrink-0">
                        <h3 className="text-white/80 text-sm font-bold uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
                            Gestión del Ciclo
                        </h3>
                        <div className="flex flex-col gap-5">
                            <div>
                                <label className="text-xs text-gray-300 block mb-2 font-medium">Avanzar a la siguiente etapa</label>
                                <div className="relative group">
                                    <select
                                        className="appearance-none w-full bg-white text-gray-800 text-lg font-semibold py-3 pl-4 pr-10 rounded-xl shadow-lg focus:ring-4 focus:ring-[#6DA544]/50 focus:outline-none cursor-pointer transition-all hover:bg-gray-50"
                                        value={cycleData.current_stage_index}
                                        onChange={handleStageChange}
                                        disabled={cycleActionLoading}
                                    >
                                        {cycleData.stages.map((stage, i) => (
                                            <option key={i} value={i}>
                                                {stage.stage_name} {i === cycleData.current_stage_index ? '(Actual)' : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                        <ChevronDown className="w-6 h-6" />
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleEndCycle}
                                disabled={cycleActionLoading}
                                className="w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-all duration-300
                                bg-red-500/10 hover:bg-red-500/80 border border-red-500/30 text-red-100 hover:text-white group"
                            >
                                <XCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span>Finalizar Ciclo Actual</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
          ) : (
             <div className="bg-white/10 border border-white/20 p-8 rounded-2xl backdrop-blur-md max-w-xl mx-auto lg:mx-0 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-3">
                    <AlertTriangle className="w-8 h-8 text-yellow-400" /> 
                    Sin ciclo activo
                </h3>
                <p className="text-gray-200 text-lg mb-6 leading-relaxed">
                    Para comenzar a monitorear datos, debes iniciar un nuevo ciclo.
                </p>
                <Button 
                    variant="primary" 
                    size="lg"
                    className="w-full bg-white text-[#2E5C3F] hover:bg-gray-100 border-none font-bold text-lg py-4 shadow-lg"
                    onClick={handleCreateCycle}
                    disabled={cycleActionLoading}
                >
                    {cycleActionLoading ? 'Creando...' : 'Comenzar Ciclo Ahora'}
                </Button>
            </div>
          )}
        </div>
      </section>

      <main className="flex-1 container-main py-12 space-y-12">
        {coverageData && (
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-1 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-green-800 mb-6 flex items-center gap-2">
                            <LayoutDashboard className="w-5 h-5" /> Cobertura del Campo
                        </h3>
                        
                        <div className="text-center py-4 flex flex-col items-center">
                            <div className="relative w-40 h-40 mb-4">
                                <svg className="transform -rotate-90 w-full h-full">
                                    <circle
                                        cx="50%" cy="50%" r={radius}
                                        stroke="#e5e7eb" strokeWidth="8"
                                        fill="transparent"
                                    />
                                    <circle
                                        cx="50%" cy="50%" r={radius}
                                        stroke="#16a34a" strokeWidth="8"
                                        fill="transparent"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={offset}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center flex-col">
                                    <span className="text-3xl font-bold text-green-800">{percent}%</span>
                                </div>
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

                <div className="lg:col-span-2">
                    <FieldMap 
                        width={parseFloat(parcelaInfo.ancho)} 
                        length={parseFloat(parcelaInfo.largo)} 
                        iots={fieldIots} 
                    />
                </div>
            </section>
        )}

        {hasCycle && (
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-[#2E5C3F] mb-4 flex items-center gap-2">
                    <Filter className="w-5 h-5" /> Filtros de Monitoreo
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1 font-medium">Fecha Inicio</label>
                        <input 
                            type="date" className="w-full p-2 border rounded-lg bg-gray-50"
                            value={startDate} onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1 font-medium">Fecha Fin</label>
                        <input 
                            type="date" className="w-full p-2 border rounded-lg bg-gray-50"
                            value={endDate} onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <div className="lg:col-span-1">
                        <label className="block text-sm text-gray-600 mb-1 font-medium">Dispositivos IoT</label>
                        <div className="flex flex-wrap gap-2">
                            {fieldIots.map(iot => (
                                <button 
                                    key={iot.id_iot} onClick={() => toggleIotSelection(iot.id_iot)}
                                    className={`text-xs px-3 py-2 rounded-lg border flex items-center gap-2 ${selectedIots.includes(iot.id_iot) ? 'bg-[#2E5C3F] text-white' : 'bg-white text-gray-600'}`}
                                >
                                    {selectedIots.includes(iot.id_iot) ? <CheckSquare size={14}/> : <Square size={14}/>}
                                    {iot.descripcion || `IoT #${iot.id_iot}`}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <Button variant="primary" className="w-full py-2 bg-[#6DA544] hover:bg-[#5c8d39]" onClick={handleApplyFilters}>Aplicar Filtros</Button>
                    </div>
                </div>
            </section>
        )}

        {hasCycle && (
          <>
            {currentStage.readings && currentStage.readings.some(r => r.overall_status === 'danger') && (
              <AlertBanner className="mb-10">
                <p className="font-bold flex items-center gap-3 text-lg">
                  <AlertTriangle className="w-6 h-6" />
                  ¡Alerta crítica detectada en tu cultivo!
                </p>
                <p>Revisa las imágenes y valores de sensores inmediatamente.</p>
              </AlertBanner>
            )}

            {/* --- SECCIÓN DE GRÁFICAS (CON EMPTY STATE) --- */}
            {hasData ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="card p-8">
                    <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-3">
                    <Thermometer className="w-8 h-8 text-orange-600" /> Temperatura (°C)
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hora" />
                        <YAxis domain={['auto', 'auto']} /> 
                        <Tooltip />
                        <Line type="monotone" dataKey="temperatura" stroke="#ea580c" strokeWidth={3} dot={{ r: 4 }} connectNulls />
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
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip />
                        <Line type="monotone" dataKey="humedad" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} connectNulls />
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
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip />
                        <Line type="monotone" dataKey="ph" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4 }} connectNulls />
                    </LineChart>
                    </ResponsiveContainer>
                </div>
                </div>
            ) : (
                <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center mb-12">
                    <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Activity className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Aún no hay datos de sensores</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Tus dispositivos IoT están configurados, pero aún no han enviado lecturas para este ciclo. Los datos aparecerán aquí automáticamente en cuanto se reciban.
                    </p>
                </div>
            )}

            {/* --- SECCIÓN DE IMÁGENES (CON EMPTY STATE) --- */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
                <Camera className="inline-block w-10 h-10 mr-3" />
                Últimas fotografías del cultivo
              </h2>

              {hasStageImages ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...currentStage.readings].reverse().slice(0, 6).map((reading, i) => (
                    <div key={i} className="card overflow-hidden group">
                        <div className="relative h-64 bg-gray-100 flex items-center justify-center">
                            <img
                                src={reading.imagen || ''}
                                alt={`Foto ${new Date(reading.hora).toLocaleTimeString()}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                    e.target.onerror = null; 
                                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Imagen'; 
                                }}
                            />
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
              ) : (
                <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
                    <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ImageIcon className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">No hay fotografías capturadas</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                        No se han recibido imágenes para la etapa actual ({currentStage.stage_name}). Asegúrate de que las cámaras estén activas.
                    </p>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default FieldDetails;