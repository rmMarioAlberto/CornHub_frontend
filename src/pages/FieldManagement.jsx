// src/pages/FieldManagement.jsx
import React from 'react';
import AdminHeader from '../components/admin/AdminHeader';
import Footer from '../components/common/Footer';
import FieldManager from '../components/admin/FieldManager';

const FieldManagement = () => (
  <div className="min-h-screen flex flex-col">
    <AdminHeader />
    <main className="container-main py-8">
      <FieldManager />
    </main>
    <Footer />
  </div>
);

export default FieldManagement;