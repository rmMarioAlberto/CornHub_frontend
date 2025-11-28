// src/components/admin/UserList.jsx
import React from 'react';
import { FaUser, FaEnvelope, FaUserShield, FaEdit, FaTrashAlt } from 'react-icons/fa';

const UserList = ({ users, onEdit, onDelete }) => {
  if (!users || users.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-base sm:text-lg">No hay usuarios registrados</p>
      </div>
    );
  }

  return (
    <>
      {/* Vista de TARJETAS para móviles */}
      <div className="block lg:hidden">
        <div className="p-4 sm:p-6 space-y-4">
          {users.map((user, index) => {
            const isAdmin = user.tipo_usuario === 2 || user.tipo === 2;

            return (
              <div
                key={user.id || user.id_usuario}
                className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-5 hover:border-[#4CAF50] hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                      <FaUser className="text-white text-lg" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-base sm:text-lg">{user.name}</h3>
                      <p className="text-xs text-gray-500">ID: #{user.id || user.id_usuario}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${isAdmin ? 'bg-[#2E7D32] text-white' : 'bg-[#C8E6C9] text-[#1B5E20]'
                      }`}
                  >
                    <FaUserShield className="text-xs" />
                    {isAdmin ? 'Admin' : 'Agricultor'}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <FaUser className="text-[#4CAF50] flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong className="font-medium">Nombre:</strong> {user.nombre} {user.apellido}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FaEnvelope className="text-[#388E3C] flex-shrink-0" />
                    <span className="text-gray-700 truncate">
                      <strong className="font-medium">Email:</strong> {user.correo || user.email}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => onEdit?.(user)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4CAF50] text-white rounded-lg hover:bg-[#388E3C] transition-colors font-medium text-sm"
                  >
                    <FaEdit />
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete?.(user)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                  >
                    <FaTrashAlt />
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vista de TABLA para desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-[#4CAF50]/10 text-left text-sm font-semibold text-[#2E7D32]">
              <th className="px-4 xl:px-6 py-4">ID</th>
              <th className="px-4 xl:px-6 py-4">Usuario</th>
              <th className="px-4 xl:px-6 py-4">Nombre Completo</th>
              <th className="px-4 xl:px-6 py-4">Correo</th>
              <th className="px-4 xl:px-6 py-4">Rol</th>
              <th className="px-4 xl:px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => {
              const isAdmin = user.tipo_usuario === 2 || user.tipo === 2;

              return (
                <tr
                  key={user.id || user.id_usuario}
                  className={`border-b transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-[#F5F5F5]'
                    } hover:bg-[#4CAF50]/10`}
                >
                  <td className="px-4 xl:px-6 py-4 font-mono text-sm text-gray-600">
                    #{user.id || user.id_usuario}
                  </td>
                  <td className="px-4 xl:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FaUser className="text-[#4CAF50] text-lg flex-shrink-0" />
                      <span className="font-medium text-gray-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 xl:px-6 py-4 font-medium text-gray-800">
                    {user.nombre} {user.apellido}
                  </td>
                  <td className="px-4 xl:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FaEnvelope className="text-[#388E3C] flex-shrink-0" />
                      <span className="text-sm text-gray-700">{user.correo || user.email}</span>
                    </div>
                  </td>
                  <td className="px-4 xl:px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold shadow-sm ${isAdmin ? 'bg-[#2E7D32] text-white' : 'bg-[#C8E6C9] text-[#1B5E20]'
                        }`}
                    >
                      <FaUserShield />
                      {isAdmin ? 'Administrador' : 'Agricultor'}
                    </span>
                  </td>
                  <td className="px-4 xl:px-6 py-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => onEdit?.(user)}
                        className="p-2 text-[#4CAF50] hover:bg-[#4CAF50]/10 rounded-lg transition-all group"
                        title="Editar usuario"
                      >
                        <FaEdit className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </button>
                      <button
                        onClick={() => onDelete?.(user)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all group"
                        title="Eliminar usuario"
                      >
                        <FaTrashAlt className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserList;