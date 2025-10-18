import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
// import AdminDashboard from './pages/AdminDashboard';
// import FarmerDashboard from './pages/FarmerDashboard';
// import FieldRegistration from './pages/FieldRegistration';
// import Profile from './pages/Profile';
// import FieldDetails from './pages/FieldDetails';
// import IoTModuleSetup from './pages/IoTModuleSetup';

const App = () => {
  const [view, setView] = useState('home'); // Para switching simple en demo

  return (
    <Router>
      <div className="min-h-screen bg-verde-lima-claro">
        <nav className="bg-verde-profundo text-white p-4">
          <ul className="flex space-x-4">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            {/* <li><Link to="/admin">Admin Dashboard</Link></li>
            <li><Link to="/farmer">Farmer Dashboard</Link></li>
            <li><Link to="/create-field">Crear Cultivo</Link></li>
            <li><Link to="/profile">Mi Perfil</Link></li>
            <li><Link to="/field/1">Detalles Cultivo</Link></li>
            <li><Link to="/iot-setup">Config IoT</Link></li> */}
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/farmer" element={<FarmerDashboard />} />
          <Route path="/create-field" element={<FieldRegistration />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/field/:id" element={<FieldDetails fieldId="1" />} /> {/* Placeholder ID */}
          {/* <Route path="/iot-setup" element={<IoTModuleSetup />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;