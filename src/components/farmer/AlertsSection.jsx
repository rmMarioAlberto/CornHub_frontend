// src/components/farmer/AlertsSection.jsx
import React from 'react';

const AlertsSection = () => {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">Alertas</h3>
        <div className="text-2xl">Bell Icon</div>
      </div>
      <p className="text-sm text-gray-600 mt-2">Se detectó un movimiento</p>
    </div>
  );
};

export default AlertsSection;