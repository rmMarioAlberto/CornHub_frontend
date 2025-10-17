import React from 'react';
import Chart from '../components/common/Chart';
// Similar a FarmerDashboard pero para un cultivo específico, con imágenes de Cloudinary y análisis IA.

const FieldDetails = ({ fieldId }) => {
  // Fetch data from API
  return (
    <div className="p-6">
      <h1>Detalles de Cultivo {fieldId}</h1>
      <img src="cloudinary-url" alt="Imagen reciente" />
      <Chart /* data from sensors */ />
      <p>Recomendación IA: Necesita más agua.</p>
    </div>
  );
};

export default FieldDetails;