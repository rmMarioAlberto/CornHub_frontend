// src/routes/index.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';

// --- PÁGINAS PÚBLICAS ---
import Home from '../pages/Home';
import Login from '../pages/Login';

// --- PÁGINAS PROTEGIDAS ---
import AdminDashboard from '../pages/AdminDashboard';
import IoTModuleSetup from '../pages/IoTModuleSetup';
import FieldManagement from '../pages/FieldManagement';
import UserManagement from '../pages/UserManagement';
import FarmerDashboard from '../pages/FarmerDashboard';
import FieldDetails from '../pages/FieldDetails';
// import FieldRegistration from '../pages/FieldRegistration';
// import Profile from '../pages/Profile';
// import NotFound from '../pages/NotFound';

/* -------------------------------------------------------------------------- */
/*  RUTAS PROTEGIDAS POR ROL (2 = admin, 1 = farmer, 3 = IoT)                 */
/* -------------------------------------------------------------------------- */
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
        <Route path="/farmer" element={<FarmerDashboard />} />
        
        {/* Detalles completos de una parcela (gráficas, historial, etc.) */}
        <Route path="/field-details/:id" element={<FieldDetails />} />
        
        {/* Perfil del agricultor */}
        {/* <Route path="/profile" element={<Profile />} /> */}
      </Route>

      {/* ====================== RUTA 404 ====================== */}
      {/* <Route path="*" element={<NotFound />} /> */}

    </Routes>
  );
};

export default AppRoutes;