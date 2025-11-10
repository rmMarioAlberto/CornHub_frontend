// src/components/farmer/AlertsSection.jsx
import React from 'react';
import { Bell } from 'lucide-react';

const AlertsSection = () => {
  return (
    <div className="bg-white rounded-xl shadow p-5 card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-verde-profundo">Alertas</h3>
        <Bell className="w-6 h-6 text-verde-profundo" />
      </div>
      <p className="text-sm text-gray-600">Se detectó un movimiento</p>
    </div>
  );
};

export default AlertsSection;