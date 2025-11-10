// src/components/farmer/CaptureCarousel.jsx
import React from 'react';

const CaptureCarousel = () => {
  const images = [
    '/assets/images/test.jpg',
    '/assets/images/lettuce.jpg',
    '/assets/images/cultivo.jpg',
  ];

  return (
    <div className="bg-white rounded-xl shadow p-5 card">
      <h3 className="font-bold text-verde-profundo mb-3">Últimas Capturas</h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Captura ${i + 1}`}
            className="w-28 h-28 object-cover rounded-lg shadow hover:scale-105 transition-transform"
            onError={(e) => { e.target.src = '/assets/images/lettuce.jpg'; }}
          />
        ))}
      </div>
    </div>
  );
};

export default CaptureCarousel;