// src/components/admin/FieldManager.jsx
import React, { useState } from 'react';
import useFields from '../../hooks/useFields';
import useCrops from '../../hooks/useCrops';
import useUsers from '../../hooks/useUsers';
import useAuth from '../../hooks/useAuth'; // ← CORREGIDO: sin llaves
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';

const FieldManager = () => {
  const { fields: rawFields = [], loading: loadingFields, error: errorFields, createNewField, refresh: refreshFields } = useFields();
  const { crops = [], loading: loadingCrops } = useCrops();
  const { users: rawUsers = [], loading: loadingUsers } = useUsers();
  const { auth } = useAuth(); // ← useAuth es un hook, no un objeto con auth
  const isAdmin = auth?.user?.tipo_usuario === 2 || auth?.user?.tipo === 2;

  // Normalizamos los datos del backend
  const fields = Array.isArray(rawFields) ? rawFields : rawFields.parcelas || [];
  const users = Array.isArray(rawUsers) ? rawUsers : rawUsers.users || [];

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [selectedParcela, setSelectedParcela] = useState(null);

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    largo: '',
    ancho: '',
    latitud: '',
    longitud: '',
    id_usuario: '',
    idCultivo: '',
  });

  const handleOpenCreate = () => {
    setModalType('create');
    setForm({
      nombre: '', descripcion: '', largo: '', ancho: '',
      latitud: '', longitud: '', id_usuario: '', idCultivo: ''
    });
    setShowModal(true);
  };

  const handleOpenDetails = (parcela) => {
    setSelectedParcela(parcela);
    setModalType('details');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.nombre.trim() || !form.largo || !form.ancho || !form.id_usuario || !form.idCultivo) {
      alert('Todos los campos con * son obligatorios');
      return;
    }

    try {
      await createNewField({
        id_usuario: Number(form.id_usuario),
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim() || null,
        largo: parseFloat(form.largo),
        ancho: parseFloat(form.ancho),
        latitud: form.latitud ? parseFloat(form.latitud) : null,
        longitud: form.longitud ? parseFloat(form.longitud) : null,
        idCultivo: Number(form.idCultivo),
      });

      setShowModal(false);
      refreshFields?.();
    } catch (err) {
      alert('Error al crear la parcela: ' + (err.message || 'Intenta más tarde'));
    }
  };

  const filteredParcelas = fields.filter(p =>
    p.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    p.id_parcela?.toString().includes(search) ||
    p.descripcion?.toLowerCase().includes(search.toLowerCase())
  );

  if (loadingFields || loadingCrops || loadingUsers) {
    return (
      <div className="card p-6 text-center">
        <p className="text-gray-600">Cargando datos...</p>
      </div>
    );
  }

  if (errorFields) {
    return <div className="alert-banner">Error: {errorFields}</div>;
  }

  return (
    <div className="card p-6">
      <h2 className="text-2xl font-bold text-green-800 mb-6">
        Gestión de Parcelas ({fields.length})
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder="Buscar por nombre, ID o descripción..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        {isAdmin && (
          <Button variant="primary" onClick={handleOpenCreate}>
            + Nueva Parcela
          </Button>
        )}
      </div>

      {filteredParcelas.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">
            {fields.length === 0 ? 'No hay parcelas registradas.' : 'No se encontraron resultados.'}
          </p>
          {fields.length === 0 && isAdmin && (
            <Button variant="secondary" onClick={handleOpenCreate} className="mt-4">
              Crear primera parcela
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Descripción</th>
                <th className="px-4 py-3">Dimensiones</th>
                <th className="px-4 py-3">Área</th>
                <th className="px-4 py-3">Cultivo</th>
                <th className="px-4 py-3">Propietario</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredParcelas.map((p, i) => {
                const cultivo = crops.find(c => c.id_cultivo === p.id_cultivo || c.id_cultivo === p.idCultivo);
                const propietario = users.find(u => u.id === p.id_usuario);

                return (
                  <tr key={p.id_parcela} className={`border-b hover:bg-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-4 py-3 font-mono text-sm">#{p.id_parcela}</td>
                    <td className="px-4 py-3 font-medium">{p.nombre}</td>
                    <td className="px-4 py-3 text-sm">{p.descripcion || '—'}</td>
                    <td className="px-4 py-3 text-sm">{p.largo} × {p.ancho} m</td>
                    <td className="px-4 py-3 font-medium">{(parseFloat(p.largo) * parseFloat(p.ancho)).toFixed(1)} m²</td>
                    <td className="px-4 py-3">
                      <span className="badge-success text-xs">
                        {cultivo?.nombre || 'Sin cultivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-green-700">
                      {propietario?.name || `Usuario ID ${p.id_usuario}`}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button variant="secondary" size="sm" onClick={() => handleOpenDetails(p)}>
                        Detalles
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={modalType === 'create' ? 'Crear Nueva Parcela' : 'Detalles de Parcela'}>
        {modalType === 'create' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Nombre *</label>
                <Input placeholder="Parcela Norte" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Cultivo *</label>
                <select className="input-field w-full" value={form.idCultivo} onChange={e => setForm({ ...form, idCultivo: e.target.value })}>
                  <option value="">Seleccionar cultivo</option>
                  {crops.map(c => (
                    <option key={c.id_cultivo} value={c.id_cultivo}>
                      {c.nombre.charAt(0).toUpperCase() + c.nombre.slice(1)}
                    </option>))}
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">Descripción</label>
              <Input placeholder="Zona experimental..." value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div><label className="form-label">Largo (m) *</label><Input type="number" step="0.1" value={form.largo} onChange={e => setForm({ ...form, largo: e.target.value })} /></div>
              <div><label className="form-label">Ancho (m) *</label><Input type="number" step="0.1" value={form.ancho} onChange={e => setForm({ ...form, ancho: e.target.value })} /></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div><label className="form-label">Latitud (opcional)</label><Input type="number" step="0.000001" value={form.latitud} onChange={e => setForm({ ...form, latitud: e.target.value })} /></div>
              <div><label className="form-label">Longitud (opcional)</label><Input type="number" step="0.000001" value={form.longitud} onChange={e => setForm({ ...form, longitud: e.target.value })} /></div>
            </div>

            <div>
              <label className="form-label">Propietario *</label>
              <select className="input-field w-full" value={form.id_usuario} onChange={e => setForm({ ...form, id_usuario: e.target.value })}>
                <option value="">Seleccionar usuario</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button variant="primary" onClick={handleSubmit}>Crear Parcela</Button>
            </div>
          </div>
        )}

        {modalType === 'details' && selectedParcela && (
          <div className="bg-gray-50 p-6 rounded-lg space-y-3 text-sm">
            <p><strong>ID:</strong> #{selectedParcela.id_parcela}</p>
            <p><strong>Nombre:</strong> {selectedParcela.nombre}</p>
            <p><strong>Descripción:</strong> {selectedParcela.descripcion || '—'}</p>
            <p><strong>Dimensiones:</strong> {selectedParcela.largo} × {selectedParcela.ancho} m</p>
            <p><strong>Área:</strong> {(parseFloat(selectedParcela.largo) * parseFloat(selectedParcela.ancho)).toFixed(2)} m²</p>
            <p><strong>Cultivo:</strong> {
              crops.find(c => c.id_cultivo === selectedParcela.idCultivo || c.id_cultivo === selectedParcela.id_cultivo)?.nombre
              || 'Sin asignar'
            }</p>            <p><strong>Propietario:</strong> {users.find(u => u.id === selectedParcela.id_usuario)?.name || 'Desconocido'}</p>
            {selectedParcela.latitud && selectedParcela.longitud && (
              <a href={`https://maps.google.com/maps?q=${selectedParcela.latitud},${selectedParcela.longitud}`} target="_blank" rel="noopener noreferrer" className="text-green-700 underline">
                Ver en Google Maps
              </a>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FieldManager;