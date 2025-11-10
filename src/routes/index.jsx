// src/routes/index.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';

// --- PÁGINAS PÚBLICAS ---
import Home from '../pages/Home';
import Login from '../pages/Login';
// import Register from '../pages/Register';

// // --- IMPORTA TODAS LAS VISTAS (para desarrollo directo) ---
import AdminDashboard from '../pages/AdminDashboard';
// import FarmerDashboard from '../pages/FarmerDashboard';
// import FieldRegistration from '../pages/FieldRegistration';
// import FieldDetails from '../pages/FieldDetails';
import IoTModuleSetup from '../pages/IoTModuleSetup';
// import Profile from '../pages/Profile';
// import NotFound from '../pages/NotFound';
// import UserList from '../components/admin/UserList';

/* -------------------------------------------------------------------------- */
/*  RUTAS TEMPORALES PARA DESARROLLO                                          */
/* -------------------------------------------------------------------------- */
const AppRoutes = () => { ///////////// Proteger rutas por rol
  return (
    <Routes>

      {/* ====================== RUTA RAÍZ (usar Home por defecto) ====================== */}
      <Route path="/" element={<Home />} />

      {/* ====================== RUTAS DIRECTAS (sin login) ====================== */}
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/iot" element={<IoTModuleSetup />} />
      {/* <Route path="/admin" element={<ProtectedRoute allowedRoles={[2]}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/iot" element={<ProtectedRoute allowedRoles={[2]}><IoTModuleSetup /></ProtectedRoute>} /> */}
      {/* <Route path="/register" element={<Register />} />
      <Route path="/farmer" element={<FarmerDashboard />} />
      <Route path="/create-field" element={<FieldRegistration />} />
      <Route path="/field/:id" element={<FieldDetails />} />
      <Route path="/admin/users" element={<UserList />} />
      <Route path="/profile" element={<Profile />} /> */}

      {/* ====================== RUTAS ORIGINALES COMENTADAS ====================== */}
      {/* <Route element={<ProtectedRoute allowedRoles={[2]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserList />} />
        <Route path="/admin/iot" element={<IoTModuleSetup />} />
      </Route> */}

      {/* <Route element={<ProtectedRoute allowedRoles={[1, 2]} />}>
        <Route path="/farmer" element={<FarmerDashboard />} />
        <Route path="/create-field" element={<FieldRegistration />} />
        <Route path="/field/:id" element={<FieldDetails />} />
        <Route path="/profile" element={<Profile />} />
      </Route> */}

      {/* ====================== 404 ====================== */}
      {/* <Route path="*" element={<NotFound />} /> */}

    </Routes>
  );
};

export default AppRoutes;