// src/pages/CropManagement.jsx
import React from 'react';
import AdminHeader from '../components/admin/AdminHeader';
import Footer from '../components/common/Footer';
import CropManager from '../components/admin/CropManager';

const CropManagement = () => (
  <div className="min-h-screen flex flex-col">
    <AdminHeader />
    <main className="container-main py-8">
      <CropManager />
    </main>
    <Footer />
  </div>
);

export default CropManagement;