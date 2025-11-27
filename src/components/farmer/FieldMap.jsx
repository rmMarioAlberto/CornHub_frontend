// src/components/farmer/FieldMap.jsx
import React, { useState } from 'react';
import { Wifi, Map as MapIcon } from 'lucide-react';

const FieldMap = ({ width, length, iots = [] }) => {
  const [hoveredIot, setHoveredIot] = useState(null);

  // Placeholder si no hay dimensiones
  if (!width || !length) {
    return (
      <div className="h-64 bg-[#F9FAFB] rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 font-poppins">
        <MapIcon className="w-10 h-10 mb-2 opacity-50" />
        <p>Dimensiones no definidas</p>
      </div>
    );
  }

  const aspectRatio = width / length;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full font-poppins flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-[#2E5C3F] flex items-center gap-2">
          <MapIcon className="w-5 h-5" />
          Mapa de Dispositivos
        </h3>
        <span className="text-xs font-medium bg-[#C3D18D] text-[#2E5C3F] px-3 py-1 rounded-full">
          {width}m x {length}m
        </span>
      </div>

      {/* Contenedor Principal del Mapa (Relative) */}
      <div 
        className="relative w-full bg-[#F0FDF4] rounded-lg border border-[#A8CDBD]"
        style={{ height: aspectRatio > 1.5 ? '300px' : '450px' }}
      >
        
        {/* Capa Fondo (Grid) - Esta sí lleva overflow hidden para que el grid no se salga */}
        <div className="absolute inset-0 overflow-hidden rounded-lg">
             <div className="absolute inset-0 opacity-30" 
                style={{ backgroundImage: 'radial-gradient(#6FA575 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>
        </div>

        {/* Ejes */}
        <div className="absolute bottom-2 left-2 text-xs text-gray-500 font-mono bg-white/80 px-1 rounded border border-gray-200 z-0">
          (0,0)
        </div>
        <div className="absolute bottom-2 right-2 text-xs text-gray-500 font-mono z-0">X ({width}m)</div>
        <div className="absolute top-2 left-2 text-xs text-gray-500 font-mono z-0">Y ({length}m)</div>

        {/* Capa de Pines (Sin overflow hidden para que el tooltip salga) */}
        <div className="absolute inset-0">
            {iots.map((iot, index) => {
            const x = iot.coordenada_x || 0;
            const y = iot.coordenada_y || 0;

            const leftPct = (x / width) * 100;
            const bottomPct = (y / length) * 100;

            const safeLeft = Math.min(Math.max(leftPct, 2), 96);
            const safeBottom = Math.min(Math.max(bottomPct, 2), 96);
            const isActive = iot.status === 1;

            return (
                <div
                key={iot.id_iot || index}
                className="absolute transition-all hover:scale-110 hover:z-40"
                style={{ left: `${safeLeft}%`, bottom: `${safeBottom}%` }}
                onMouseEnter={() => setHoveredIot({ ...iot, x, y, safeLeft, safeBottom })}
                onMouseLeave={() => setHoveredIot(null)}
                >
                {/* Radio de cobertura visual */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#6DA544]/20 rounded-full pointer-events-none animate-pulse hidden group-hover:block"></div>

                {/* Pin */}
                <div className={`relative p-2 rounded-full shadow-md text-white border-2 border-white cursor-pointer ${
                    isActive ? 'bg-[#6DA544]' : 'bg-gray-400'
                }`}>
                    <Wifi size={16} />
                </div>
                </div>
            );
            })}
        </div>

        {/* Tooltip Flotante (Renderizado fuera del loop para control de Z-Index) */}
        {hoveredIot && (
             <div 
                className="absolute bg-[#2E5C3F] text-white text-xs p-3 rounded-lg shadow-2xl z-50 w-max pointer-events-none transition-opacity duration-200"
                style={{ 
                    left: `${hoveredIot.safeLeft}%`, 
                    bottom: `${hoveredIot.safeBottom + 8}%`, // 8% arriba del punto
                    transform: 'translateX(-50%)' 
                }}
             >
                <p className="font-bold text-[#C3D18D] text-sm mb-1 border-b border-white/20 pb-1">
                    {hoveredIot.descripcion || `IoT #${hoveredIot.id_iot}`}
                </p>
                <div className="space-y-1">
                    <p className="opacity-90 font-mono">Coordenadas: ({hoveredIot.x}m, {hoveredIot.y}m)</p>
                    <p className="opacity-90">Sensores activos: {hoveredIot.sensor_iot?.length || 0}</p>
                    <p className={`font-bold ${hoveredIot.status === 1 ? 'text-green-300' : 'text-gray-300'}`}>
                        {hoveredIot.status === 1 ? '● En línea' : '○ Desconectado'}
                    </p>
                </div>
                {/* Flecha del tooltip */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#2E5C3F]"></div>
             </div>
        )}

      </div>

      <div className="mt-4 flex justify-center gap-6 text-xs text-gray-600 font-medium">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-[#6DA544] rounded-full"></span> Activo
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-gray-400 rounded-full"></span> Inactivo
        </div>
      </div>
    </div>
  );
};

export default FieldMap;