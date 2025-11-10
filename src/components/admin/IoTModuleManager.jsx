// src/components/admin/IoTModuleManager.jsx
import React, { useState } from 'react';
import useIoTModules from '../../hooks/useIoTModules';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';

const IoTModuleManager = () => {
  const { iots, loading, error, createNewIot, removeIot, assignIotToParcela, refresh } = useIoTModules();
  const [selectedIot, setSelectedIot] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [fechaCreacion, setFechaCreacion] = useState(new Date().toISOString());
  const [parcelaId, setParcelaId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create', 'details', 'assign'

  // Hardcode parcelas por ahora (reemplaza con fetch cuando endpoints listos)
  const parcelasDisponibles = [
    { id: 1, nombre: 'Parcela Norte' },
    { id: 2, nombre: 'Parcela Sur' },
    { id: 3, nombre: 'Parcela Este' },
  ];

  const handleCreate = () => {
    setModalType('create');
    setShowModal(true);
  };

  const submitCreate = async () => {
    try {
      await createNewIot({ descripcion, fechaCreacion });
      setShowModal(false);
      setDescripcion('');
      setFechaCreacion(new Date().toISOString());
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleViewDetails = (iot) => {
    setSelectedIot(iot);
    setModalType('details');
    setShowModal(true);
  };

  const handleAssign = (id) => {
    setSelectedIot({ idIot: id });
    setModalType('assign');
    setShowModal(true);
  };

  const submitAssign = async () => {
    try {
      await assignIotToParcela(selectedIot.idIot, parseInt(parcelaId));
      setShowModal(false);
      setParcelaId('');
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este IoT?')) {
      try {
        await removeIot(id);
      } catch (err) {
        // Error handled
      }
    }
  };

  if (loading) return <p className="text-center">Cargando IoTs...</p>;
  if (error) return <div className="alert-banner">{error}</div>;

  return (
    <div className="card p-6">
      <div className="flex justify-between mb-6">
        <h2>Gestión de Módulos IoT</h2>
        <Button variant="primary" onClick={handleCreate}>
          Crear Nuevo IoT
        </Button>
      </div>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Descripción</th>
            <th className="px-4 py-2">Fecha Creación</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {iots.map((iot) => (
            <tr key={iot.idIot} className="border-b">
              <td className="px-4 py-2">{iot.idIot}</td>
              <td className="px-4 py-2">{iot.descripcion}</td>
              <td className="px-4 py-2">{new Date(iot.fechaCreacion).toLocaleString()}</td>
              <td className="px-4 py-2 space-x-2">
                <Button variant="secondary" onClick={() => handleViewDetails(iot)}>
                  Detalles
                </Button>
                <Button variant="primary" onClick={() => handleAssign(iot.idIot)}>
                  Asignar Parcela
                </Button>
                <Button variant="danger" onClick={() => handleDelete(iot.idIot)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        {modalType === 'create' && (
          <div>
            <h3>Crear Nuevo IoT</h3>
            <Input
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="mb-4"
            />
            <Input
              type="datetime-local"
              value={fechaCreacion.slice(0, 16)}
              onChange={(e) => setFechaCreacion(e.target.value + ':00Z')}
              className="mb-4"
            />
            <Button variant="primary" onClick={submitCreate}>
              Crear
            </Button>
          </div>
        )}
        {modalType === 'details' && selectedIot && (
          <div>
            <h3>Detalles del IoT</h3>
            <p>ID: {selectedIot.idIot}</p>
            <p>Descripción: {selectedIot.descripcion}</p>
            <p>Fecha Creación: {new Date(selectedIot.fechaCreacion).toLocaleString()}</p>
          </div>
        )}
        {modalType === 'assign' && (
          <div>
            <h3>Asignar IoT a Parcela</h3>
            <select
              value={parcelaId}
              onChange={(e) => setParcelaId(e.target.value)}
              className="input-field mb-4"
            >
              <option value="">Selecciona Parcela</option>
              {parcelasDisponibles.map((parcela) => (
                <option key={parcela.id} value={parcela.id}>
                  {parcela.nombre}
                </option>
              ))}
            </select>
            <Button variant="primary" onClick={submitAssign}>
              Asignar
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default IoTModuleManager;