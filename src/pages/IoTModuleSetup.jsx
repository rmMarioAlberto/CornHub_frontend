// src/pages/IoTModuleSetup.jsx
import React from 'react';
import AdminHeader from '../components/admin/AdminHeader';
import Footer from '../components/common/Footer';
import IoTModuleManager from '../components/admin/IoTModuleManager';

const IoTModuleSetup = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      <main className="container-main flex-1 px-4 py-8">
        <h1 className="mb-8">Configuración de Módulos IoT</h1>
        <IoTModuleManager />
      </main>
      <Footer className="mt-auto" />
    </div>
  );
};

export default IoTModuleSetup;