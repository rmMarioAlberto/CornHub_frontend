// src/utils/calculateIoTModules.js

const CAM_COVERAGE_M2 = 10; 
const STRATEGIC_FACTOR = 2.5; 

export const calculateFieldCoverage = (widthInput, lengthInput, activeIotsCount) => {
  const width = parseFloat(widthInput);
  const length = parseFloat(lengthInput);

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
  const targetRealArea = totalArea * 0.4; 
  const recommendedIots = Math.ceil(targetRealArea / CAM_COVERAGE_M2);
  const realCoveredArea = activeIotsCount * CAM_COVERAGE_M2;
  let strategicPercentage = (realCoveredArea * STRATEGIC_FACTOR / totalArea) * 100;

  if (strategicPercentage > 100) strategicPercentage = 100;

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

// --- NUEVA FUNCIÓN PARA RECOMENDAR POSICIÓN (X, Y) ---
export const calculateRecommendedPosition = (width, length, existingIots = []) => {
    const w = parseFloat(width);
    const l = parseFloat(length);
    
    if (!w || !l) return { x: 0, y: 0 };

    // Si no hay IoTs, sugerimos el centro
    if (existingIots.length === 0) {
        return { x: parseFloat((w / 2).toFixed(2)), y: parseFloat((l / 2).toFixed(2)) };
    }

    // Algoritmo simple de dispersión por cuadrícula
    // Dividimos el campo en una cuadrícula de 3x3 (9 sectores) y buscamos el sector más vacío
    const rows = 3;
    const cols = 3;
    const cellW = w / cols;
    const cellH = l / rows;

    let bestSector = { x: w/2, y: l/2, count: Infinity };

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            // Centro del sector actual
            const sectorCenterX = (c * cellW) + (cellW / 2);
            const sectorCenterY = (r * cellH) + (cellH / 2);

            // Contar cuántos IoTs existen cerca de este sector
            // (Consideramos "cerca" si están dentro de los límites del sector)
            const count = existingIots.filter(iot => {
                const ix = parseFloat(iot.coordenada_x);
                const iy = parseFloat(iot.coordenada_y);
                return ix >= (c * cellW) && ix < ((c+1) * cellW) &&
                       iy >= (r * cellH) && iy < ((r+1) * cellH);
            }).length;

            // Buscamos el sector con MENOS dispositivos (preferiblemente 0)
            if (count < bestSector.count) {
                bestSector = { 
                    x: parseFloat(sectorCenterX.toFixed(2)), 
                    y: parseFloat(sectorCenterY.toFixed(2)), 
                    count 
                };
            }
        }
    }

    return { x: bestSector.x, y: bestSector.y };
};