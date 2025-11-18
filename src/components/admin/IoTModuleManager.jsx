// src/components/admin/IoTModuleManager.jsx
import React, { useState } from 'react';
import useIoTModules from '../../hooks/useIoTModules';
import useFields from '../../hooks/useFields';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';

const IoTModuleManager = () => {
  const {
    iots = [],
    loading: loadingIot,
    error: errorIot,
    createNewIot,
    removeIot,
    assignIotToParcela
  } = useIoTModules();
  const { fields = [], loading: loadingFields } = useFields();
  const [selectedIot, setSelectedIot] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [fechaCreacion, setFechaCreacion] = useState(new Date().toISOString().slice(0, 16));
  const [parcelaId, setParcelaId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [search, setSearch] = useState('');

  const handleCreate = () => {
    setModalType('create');
    setShowModal(true);
    setDescripcion('');
    setFechaCreacion(new Date().toISOString().slice(0, 16));
  };

  const submitCreate = async () => {
    if (!descripcion.trim()) {
      alert('La descripción es requerida');
      return;
    }
    await createNewIot({
      descripcion,
      fechaCreacion: new Date(fechaCreacion).toISOString()
    });
    setShowModal(false);
  };

  const handleViewDetails = (iot) => {
    setSelectedIot(iot);
    setModalType('details');
    setShowModal(true);
  };

  const handleAssign = (idIot) => {
    setSelectedIot({ idIot });
    setModalType('assign');
    setShowModal(true);
    setParcelaId('');
  };

  const submitAssign = async () => {
    if (!parcelaId) {
      alert('Selecciona una parcela');
      return;
    }
    await assignIotToParcela(selectedIot.idIot, parseInt(parcelaId));
    setShowModal(false);
  };

  const handleDelete = async (idIot) => {
    if (window.confirm('¿Estás seguro de eliminar este módulo IoT?')) {
      await removeIot(idIot);
    }
  };

  const filteredIots = iots.filter(iot =>
    iot.descripcion.toLowerCase().includes(search.toLowerCase()) ||
    iot.id_iot.toString().includes(search)
  );

  if (loadingIot || loadingFields) {
    return (
      <div className="card p-6 text-center">
        <p className="text-gray-600">Cargando módulos IoT...</p>
      </div>
    );
  }

  if (errorIot) {
    return <div className="alert-banner">{errorIot}</div>;
  }

  return (
    <div className="card p-6">
      {/* Título */}
      <h2 className="text-2xl font-bold text-green-800 mb-6">
        Gestión de Módulos IoT ({iots.length})
      </h2>

      {/* Barra de búsqueda y botón de nuevo módulo */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder="Buscar por ID o descripción..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Button variant="primary" onClick={handleCreate} className="w-full sm:w-auto">
          + Nuevo Módulo IoT
        </Button>
      </div>

      {/* Lista vacía o con resultados */}
      {filteredIots.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>
            {iots.length === 0
              ? 'No hay módulos IoT registrados.'
              : 'No hay módulos IoT que coincidan con la búsqueda.'}
          </p>
          {iots.length === 0 && (
            <Button variant="secondary" onClick={handleCreate} className="mt-4">
              Crear el primero
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Descripción</th>
                <th className="px-4 py-3">Creado</th>
                <th className="px-4 py-3">Parcela</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredIots.map((iot, index) => (
                <tr
                  key={iot.id_iot}
                  className={`border-b hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="px-4 py-3 font-mono text-sm">#{iot.id_iot}</td>
                  <td className="px-4 py-3">{iot.descripcion || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {iot.fechaCreacion
                      ? new Date(iot.fechaCreacion).toLocaleDateString('es-MX')
                      : '—'
                    }
                  </td>
                  <td className="px-4 py-3">
                    {iot.id_parcela ? (
                      (() => {
                        const parcela = fields.find(p => p.id_parcela === iot.id_parcela);
                        return (
                          <span className="badge-success text-xs">
                            {parcela?.nombre || `Parcela #${iot.id_parcela}`}
                          </span>
                        );
                      })()
                    ) : (
                      <span className="badge-warning text-xs">Sin asignar</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <Button
                      variant="secondary"
                      onClick={() => handleViewDetails(iot)}
                      className="px-3 py-1.5 text-sm rounded-md"
                    >
                      Detalles
                    </Button>
                    {!iot.id_parcela && (
                      <Button
                        variant="primary"
                        onClick={() => handleAssign(iot.id_iot)}
                        className="px-3 py-1.5 text-sm rounded-md"
                      >
                        Asignar
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      onClick={() => handleDelete(iot.id_iot)}
                      className="px-3 py-1.5 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          modalType === 'create' ? 'Crear Módulo IoT' :
            modalType === 'details' ? 'Detalles del Módulo' :
              modalType === 'assign' ? 'Asignar a Parcela' : ''
        }
      >
        {modalType === 'create' && (
          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <Input
                placeholder="Ej: Módulo principal del invernadero"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Fecha de creación</label>
              <Input
                type="datetime-local"
                value={fechaCreacion}
                onChange={(e) => setFechaCreacion(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={submitCreate}>
                Crear Módulo
              </Button>
            </div>
          </div>
        )}
        {modalType === 'details' && selectedIot && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 text-sm bg-gray-50 p-4 rounded-lg">
              <p><strong>ID:</strong> <code className="font-mono bg-gray-200 px-2 py-1 rounded">#{selectedIot.id_iot}</code></p>
              <p><strong>Descripción:</strong> {selectedIot.descripcion || '—'}</p>
              <p>
                <strong>Fecha creación:</strong>{' '}
                {selectedIot.fecha_creacion
                  ? new Date(selectedIot.fecha_creacion).toLocaleString('es-MX', {
                    dateStyle: 'long',
                    timeStyle: 'short'
                  })
                  : '—'
                }
              </p>
              <p>
                <strong>Última conexión:</strong>{' '}
                {selectedIot.ultima_conexion
                  ? new Date(selectedIot.ultima_conexion).toLocaleString('es-MX')
                  : <span className="text-gray-400">Nunca</span>
                }
              </p>
              <p>
                <strong>Estado:</strong>{' '}
                <span className={`badge ${selectedIot.status === 1 ? 'badge-success' : 'badge-danger'}`}>
                  {selectedIot.status === 1 ? 'Activo' : 'Inactivo'}
                </span>
              </p>

              {/* AQUÍ ESTÁ EL CAMBIO: Mostrar nombre de la parcela */}
              <p>
                <strong>Parcela asignada:</strong>{' '}
                {selectedIot.id_parcela ? (
                  (() => {
                    const parcela = fields.find(p => p.id_parcela === selectedIot.id_parcela);
                    return parcela ? (
                      <span className="badge-success">
                        {parcela.nombre} (ID: {selectedIot.id_parcela})
                      </span>
                    ) : (
                      <span className="badge-success">Parcela #{selectedIot.id_parcela}</span>
                    );
                  })()
                ) : (
                  <span className="badge-warning">Sin asignar</span>
                )}
              </p>
            </div>

            {/* Sensores */}
            {selectedIot.sensor_iot?.length > 0 && (
              <div className="mt-6">
                <p className="font-semibold text-green-800 mb-3">
                  Sensores conectados ({selectedIot.sensor_iot.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedIot.sensor_iot.map((s) => (
                    <span key={s.id_sensor_iot} className="badge-success text-xs px-3 py-1">
                      Sensor #{s.id_sensor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {modalType === 'assign' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Módulo IoT: <strong>#{selectedIot?.idIot}</strong>
            </p>
            <select
              value={parcelaId}
              onChange={(e) => setParcelaId(e.target.value)}
              className="w-full p-2 border rounded input-field text-sm"
            >
              <option value="">Selecciona una parcela</option>
              {fields.map((p) => (
                <option key={p.id_parcela} value={p.id_parcela}>
                  {p.nombre} (ID: {p.id_parcela})
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={submitAssign}
                disabled={!parcelaId}
              >
                Asignar Parcela
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default IoTModuleManager;