// src/components/farmer/CropCard.jsx
import React from 'react';
import { Leaf, Droplet, Thermometer } from 'lucide-react';

const CropCard = ({ crop }) => {
  const hasPlague = Math.random() > 0.8;
  const humidity = 50 + Math.floor(Math.random() * 20);
  const temperature = (22 + Math.random() * 8).toFixed(1);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 card flex flex-col md:flex-row gap-6">
      {/* Imagen del cultivo */}
      <div className="flex-shrink-0">
        <div className="relative">
          <img
            src="/assets/images/cultivo.jpg"
            alt={crop.nombre}
            className="w-48 h-48 object-cover rounded-xl shadow"
            onError={(e) => { e.target.src = '/assets/images/lettuce.jpg'; }}
          />
          <div className={`absolute top-3 left-3 w-5 h-5 rounded-full ${hasPlague ? 'bg-red-500' : 'bg-green-500'} shadow-lg`} />
        </div>
        <p className="text-center mt-3 font-semibold text-verde-profundo">{crop.nombre}</p>
      </div>

      {/* Estado del cultivo */}
      <div className="flex-1">
        <h3 className="text-2xl font-bold text-verde-profundo mb-4">Estado del Cultivo</h3>
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <Leaf className={`w-10 h-10 mx-auto mb-1 ${hasPlague ? 'text-red-500' : 'text-green-600'}`} />
            <p className="text-sm text-gray-600">{hasPlague ? 'Plaga detectada' : 'Sin plaga'}</p>
          </div>
          <div>
            <Droplet className="w-10 h-10 mx-auto mb-1 text-blue-600" />
            <p className="text-sm text-gray-600">{humidity}%</p>
          </div>
          <div>
            <Thermometer className="w-10 h-10 mx-auto mb-1 text-orange-600" />
            <p className="text-sm text-gray-600">{temperature}°C</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropCard;