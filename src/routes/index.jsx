// src/routes/index.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';

// --- PÁGINAS PÚBLICAS ---
import Home from '../pages/Home';
import Login from '../pages/Login';

// --- PÁGINAS PROTEGIDAS ---
import AdminDashboard from '../pages/AdminDashboard';
import IoTModuleSetup from '../pages/IoTModuleSetup';
import FieldManagement from '../pages/FieldManagement';
import UserManagement from '../pages/UserManagement';
// FieldDetails ahora actúa como el Dashboard del agricultor
import FieldDetails from '../pages/FieldDetails';

const AppRoutes = () => {
  return (
    <Routes>
      {/* ====================== RUTAS PÚBLICAS ====================== */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* ====================== RUTAS ADMIN (tipo_usuario = 2) ====================== */}
      <Route element={<ProtectedRoute allowedRoles={[2]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/iot" element={<IoTModuleSetup />} />
        <Route path="/admin/fields" element={<FieldManagement />} />
        <Route path="/admin/users" element={<UserManagement />} />
      </Route>

      {/* ====================== RUTAS FARMER (tipo_usuario = 1) ====================== */}
      <Route element={<ProtectedRoute allowedRoles={[1]} />}>
        {/* Ruta base: Redirige a la vista con ID o carga la primera parcela */}
        <Route path="/farmer" element={<FieldDetails />} />
        {/* Ruta con ID específico */}
        <Route path="/farmer/:id" element={<FieldDetails />} />
        
        {/* Redirección de compatibilidad por si usabas /field-details */}
        <Route path="/field-details/:id" element={<Navigate to="/farmer/:id" replace />} />
      </Route>

    </Routes>
  );
};

export default AppRoutes;