// src/components/admin/UserList.jsx
import React from 'react';
import { FaUser, FaEnvelope, FaUserTag } from 'react-icons/fa';

const UserList = ({ users }) => {
  if (!users.length) return <p className="text-center text-gray-500">No hay usuarios</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-verde-lima-claro text-verde-profundo">
            <th className="px-4 py-2 text-left">Usuario</th>
            <th className="px-4 py-2 text-left">Correo</th>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id_usuario} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2 flex items-center gap-2">
                <FaUser className="text-verde-profundo" />
                {user.username}
              </td>
              <td className="px-4 py-2 flex items-center gap-2">
                <FaEnvelope className="text-verde-profundo" />
                {user.correo}
              </td>
              <td className="px-4 py-2">
                {user.nombre} {user.apellido}
              </td>
              <td className="px-4 py-2">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  user.tipo_usuario === 2 ? 'bg-verde-profundo text-white' : 'bg-verde-lima-claro text-verde-profundo'
                }`}>
                  <FaUserTag />
                  {user.tipo_usuario === 2 ? 'Admin' : 'Agricultor'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;