// src/components/farmer/RecommendationsSection.jsx
import React from 'react';

const RecommendationsSection = () => {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">Recomendaciones</h3>
        <div className="text-2xl">Chat Bubble Icon</div>
      </div>
      <p className="text-sm text-gray-600 mt-2">Riega tu cosecha</p>
    </div>
  );
};

export default RecommendationsSection;