// src/components/admin/FieldManager.jsx
import React, { useState } from 'react';
import useFields from '../../hooks/useFields';
import useAuth from '../../hooks/useAuth';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';

const FieldManager = () => {
  const { fields, loading, error, createNewField } = useFields();
  const { auth } = useAuth();
  const isAdmin = auth?.user?.tipo_usuario === 2;

  const [form, setForm] = useState({
    id_usuario: auth?.user?.id_usuario || 1,
    nombre: '', descripcion: '', largo: '', ancho: '', latitud: '', longitud: '', idCultivo: ''
  });
  const [showCreate, setShowCreate] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await createNewField({
        ...form,
        largo: parseFloat(form.largo),
        ancho: parseFloat(form.ancho),
        latitud: parseFloat(form.latitud),
        longitud: parseFloat(form.longitud),
        idCultivo: parseInt(form.idCultivo),
      });
      setShowCreate(false);
    } catch {}
  };

  if (loading) return <p className="text-center">Cargando parcelas...</p>;
  if (error) return <div className="alert-banner">{error}</div>;

  return (
    <div className="card p-6">
      <div className="flex justify-between mb-6">
        <h2>Gestión de Parcelas</h2>
        {isAdmin && (
          <Button variant="primary" onClick={() => setShowCreate(true)}>
            Crear Parcela
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {fields.map((field) => (
          <div key={field.id_parcela} className="card p-4">
            <h3 className="font-bold">{field.nombre}</h3>
            <p className="text-sm text-gray-600">{field.descripcion}</p>
            <p className="text-xs">Área: {(field.largo * field.ancho).toFixed(2)} m²</p>
          </div>
        ))}
      </div>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)}>
        <h3 className="mb-4">Crear Nueva Parcela</h3>
        <div className="space-y-4">
          <Input name="nombre" placeholder="Nombre" onChange={handleChange} />
          <Input name="descripcion" placeholder="Descripción" onChange={handleChange} />
          <div className="grid grid-cols-2 gap-2">
            <Input name="largo" type="number" placeholder="Largo (m)" onChange={handleChange} />
            <Input name="ancho" type="number" placeholder="Ancho (m)" onChange={handleChange} />
          </div>
          <Input name="latitud" type="number" step="0.0001" placeholder="Latitud" onChange={handleChange} />
          <Input name="longitud" type="number" step="0.0001" placeholder="Longitud" onChange={handleChange} />
          <Input name="idCultivo" type="number" placeholder="ID Cultivo" onChange={handleChange} />
          <Button variant="primary" onClick={handleSubmit}>
            Crear
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default FieldManager;