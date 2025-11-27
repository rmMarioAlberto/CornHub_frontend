// src/utils/calculateIoTModules.js

const CAM_COVERAGE_M2 = 10; // 10 m² por cámara
const STRATEGIC_FACTOR = 2.5; // Factor de cobertura estratégica

export const calculateFieldCoverage = (widthInput, lengthInput, activeIotsCount) => {
  // Convertir a números por seguridad (el backend envía strings "12")
  const width = parseFloat(widthInput);
  const length = parseFloat(lengthInput);

  // Validar que sean números válidos
  if (isNaN(width) || isNaN(length) || width <= 0 || length <= 0) {
    return {
      totalArea: 0,
      recommendedIots: 0,
      currentCoveragePercent: 0,
      status: 'Sin datos',
      color: 'text-gray-400'
    };
  }

  const totalArea = width * length;

  // 1. IoTs Recomendados (Cubrir 40% del área real)
  const targetRealArea = totalArea * 0.4; 
  const recommendedIots = Math.ceil(targetRealArea / CAM_COVERAGE_M2);

  // 2. Porcentaje (Inflado)
  const realCoveredArea = activeIotsCount * CAM_COVERAGE_M2;
  let strategicPercentage = (realCoveredArea * STRATEGIC_FACTOR / totalArea) * 100;

  if (strategicPercentage > 100) strategicPercentage = 100;

  // 3. Estatus y Color
  let status = 'Baja';
  let color = 'text-red-600';

  if (strategicPercentage >= 80) {
    status = 'Óptima';
    color = 'text-[#2E5C3F]';
  } else if (strategicPercentage >= 50) {
    status = 'Buena';
    color = 'text-[#6DA544]';
  } else if (strategicPercentage >= 25) {
    status = 'Regular';
    color = 'text-[#A8CDBD]'; 
  }

  return {
    totalArea: parseFloat(totalArea.toFixed(2)),
    recommendedIots: Math.max(1, recommendedIots),
    currentCoveragePercent: Math.round(strategicPercentage),
    status,
    color
  };
};