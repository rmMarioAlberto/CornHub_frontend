// src/routes/index.jsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// --- PÁGINAS PÚBLICAS ---
import Home from '../pages/Home';
import Login from '../pages/Login';
// import Register from '../pages/Register';

// // --- IMPORTA TODAS LAS VISTAS (para desarrollo directo) ---
// import AdminDashboard from '../pages/AdminDashboard';
// import FarmerDashboard from '../pages/FarmerDashboard';
// import FieldRegistration from '../pages/FieldRegistration';
// import FieldDetails from '../pages/FieldDetails';
// import IoTModuleSetup from '../pages/IoTModuleSetup';
// import Profile from '../pages/Profile';
// import NotFound from '../pages/NotFound';
// import UserList from '../components/admin/UserList';

/* -------------------------------------------------------------------------- */
/*  ÍNDICE DE DESARROLLO EMBEBIDO (sin archivos extra)                       */
/*  - Muestra lista de enlaces que abren cada vista en nueva pestaña         */
/*  - Usa la paleta de colores y tipografía del proyecto (Lettucecurity)     */
/*  - Totalmente temporal: elimínalo cuando termines                         */
/* -------------------------------------------------------------------------- */
const DevIndex = () => {
  const views = [
    { name: 'Home', path: '/home' },
    { name: 'Login', path: '/login' },
    { name: 'Register', path: '/register' },
    { name: 'Admin Dashboard', path: '/admin' },
    { name: 'Farmer Dashboard', path: '/farmer' },
    { name: 'Crear Cultivo', path: '/create-field' },
    { name: 'Detalle de Cultivo', path: '/field/123' },
    { name: 'Configuración IoT', path: '/admin/iot' },
    { name: 'Lista de Usuarios', path: '/admin/users' },
    { name: 'Mi Perfil', path: '/profile' },
    { name: '404 Not Found', path: '/ruta-inexistente' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Encabezado UTEQ + Proyecto */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#2E5C3F] mb-2">Lettucecurity</h1>
          <p className="text-lg text-gray-700">Índice de Vistas para Desarrollo</p>
          <p className="text-sm text-gray-500 mt-2">
            Haz clic en cualquier enlace → se abrirá en <strong>nueva pestaña</strong>
          </p>
        </div>

        {/* Lista de vistas */}
        <div className="grid gap-4 md:grid-cols-2">
          {views.map((view) => (
            <Link
              key={view.path}
              to={view.path}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-5 bg-white border-2 border-[#C3D18D] rounded-lg hover:border-[#6DA544] hover:shadow-md transition-all duration-200 text-center font-medium"
            >
              <span className="text-lg text-[#2E5C3F]">{view.name}</span>
              <span className="block text-xs text-gray-500 mt-1">{view.path}</span>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>CP Killers © 2025 | Desarrollo frontend</p>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  RUTAS TEMPORALES PARA DESARROLLO                                          */
/* -------------------------------------------------------------------------- */
const AppRoutes = () => {
  return (
    <Routes>

      {/* ====================== ÍNDICE DE DESARROLLO (raíz) ====================== */}
      <Route path="/" element={<DevIndex />} />

      {/* ====================== RUTAS DIRECTAS (sin login) ====================== */}
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/farmer" element={<FarmerDashboard />} />
      <Route path="/create-field" element={<FieldRegistration />} />
      <Route path="/field/:id" element={<FieldDetails />} />
      <Route path="/admin/iot" element={<IoTModuleSetup />} />
      <Route path="/admin/users" element={<UserList />} />
      <Route path="/profile" element={<Profile />} /> */}

      {/* ====================== RUTAS ORIGINALES COMENTADAS ====================== */}
      {/* <Route element={<ProtectedRoute allowedRoles={[1]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserList />} />
        <Route path="/admin/iot" element={<IoTModuleSetup />} />
      </Route> */}

      {/* <Route element={<ProtectedRoute allowedRoles={[2, 1]} />}>
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


//////////////////////////////////////////////////////
// // src/routes/index.js
// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import ProtectedRoute from '../components/common/ProtectedRoute';

// // --- PÁGINAS PÚBLICAS ---
// import Home from '../pages/Home';
// import Login from '../pages/Login';

// // --- PÁGINAS PROTEGIDAS (descomentar cuando estén listas) ---
// // import AdminDashboard from '../pages/AdminDashboard';
// // import FarmerDashboard from '../pages/FarmerDashboard';
// // import FieldRegistration from '../pages/FieldRegistration';
// // import FieldDetails from '../pages/FieldDetails';
// // import IoTModuleSetup from '../pages/IoTModuleSetup';
// // import Profile from '../pages/Profile';
// // import NotFound from '../pages/NotFound';

// // --- COMPONENTES INTERNOS (admin) ---
// // import UserList from '../components/admin/UserList';
// // import IoTModuleManager from '../components/admin/IoTModuleManager';

// const AppRoutes = () => {
//   return (
//     <Routes>

//       {/* ====================== RUTAS PÚBLICAS ====================== */}
//       <Route path="/" element={<Home />} />
//       <Route path="/login" element={<Login />} />

//       {/* ====================== RUTAS ADMINISTRADOR (tipo_usuario = 1) ====================== */}
//       {/* <Route element={<ProtectedRoute allowedRoles={[1]} />}>
//         <Route path="/admin" element={<AdminDashboard />} />
//         <Route path="/admin/users" element={<UserList />} />
//         <Route path="/admin/iot" element={<IoTModuleSetup />} />
//       </Route> */}

//       {/* ====================== RUTAS AGRICULTOR (tipo_usuario = 2) ====================== */}
//       {/* <Route element={<ProtectedRoute allowedRoles={[2, 1]} />}>
//         <Route path="/farmer" element={<FarmerDashboard />} />
//         <Route path="/create-field" element={<FieldRegistration />} />
//         <Route path="/field/:id" element={<FieldDetails />} />
//         <Route path="/profile" element={<Profile />} />
//       </Route> */}

//       {/* ====================== RUTA 404 ====================== */}
//       {/* <Route path="*" element={<NotFound />} /> */}

//     </Routes>
//   );
// };

// export default AppRoutes;