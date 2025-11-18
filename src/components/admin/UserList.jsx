// src/components/admin/UserList.jsx
import React from 'react';
import { FaUser, FaEnvelope, FaUserShield, FaEdit, FaTrashAlt } from 'react-icons/fa';

const UserList = ({ users, onEdit, onDelete }) => {
  if (!users || users.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No hay usuarios registrados</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-[#4CAF50]/10 text-left text-sm font-semibold text-[#2E7D32]">
            <th className="px-6 py-4">ID</th>
            <th className="px-6 py-4">Usuario</th>
            <th className="px-6 py-4">Nombre Completo</th>
            <th className="px-6 py-4">Correo</th>
            <th className="px-6 py-4">Rol</th>
            <th className="px-6 py-4 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            const isAdmin = user.tipo_usuario === 2 || user.tipo === 2;

            return (
              <tr
                key={user.id || user.id_usuario}
                className={`border-b transition-all duration-200 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-[#F5F5F5]'
                } hover:bg-[#4CAF50]/10`}
              >
                <td className="px-6 py-4 font-mono text-sm text-gray-600">
                  #{user.id || user.id_usuario}
                </td>
                <td className="px-6 py-4 flex items-center gap-3">
                  <FaUser className="text-[#4CAF50] text-lg" />
                  <span className="font-medium text-gray-800">{user.name}</span>
                </td>
                <td className="px-6 py-4 font-medium">
                  {user.nombre} {user.apellido}
                </td>
                <td className="px-6 py-4 flex items-center gap-3">
                  <FaEnvelope className="text-[#388E3C]" />
                  <span className="text-sm text-gray-700">{user.correo || user.email}</span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold shadow-sm ${
                      isAdmin
                        ? 'bg-[#2E7D32] text-white'
                        : 'bg-[#C8E6C9] text-[#1B5E20]'
                    }`}
                  >
                    <FaUserShield />
                    {isAdmin ? 'Administrador' : 'Agricultor'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-4">
                    {/* Botón Editar */}
                    {/* <button
                      onClick={() => onEdit?.(user)}
                      className="text-[#4CAF50] hover:text-[#388E3C] transition-colors group"
                      title="Editar usuario"
                    >
                      <FaEdit className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button> */}

                    {/* Botón Eliminar */}
                    {/* <button
                      onClick={() => onDelete?.(user)}
                      className="text-red-600 hover:text-red-700 transition-colors group"
                      title="Eliminar usuario"
                    >
                      <FaTrashAlt className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button> */}
                    {/* Hace falta hacer los WS para editar y eliminar usuarios */}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;