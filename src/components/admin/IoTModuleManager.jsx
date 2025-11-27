// src/components/admin/IoTModuleManager.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Wifi, Map as MapIcon, Target, MousePointerClick } from 'lucide-react';
import useIoTModules from '../../hooks/useIoTModules';
import useFields from '../../hooks/useFields';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import { getIotsParcela } from '../../api/iot'; // Importar API directa para cargar IoTs de parcela
import { calculateRecommendedPosition } from '../../utils/calculateIoTModules'; // Importar utilería

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
  
  // Estados generales
  const [selectedIot, setSelectedIot] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [fechaCreacion, setFechaCreacion] = useState(new Date().toISOString().slice(0, 16));
  const [search, setSearch] = useState('');
  
  // Estados para Modal y Asignación
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [parcelaId, setParcelaId] = useState('');
  
  // Estados para el Mapa Interactivo
  const [existingParcelaIots, setExistingParcelaIots] = useState([]);
  const [coords, setCoords] = useState({ x: 0, y: 0 }); // Coordenadas seleccionadas
  const [recommendedCoords, setRecommendedCoords] = useState(null);
  const [parcelaDims, setParcelaDims] = useState({ width: 0, length: 0 });
  const mapRef = useRef(null); // Referencia al div del mapa

  // Efecto: Cuando cambia la parcela seleccionada en el modal de asignación
  useEffect(() => {
    if (modalType === 'assign' && parcelaId) {
        const loadParcelaDetails = async () => {
            // 1. Obtener dimensiones
            const field = fields.find(f => f.id_parcela === parseInt(parcelaId));
            if (field) {
                setParcelaDims({ width: parseFloat(field.ancho), length: parseFloat(field.largo) });
            }

            // 2. Obtener IoTs existentes
            try {
                const res = await getIotsParcela(parseInt(parcelaId));
                const iotsList = Array.isArray(res) ? res : (res.data || []);
                setExistingParcelaIots(iotsList);

                // 3. Calcular recomendación
                if (field) {
                    const rec = calculateRecommendedPosition(field.ancho, field.largo, iotsList);
                    setRecommendedCoords(rec);
                    // Por defecto, pre-seleccionamos la recomendada
                    setCoords(rec);
                }
            } catch (e) {
                console.error("Error cargando IoTs de parcela", e);
            }
        };
        loadParcelaDetails();
    } else {
        // Reset si no hay parcela
        setExistingParcelaIots([]);
        setParcelaDims({ width: 0, length: 0 });
        setCoords({ x: 0, y: 0 });
    }
  }, [parcelaId, modalType, fields]);


  // Manejador de Clic en el Mapa
  const handleMapClick = (e) => {
      if (!mapRef.current || !parcelaDims.width) return;

      const rect = mapRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left; // px desde la izquierda
      const clickY = e.clientY - rect.top;  // px desde arriba (OJO: En CSS top es 0, pero en plano cartesiano Y crece hacia arriba)
      
      // En el mapa visual:
      // X: 0 -> width
      // Y: length -> 0 (Visualmente 0,0 está abajo a la izquierda en nuestra lógica de FieldMap, 
      // pero el evento del mouse cuenta Y desde arriba. Necesitamos invertir Y).

      // Porcentajes clicados
      const pctX = clickX / rect.width;
      const pctY = clickY / rect.height;

      // Calcular metros
      // X es directo
      const metersX = pctX * parcelaDims.width;
      
      // Y debe invertirse: (1 - pctY) porque clickY=0 es el tope (length), clickY=height es el fondo (0)
      const metersY = (1 - pctY) * parcelaDims.length;

      setCoords({
          x: parseFloat(metersX.toFixed(2)),
          y: parseFloat(metersY.toFixed(2))
      });
  };

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
    setParcelaId(''); // Resetear selección
  };

  const submitAssign = async () => {
    if (!parcelaId) {
      alert('Selecciona una parcela');
      return;
    }
    if (coords.x < 0 || coords.y < 0) {
        alert('Coordenadas inválidas');
        return;
    }
    // Enviar X e Y
    await assignIotToParcela(selectedIot.idIot, parseInt(parcelaId), coords.x, coords.y);
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
      <h2 className="text-2xl font-bold text-green-800 mb-6">
        Gestión de Módulos IoT ({iots.length})
      </h2>

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

      {filteredIots.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No hay módulos IoT que coincidan con la búsqueda.</p>
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
                <tr key={iot.id_iot} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-4 py-3 font-mono text-sm">#{iot.id_iot}</td>
                  <td className="px-4 py-3">{iot.descripcion || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {iot.fechaCreacion ? new Date(iot.fechaCreacion).toLocaleDateString('es-MX') : '—'}
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
                    <Button variant="secondary" onClick={() => handleViewDetails(iot)} className="px-3 py-1.5 text-sm">
                      Detalles
                    </Button>
                    {!iot.id_parcela && (
                      <Button variant="primary" onClick={() => handleAssign(iot.id_iot)} className="px-3 py-1.5 text-sm">
                        Asignar
                      </Button>
                    )}
                    <Button variant="secondary" onClick={() => handleDelete(iot.id_iot)} className="px-3 py-1.5 text-sm bg-red-500 text-white hover:bg-red-600">
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
              <Input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción del módulo" />
            </div>
            <div className="form-group">
              <label className="form-label">Fecha de creación</label>
              <Input type="datetime-local" value={fechaCreacion} onChange={(e) => setFechaCreacion(e.target.value)} />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button variant="primary" onClick={submitCreate}>Crear Módulo</Button>
            </div>
          </div>
        )}

        {modalType === 'details' && selectedIot && (
          <div className="space-y-4">
             <div className="grid grid-cols-1 gap-3 text-sm bg-gray-50 p-4 rounded-lg">
                <p><strong>ID:</strong> #{selectedIot.id_iot}</p>
                <p><strong>Desc:</strong> {selectedIot.descripcion}</p>
                <p><strong>Coords:</strong> X: {selectedIot.coordenada_x || 'N/A'}, Y: {selectedIot.coordenada_y || 'N/A'}</p>
             </div>
             {/* ... Resto de detalles de sensores igual que antes ... */}
          </div>
        )}

        {/* --- MODAL DE ASIGNACIÓN CON MAPA --- */}
        {modalType === 'assign' && (
          <div className="space-y-6">
            <div>
                <p className="text-sm text-gray-600 mb-2">Módulo IoT: <strong>#{selectedIot?.idIot}</strong></p>
                <label className="form-label">Seleccionar Parcela</label>
                <select
                value={parcelaId}
                onChange={(e) => setParcelaId(e.target.value)}
                className="w-full p-2 border rounded input-field text-sm mb-4"
                >
                <option value="">-- Selecciona --</option>
                {fields.map((p) => (
                    <option key={p.id_parcela} value={p.id_parcela}>
                    {p.nombre} ({p.ancho}m x {p.largo}m)
                    </option>
                ))}
                </select>
            </div>

            {parcelaId && parcelaDims.width > 0 && (
                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <label className="form-label flex items-center gap-2">
                           <MousePointerClick size={16}/> Ubicación en el Mapa
                        </label>
                        <span className="text-xs text-gray-500">Haz clic para posicionar</span>
                    </div>

                    {/* --- PLANO CARTESIANO INTERACTIVO --- */}
                    <div 
                        className="relative w-full bg-[#F0FDF4] rounded-lg border border-[#A8CDBD] overflow-hidden shadow-inner cursor-crosshair group"
                        style={{ height: '300px' }}
                        ref={mapRef}
                        onClick={handleMapClick}
                    >
                        {/* Grid */}
                        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#6FA575 1px, transparent 1px), linear-gradient(90deg, #6FA575 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                        
                        {/* Ejes */}
                        <div className="absolute bottom-1 left-1 text-[10px] text-gray-500 bg-white/80 px-1 rounded pointer-events-none">(0,0)</div>
                        <div className="absolute bottom-1 right-1 text-[10px] text-gray-500 pointer-events-none">X ({parcelaDims.width}m)</div>
                        <div className="absolute top-1 left-1 text-[10px] text-gray-500 pointer-events-none">Y ({parcelaDims.length}m)</div>

                        {/* 1. IoTs Existentes (Gris/Azul Oscuro) */}
                        {existingParcelaIots.map((exist, idx) => {
                             const left = (exist.coordenada_x / parcelaDims.width) * 100;
                             const bottom = (exist.coordenada_y / parcelaDims.length) * 100;
                             return (
                                 <div key={idx} className="absolute w-6 h-6 bg-gray-400 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white z-10 pointer-events-none"
                                      style={{ left: `${left}%`, bottom: `${bottom}%`, transform: 'translate(-50%, 50%)' }}
                                      title={`Existente: IoT #${exist.id_iot}`}
                                 >
                                     <Wifi size={12} />
                                 </div>
                             )
                        })}

                        {/* 2. Ubicación Recomendada (Fantasma Verde Transparente) */}
                        {recommendedCoords && (
                             <div className="absolute w-8 h-8 bg-[#6DA544]/40 rounded-full border-2 border-[#6DA544] border-dashed flex items-center justify-center text-white z-0 pointer-events-none animate-pulse"
                                  style={{ 
                                      left: `${(recommendedCoords.x / parcelaDims.width) * 100}%`, 
                                      bottom: `${(recommendedCoords.y / parcelaDims.length) * 100}%`, 
                                      transform: 'translate(-50%, 50%)' 
                                  }}
                             >
                                 <Target size={14} />
                             </div>
                        )}

                        {/* 3. Ubicación Seleccionada (Rojo/Naranja) - El que vamos a guardar */}
                        <div className="absolute w-8 h-8 bg-[#eab308] rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white z-20 transition-all duration-200 ease-out"
                             style={{ 
                                 left: `${(coords.x / parcelaDims.width) * 100}%`, 
                                 bottom: `${(coords.y / parcelaDims.length) * 100}%`, 
                                 transform: 'translate(-50%, 50%)' 
                             }}
                        >
                            <MapIcon size={16} />
                        </div>
                    </div>

                    {/* Leyenda y Coordenadas Manuales */}
                    <div className="flex items-center justify-between mt-2 text-sm">
                        <div className="flex gap-3 text-xs text-gray-600">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-gray-400 rounded-full"></div> Ocupado</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-[#6DA544]/50 rounded-full border border-dashed border-[#6DA544]"></div> Sugerido</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-[#eab308] rounded-full"></div> Nuevo</span>
                        </div>
                        <div className="flex gap-2">
                             <div className="flex items-center gap-1">
                                <span className="font-bold text-gray-700">X:</span>
                                <input type="number" className="w-16 p-1 border rounded bg-gray-50 text-right" value={coords.x} onChange={(e) => setCoords({...coords, x: parseFloat(e.target.value) || 0})} />
                             </div>
                             <div className="flex items-center gap-1">
                                <span className="font-bold text-gray-700">Y:</span>
                                <input type="number" className="w-16 p-1 border rounded bg-gray-50 text-right" value={coords.y} onChange={(e) => setCoords({...coords, y: parseFloat(e.target.value) || 0})} />
                             </div>
                        </div>
                    </div>
                    {recommendedCoords && (
                        <p className="text-xs text-green-600 text-right mt-1 cursor-pointer hover:underline" onClick={() => setCoords(recommendedCoords)}>
                            Usar recomendación: ({recommendedCoords.x}, {recommendedCoords.y})
                        </p>
                    )}
                </div>
            )}

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button variant="primary" onClick={submitAssign} disabled={!parcelaId}>
                Confirmar Asignación
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default IoTModuleManager;