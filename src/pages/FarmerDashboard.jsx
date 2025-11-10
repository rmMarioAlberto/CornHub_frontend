// src/pages/FarmerDashboard.jsx
import React from 'react';
import FarmerHeader from '../components/farmer/FarmerHeader';
import Footer from '../components/common/Footer';
import CropCard from '../components/farmer/CropCard';
import CaptureCarousel from '../components/farmer/CaptureCarousel';
import AlertsSection from '../components/farmer/AlertsSection';
import RecommendationsSection from '../components/farmer/RecommendationsSection';
import useFarmerCrops from '../hooks/useFarmerCrops';

const FarmerDashboard = () => {
  const { crops, loading } = useFarmerCrops();

  if (loading) return <p className="text-center py-10">Cargando cultivos...</p>;

  const mainCrop = crops[0] || { nombre: 'Sin cultivo', id_cultivo: 0 };

  return (
    <div className="min-h-screen flex flex-col">
      <FarmerHeader />

      {/* Hero */}
      <section className="relative bg-cover bg-center h-64 md:h-80" style={{ backgroundImage: "url('/assets/images/home.jpg')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold">Mis Cultivos</h1>
            <p className="mt-2 text-lg">Accede y monitorea tus cultivos en tiempo real</p>
          </div>
        </div>
      </section>

      <main className="flex-1 container-main py-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Cultivo Principal */}
          <CropCard crop={mainCrop} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CaptureCarousel />
            <AlertsSection />
            <RecommendationsSection />
          </div>

          {/* Gráfico (placeholder) */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold mb-4">CT Crecimiento (mm)</h3>
            <div className="h-48 bg-gray-100 rounded flex items-end justify-around p-4">
              {[120, 140, 160, 130, 110, 90].map((h, i) => (
                <div key={i} className="bg-verde-lima w-10 rounded-t" style={{ height: `${h}px` }} />
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FarmerDashboard;