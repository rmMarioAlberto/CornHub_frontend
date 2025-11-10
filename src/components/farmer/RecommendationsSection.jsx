// src/components/farmer/RecommendationsSection.jsx
import React from 'react';
import { MessageCircle } from 'lucide-react';

const RecommendationsSection = () => {
  return (
    <div className="bg-white rounded-xl shadow p-5 card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-verde-profundo">Recomendaciones</h3>
        <MessageCircle className="w-6 h-6 text-verde-profundo" />
      </div>
      <p className="text-sm text-gray-600">Riega tu cosecha</p>
    </div>
  );
};

export default RecommendationsSection;