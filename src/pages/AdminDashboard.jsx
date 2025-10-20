import React from 'react';
import Button from '../components/common/Button';
import useAuth from '../hooks/useAuth'; // Para usuario

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <header className="bg-verde-profundo text-white p-4 flex justify-between">
        <img src="/assets/images/lettucecirity-icono.png" alt="Lettucecurity" />
        <span>{user?.name}</span>
        <nav> {/* Menú */} </nav>
      </header>
      <h1 className="text-3xl my-6">Bienvenido Admin</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">Usuarios registrados: 50</div>
        <div className="bg-white p-4 rounded shadow">Cultivos activos: 12</div>
        <div className="bg-white p-4 rounded shadow">Alertas detectadas: 3</div>
      </div>
      <div className="mt-6 flex space-x-4">
        <Button variant="primary">Gestión Usuarios</Button>
        <Button variant="primary">Crear Cultivo</Button>
      </div>
    </div>
  );
};

export default AdminDashboard;