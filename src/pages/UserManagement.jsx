// src/pages/UserManagement.jsx
import React, { useState } from 'react';
import AdminHeader from '../components/admin/AdminHeader';
import BackButton from '../components/common/BackButton';
import Button from '../components/common/Button';
import UserList from '../components/admin/UserList';
import UserForm from '../components/admin/UserForm';
import Modal from '../components/common/Modal';
import useUsers from '../hooks/useUsers';
import { createUser } from '../api/users';

// ¡IMPORTANTE! Agregamos los iconos aquí también
import { FaTrashAlt, FaExclamationTriangle } from 'react-icons/fa';

const UserManagement = () => {
  const { users, loading, error, refresh } = useUsers();
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleCreateUser = async (userData) => {
    try {
      await createUser(userData);
      setShowForm(false);
      setEditingUser(null);
      refresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al crear usuario');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDeleteClick = (user) => {
    setDeleteUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    // Aquí conectarás tu API DELETE cuando la tengas
    // await deleteUserById(deleteUser.id);
    alert(`Usuario ${deleteUser.username} eliminado correctamente`);
    setShowDeleteModal(false);
    setDeleteUser(null);
    refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <BackButton />
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#2E7D32]">
            Gestión de Usuarios ({users.length})
          </h1>
          <Button 
            variant="primary" 
            size="lg" 
            onClick={() => {
              setEditingUser(null);
              setShowForm(true);
            }}
          >
            + Nuevo Usuario
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <p className="p-12 text-center text-gray-600 text-lg">Cargando usuarios...</p>
          ) : error ? (
            <div className="alert-banner m-6">{error}</div>
          ) : (
            <UserList users={users} onEdit={handleEdit} onDelete={handleDeleteClick} />
          )}
        </div>
      </main>

      {/* Formulario Crear / Editar */}
      <UserForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingUser(null);
        }}
        onSubmit={handleCreateUser}
        initialData={editingUser}
      />

      {/* Modal de Confirmación de Eliminación */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Eliminar Usuario">
        <div className="p-8 text-center">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <FaExclamationTriangle className="w-10 h-10 text-red-600" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            ¿Estás seguro?
          </h3>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            Vas a eliminar al usuario:<br />
            <strong className="text-[#2E7D32] text-lg">{deleteUser?.username}</strong><br />
            <span className="text-sm">({deleteUser?.correo || deleteUser?.email})</span>
          </p>
          
          <p className="text-sm text-red-600 font-medium mb-8">
            Esta acción no se puede deshacer
          </p>

          <div className="flex justify-center gap-4">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              <FaTrashAlt className="mr-2" />
              Sí, Eliminar Usuario
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;