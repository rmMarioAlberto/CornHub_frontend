// src/pages/FarmerDashboard.jsx
import React from 'react';
import FarmerHeader from '../components/farmer/FarmerHeader';
import Footer from '../components/common/Footer';
import CropCard from '../components/farmer/CropCard';
import CaptureCarousel from '../components/farmer/CaptureCarousel';
import AlertsSection from '../components/farmer/AlertsSection';
import RecommendationsSection from '../components/farmer/RecommendationsSection';

// DATOS MOCK (offline fallback)
const MOCK_CROPS = [
  {
    id_cultivo: 1,
    nombre: 'Lechuga Romana',
    descripcion: 'Cultivo principal en parcela 1',
  },
];

const FarmerDashboard = () => {
  // Intentar cargar datos reales, si falla → usar mock
  let crops = MOCK_CROPS;
  let loading = false;

  try {
    const { crops: realCrops, loading: realLoading } = require('../hooks/useFarmerCrops').default();
    if (!realLoading && realCrops.length > 0) {
      crops = realCrops;
    }
  } catch (err) {
    console.warn('Backend no disponible, usando datos mock');
  }

  const mainCrop = crops[0];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <FarmerHeader />

      {/* HERO */}
      <section
        className="relative bg-cover bg-center h-64 md:h-80"
        style={{ backgroundImage: "url('/assets/images/home.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold font-poppins">Mis Cultivos</h1>
            <p className="mt-2 text-lg">Accede y monitorea tus cultivos en tiempo real</p>
          </div>
        </div>
      </section>

      <main className="flex-1 container-main py-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* CULTIVO PRINCIPAL */}
          <CropCard crop={mainCrop} />

          {/* SECCIONES */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CaptureCarousel />
            <AlertsSection />
            <RecommendationsSection />
          </div>

          {/* GRÁFICO DE CRECIMIENTO */}
          <div className="bg-white rounded-xl shadow-lg p-6 card">
            <h3 className="text-xl font-bold text-verde-profundo mb-4">CT Crecimiento (mm)</h3>
            <div className="h-48 bg-gray-100 rounded-lg flex items-end justify-around p-4">
              {[85, 110, 140, 165, 155, 130].map((h, i) => (
                <div
                  key={i}
                  className="bg-verde-lima w-12 rounded-t-lg transition-all duration-300 hover:bg-verde-profundo"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2 px-2">
              <span>Lun</span>
              <span>Mar</span>
              <span>Mié</span>
              <span>Jue</span>
              <span>Vie</span>
              <span>Sáb</span>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FarmerDashboard;