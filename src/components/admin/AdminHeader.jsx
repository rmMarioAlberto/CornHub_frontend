import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const AdminHeader = () => {
  return (
    <header className="p-4 flex justify-between items-center shadow-md bg-negro-texto text-white">
      <div className="flex items-center">
        <Link to="/admin">
          <img src="/assets/images/lettucecirity-icono.png" alt="Logo CP Killers" className="h-10 mr-4" />
        </Link>
      </div>
      <nav className="flex space-x-4">
        <Link to="/admin/profile">
          <Button variant="primary">Mi Perfil</Button>
        </Link>
        <Link to="/admin/create-crop">
          <Button variant="primary">Crear Cultivo</Button>
        </Link>
        <Link to="/admin/users">
          <Button variant="primary">Usuarios</Button>
        </Link>
      </nav>
    </header>
  );
};

export default AdminHeader;