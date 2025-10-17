import React, { useState } from 'react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { calculateIoTModules } from '../utils/calculateIoTModules'; // Lógica para calcular módulos

const FieldRegistration = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [size, setSize] = useState('');
  const [rows, setRows] = useState('');
  const [devices, setDevices] = useState(0);
  const [simulation, setSimulation] = useState(null);

  const handleSimulate = () => {
    const calc = calculateIoTModules(size, rows); // Calcula basados en dimensiones
    setDevices(calc.devices);
    setSimulation(calc.positions); // Array de posiciones para render
  };

  return (
    <div className="p-6 flex">
      <div className="w-1/2">
        <h2>Simulación de Campo</h2>
        <div className="bg-green-100 h-64 relative"> {/* Simulación simple */}
          {simulation?.map((pos, idx) => (
            <div key={idx} style={{ position: 'absolute', left: `${pos.x}%`, top: `${pos.y}%` }} className="bg-verde-brillante w-4 h-4 rounded-full"></div>
          ))}
        </div>
      </div>
      <div className="w-1/2 pl-6">
        <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Tipo de Planta" value={type} onChange={(e) => setType(e.target.value)} />
        <Input label="Tamaño (m²)" value={size} onChange={(e) => setSize(e.target.value)} type="number" />
        <Input label="Número de Surcos" value={rows} onChange={(e) => setRows(e.target.value)} type="number" />
        <Button onClick={handleSimulate}>Simular Distribución</Button>
        <p>Dispositivos recomendados: {devices}</p>
        <Button variant="primary" className="mt-4">Guardar Cultivo</Button>
      </div>
    </div>
  );
};

export default FieldRegistration;