// src/components/farmer/CropCard.jsx
import React from 'react';

const CropCard = ({ crop }) => {
  const hasPlague = Math.random() > 0.7;
  const humidity = Math.floor(Math.random() * 40) + 40;
  const temperature = (Math.random() * 10 + 20).toFixed(1);

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col md:flex-row gap-6">
      <div className="flex-shrink-0">
        <div className="relative">
          <img
            src="/assets/images/cultivo.jpg"
            alt={crop.nombre}
            className="w-48 h-48 object-cover rounded-lg"
          />
          <div className={`absolute top-2 left-2 w-4 h-4 rounded-full ${hasPlague ? 'bg-red-500' : 'bg-green-500'}`} />
        </div>
        <p className="text-center mt-2 font-medium">{crop.nombre}</p>
      </div>

      <div className="flex-1">
        <h3 className="text-xl font-bold mb-3">Estado del Cultivo</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl">Leaf Icon</div>
            <p className="text-sm text-gray-600">{hasPlague ? 'Plaga detectada' : 'Sin plaga'}</p>
          </div>
          <div className="text-center">
            <div className="text-3xl">Droplet Icon</div>
            <p className="text-sm text-gray-600">{humidity}%</p>
          </div>
          <div className="text-center">
            <div className="text-3xl">Thermometer Icon</div>
            <p className="text-sm text-gray-600">{temperature}°C</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropCard;