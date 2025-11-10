// src/components/admin/UserForm.jsx
import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import Modal from '../common/Modal';

const UserForm = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    username: '',
    correo: '',
    contra: '',
    nombre: '',
    apellido: '',
    tipo_usuario: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({
      username: '',
      correo: '',
      contra: '',
      nombre: '',
      apellido: '',
      tipo_usuario: 1,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-4 text-verde-profundo">Crear Usuario</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="username" placeholder="Usuario" value={form.username} onChange={handleChange} required />
          <Input name="correo" type="email" placeholder="Correo" value={form.correo} onChange={handleChange} required />
          <Input name="contra" type="password" placeholder="Contraseña" value={form.contra} onChange={handleChange} required />
          <Input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
          <Input name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} required />
          <select
            name="tipo_usuario"
            value={form.tipo_usuario}
            onChange={handleChange}
            className="w-full p-2 border rounded input-field"
          >
            <option value={1}>Agricultor</option>
            <option value={2}>Administrador</option>
          </select>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button variant="primary" type="submit">Crear</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UserForm;