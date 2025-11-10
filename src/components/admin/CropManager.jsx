// src/components/admin/CropManager.jsx
import React, { useState } from 'react';
import useCrops from '../../hooks/useCrops';
import Button from '../common/Button';
import Modal from '../common/Modal';

const CropManager = () => {
  const { crops, loading, error, fetchCrop } = useCrops();
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleView = async (id) => {
    try {
      const crop = await fetchCrop(id);
      setSelected(crop);
      setShowModal(true);
    } catch {}
  };

  if (loading) return <p className="text-center">Cargando cultivos...</p>;
  if (error) return <div className="alert-banner">{error}</div>;

  return (
    <div className="card p-6">
      <h2 className="mb-6">Gestión de Cultivos</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Descripción</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {crops.map((crop) => (
              <tr key={crop.id_cultivo} className="border-b">
                <td className="px-4 py-2">{crop.id_cultivo}</td>
                <td className="px-4 py-2">{crop.nombre}</td>
                <td className="px-4 py-2 truncate max-w-xs">{crop.descripcion}</td>
                <td className="px-4 py-2">
                  <Button variant="secondary" onClick={() => handleView(crop.id_cultivo)}>
                    Ver
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        {selected && (
          <div>
            <h3 className="text-xl font-bold mb-4">{selected.nombre}</h3>
            <p><strong>ID:</strong> {selected.id_cultivo}</p>
            <p><strong>Descripción:</strong> {selected.descripcion}</p>
            <p><strong>Status:</strong> {selected.status === 1 ? 'Activo' : 'Inactivo'}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CropManager;