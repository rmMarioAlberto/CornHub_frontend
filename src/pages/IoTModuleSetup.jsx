import React from 'react';
import Button from '../components/common/Button';

const IoTModuleSetup = () => {
  return (
    <div className="p-6">
      <h1>Configuración de Módulos IoT</h1>
      <p>Vincula módulos principales/secundarios.</p>
      <Button>Agregar Módulo</Button>
      {/* Lista de módulos, posiciones, etc. */}
    </div>
  );
};

export default IoTModuleSetup;