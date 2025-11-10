// src/components/farmer/CaptureCarousel.jsx
import React from 'react';

const CaptureCarousel = () => {
  const captures = ['/assets/images/test.jpg', '/assets/images/lettuce.jpg', '/assets/images/cultivo.jpg'];

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-bold mb-3">Últimas Capturas</h3>
      <div className="flex gap-2 overflow-x-auto">
        {captures.map((src, i) => (
          <img key={i} src={src} alt={`Captura ${i+1}`} className="w-24 h-24 object-cover rounded" />
        ))}
      </div>
    </div>
  );
};

export default CaptureCarousel;