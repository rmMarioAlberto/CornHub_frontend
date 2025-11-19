// src/pages/FarmerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Thermometer, Droplet, Leaf, Bell, MessageCircle } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { API_URL } from '../utils/env';
import FarmerHeader from '../components/farmer/FarmerHeader';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import ChatbotWidget from '../components/chatbot/ChatbotWidget';

// Datos mock por si el backend falla
const MOCK_PARCELAS = [
  { id_parcela: 1, nombre: 'Parcela Norte', descripcion: 'Lechugas romanas' },
  { id_parcela: 2, nombre: 'Invernadero 1', descripcion: 'Experimento hidropónico' },
];

const FarmerDashboard = () => {
  const { auth } = useAuth();
  const [parcelas, setParcelas] = useState([]);
  const [selectedParcela, setSelectedParcela] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParcelas = async () => {
      if (!auth?.accessToken) {
        setError('No autenticado');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/parcela/getParcelasUser`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${auth.accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`Error ${res.status}`);
        }

        const json = await res.json();

        const parcelasArray = Array.isArray(json.parcelas) ? json.parcelas : json;

        if (Array.isArray(parcelasArray) && parcelasArray.length > 0) {
          setParcelas(parcelasArray);
          setSelectedParcela(parcelasArray[0]);
        } else {
          setParcelas([]);
        }
      } catch (err) {
        console.warn('Error al cargar parcelas del backend → usando mock', err);
        setParcelas(MOCK_PARCELAS);
        setSelectedParcela(MOCK_PARCELAS[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchParcelas();
  }, [auth?.accessToken]);

  if (loading) {
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

  if (error || parcelas.length === 0) {
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <FarmerHeader />

      {/* Hero con nombre de parcela */}
      <section
        className="hero-section relative h-80 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/images/cultivo.jpg')" }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="text-5xl md:text-6xl font-bold mb-3">
            {selectedParcela?.nombre || 'Mis Cultivos'}
          </h1>
          <p className="text-xl md:text-2xl">
            Monitoreo en tiempo real
          </p>
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
                const nueva = parcelas.find(p => p.id_parcela === Number(e.target.value));
                setSelectedParcela(nueva || null);
              }}
            >
              {parcelas.map((parcela) => (
                <option key={parcela.id_parcela} value={parcela.id_parcela}>
                  {parcela.nombre} {parcela.descripcion ? `- ${parcela.descripcion}` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tarjetas de sensores */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <SensorCard icon={<Thermometer className="w-12 h-12 text-orange-600" />} label="Temperatura" value="24.8°C" status="success" />
          <SensorCard icon={<Droplet className="w-12 h-12 text-blue-600" />} label="Humedad" value="68%" status="success" />
          <SensorCard icon={<Leaf className="w-12 h-12 text-green-600" />} label="pH" value="6.5" status="success" />
          <SensorCard icon={<Leaf className="w-12 h-12 text-green-600" />} label="Salud" value="Óptima" status="success" />
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600">
            Parcela seleccionada: <strong>{selectedParcela?.nombre}</strong>
            {selectedParcela?.descripcion && ` – ${selectedParcela.descripcion}`}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            ID: {selectedParcela?.id_parcela} • Dimensiones: {selectedParcela?.largo}m × {selectedParcela?.ancho}m
          </p>
        </div>

      </main>

      {/* CHATBOT KORI - AHORA SÍ APARECE */}
      {selectedParcela && <ChatbotWidget selectedParcela={selectedParcela} />}

      <Footer />
    </div>
  );
};

// Componente reutilizable para tarjetas de sensores
const SensorCard = ({ icon, label, value, status = 'success' }) => {
  const badgeClass = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
  }[status];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 card text-center hover:shadow-xl transition-shadow">
      {icon}
      <p className="mt-4 text-gray-600 font-medium">{label}</p>
      <p className="text-4xl font-bold text-verde-profundo my-3">{value}</p>
      <span className={badgeClass}>Óptimo</span>
    </div>
  );
};

export default FarmerDashboard;