import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
// import AdminDashboard from './pages/AdminDashboard';
// import FarmerDashboard from './pages/FarmerDashboard';
// import FieldRegistration from './pages/FieldRegistration';
// import Profile from './pages/Profile';
// import FieldDetails from './pages/FieldDetails';
// import IoTModuleSetup from './pages/IoTModuleSetup';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
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