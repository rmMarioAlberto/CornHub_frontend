// src/components/admin/IoTModuleManager.jsx
import React, { useState } from 'react';
import useIoTModules from '../../hooks/useIoTModules';
import useFields from '../../hooks/useFields';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';

const IoTModuleManager = () => {
    const { iots, loading: loadingIot, error: errorIot, createNewIot, removeIot, assignIotToParcela } = useIoTModules();
    const { fields, loading: loadingFields } = useFields();

    const [selectedIot, setSelectedIot] = useState(null);
    const [descripcion, setDescripcion] = useState('');
    const [fechaCreacion, setFechaCreacion] = useState(new Date().toISOString());
    const [parcelaId, setParcelaId] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('create');

    const handleCreate = () => {
        setModalType('create');
        setShowModal(true);
    };

    const submitCreate = async () => {
        await createNewIot({ descripcion, fechaCreacion });
        setShowModal(false);
        setDescripcion('');
        setFechaCreacion(new Date().toISOString());
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
        await assignIotToParcela(selectedIot.idIot, parseInt(parcelaId));
        setShowModal(false);
        setParcelaId('');
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Eliminar este módulo IoT?')) {
            await removeIot(id);
        }
    };

    if (loadingIot || loadingFields) return <p className="text-center">Cargando...</p>;
    if (errorIot) return <div className="alert-banner">{errorIot}</div>;

    return (
        <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Gestión de Módulos IoT</h2>
                <Button variant="primary" onClick={handleCreate}>
                    + Nuevo IoT
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py-2">Descripción</th>
                            <th className="px-4 py-2">Creado</th>
                            <th className="px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {iots.map((iot) => (
                            <tr key={iot.idIot} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2">{iot.idIot}</td>
                                <td className="px-4 py-2">{iot.descripcion}</td>
                                <td className="px-4 py-2 text-sm">{new Date(iot.fechaCreacion).toLocaleDateString()}</td>
                                <td className="px-4 py-2 space-x-1">
                                    <Button size="sm" variant="secondary" onClick={() => handleViewDetails(iot)}>
                                        Ver
                                    </Button>
                                    <Button size="sm" variant="primary" onClick={() => handleAssign(iot.idIot)}>
                                        Asignar
                                    </Button>
                                    <Button size="sm" variant="danger" onClick={() => handleDelete(iot.idIot)}>
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                {modalType === 'create' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold">Crear Módulo IoT</h3>
                        <Input placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                        <Input type="datetime-local" value={fechaCreacion.slice(0, 16)} onChange={(e) => setFechaCreacion(e.target.value + ':00Z')} />
                        <Button variant="primary" onClick={submitCreate}>Crear</Button>
                    </div>
                )}
                {modalType === 'details' && selectedIot && (
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold">Detalles del IoT</h3>
                        <p><strong>ID:</strong> {selectedIot.idIot}</p>
                        <p><strong>Descripción:</strong> {selectedIot.descripcion}</p>
                        <p><strong>Fecha:</strong> {new Date(selectedIot.fechaCreacion).toLocaleString()}</p>
                    </div>
                )}
                {modalType === 'assign' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold">Asignar a Parcela</h3>
                        <select
                            value={parcelaId}
                            onChange={(e) => setParcelaId(e.target.value)}
                            className="w-full p-2 border rounded input-field"
                        >
                            <option value="">Selecciona una parcela</option>
                            {fields.map((p) => (
                                <option key={p.id_parcela} value={p.id_parcela}>
                                    {p.nombre} (ID: {p.id_parcela})
                                </option>
                            ))}
                        </select>
                        <Button variant="primary" onClick={submitAssign} disabled={!parcelaId}>
                            Asignar
                        </Button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default IoTModuleManager;