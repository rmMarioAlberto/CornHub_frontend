import React from 'react';
import Chart from '../components/common/Chart';
import AlertBanner from '../components/farmer/AlertBanner'; // Asume componente
import ChatbotWidget from '../components/chatbot/ChatbotWidget';

const FarmerDashboard = () => {
  const sensorData = {
    labels: ['Hora 1', 'Hora 2'], // Placeholder
    datasets: [{ label: 'Humedad', data: [50, 55], borderColor: '#6DA544' }],
  };

  return (
    <div className="p-6">
      <header className="bg-verde-profundo text-white p-4"> {/* Similar a admin */} </header>
      <h1 className="text-3xl my-6">Mis Cultivos</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <img src="cloudinary-image-url" alt="Cultivo" /> {/* Desde Cloudinary */}
          <p>Estado: Bueno</p>
          <p>Humedad: 50%</p>
          <p>Temperatura: 25°C</p>
        </div>
        <Chart data={sensorData} options={{ responsive: true }} />
      </div>
      <AlertBanner>Alerta: Posible plaga detectada.</AlertBanner>
      <ChatbotWidget />
    </div>
  );
};

export default FarmerDashboard;