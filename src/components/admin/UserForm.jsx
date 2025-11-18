// src/components/admin/UserForm.jsx
import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

const UserForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [form, setForm] = useState(
    initialData || {
      username: '',
      correo: '',
      contra: '',
      nombre: '',
      apellido: '',
      tipo_usuario: 1,
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Editar Usuario' : 'Crear Nuevo Usuario'}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-[#2E7D32] mb-2">Usuario *</label>
            <Input
              name="username"
              placeholder="mario123"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2E7D32] mb-2">Correo *</label>
            <Input
              name="correo"
              type="email"
              placeholder="mario@gmail.com"
              value={form.correo}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-[#2E7D32] mb-2">Nombre *</label>
            <Input name="nombre" placeholder="Mario" value={form.nombre} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2E7D32] mb-2">Apellido *</label>
            <Input name="apellido" placeholder="Ramírez" value={form.apellido} onChange={handleChange} required />
          </div>
        </div>

        {!initialData && (
          <div>
            <label className="block text-sm font-medium text-[#2E7D32] mb-2">Contraseña *</label>
            <Input
              name="contra"
              type="password"
              placeholder="••••••••"
              value={form.contra}
              onChange={handleChange}
              required={!initialData}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[#2E7D32] mb-2">Rol *</label>
          <select
            name="tipo_usuario"
            value={form.tipo_usuario}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-[#4CAF50]/30 rounded-lg focus:border-[#4CAF50] focus:outline-none transition-colors"
          >
            <option value={1}>Agricultor</option>
            <option value={2}>Administrador</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {initialData ? 'Guardar Cambios' : 'Crear Usuario'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserForm;