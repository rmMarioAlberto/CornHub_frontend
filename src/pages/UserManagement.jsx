// src/pages/UserManagement.jsx
import React, { useState } from 'react';
import AdminHeader from '../components/admin/AdminHeader';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import UserList from '../components/admin/UserList';
import UserForm from '../components/admin/UserForm';
import useUsers from '../hooks/useUsers';

const UserManagement = () => {
  const { users, loading, error, addUser } = useUsers();
  const [showForm, setShowForm] = useState(false);

  const handleCreate = async (userData) => {
    try {
      await addUser(userData);
      setShowForm(false);
    } catch (err) {
      // Error manejado en hook
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      <main className="flex-1 container-main p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-verde-profundo">Gestión de Usuarios</h1>
            <Button variant="primary" onClick={() => setShowForm(true)}>
              + Nuevo Usuario
            </Button>
          </div>

          {error && <div className="alert-banner mb-4">{error}</div>}
          {loading ? <p className="text-center">Cargando usuarios...</p> : <UserList users={users} />}
        </div>
      </main>

      <UserForm isOpen={showForm} onClose={() => setShowForm(false)} onSubmit={handleCreate} />
      <Footer />
    </div>
  );
};

export default UserManagement;