// src/pages/FieldDetails.jsx → VERSIÓN DEPURACIÓN (DEBUG)

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Camera, Thermometer, Droplet, FlaskConical, 
  CheckCircle2, XCircle, Loader 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { api } from '../api/apiClient';
import useAuth from '../hooks/useAuth';
import FarmerHeader from '../components/farmer/FarmerHeader';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import AlertBanner from '../components/farmer/AlertBanner';

// --- FUNCIÓN AUXILIAR CON LOGS DE DEPURACIÓN ---
const derToRs = (hexSignature) => {
    console.log(`🔍 [DER] Iniciando conversión. Hex: ${hexSignature?.slice(0, 20)}... Longitud: ${hexSignature?.length}`);
    try {
        if (!hexSignature) return null;

        // 1. Hex a Bytes
        const match = hexSignature.match(/[\da-f]{2}/gi);
        if (!match) throw new Error("Formato hex inválido");
        const der = new Uint8Array(match.map(h => parseInt(h, 16)));

        console.log(`🔍 [DER] Buffer DER creado. Bytes: ${der.length}. Header: 0x${der[0].toString(16)}`);

        let offset = 0;
        if (der[offset++] !== 0x30) throw new Error("Cabecera DER incorrecta (no es 0x30)");

        // Longitud secuencia
        let len = der[offset++];
        if (len & 0x80) {
            const nBytes = len & 0x7f;
            offset += nBytes;
        }

        // Helper para leer enteros
        const getBigInteger = (name) => {
            if (der[offset++] !== 0x02) throw new Error(`Tag incorrecto para ${name} (no es 0x02)`);
            let length = der[offset++];
            
            console.log(`🔍 [DER] ${name} longitud cruda: ${length}`);
            
            let bytes = der.slice(offset, offset + length);
            offset += length;

            // Quitar padding 0x00 inicial si sobra
            while (bytes.length > 32 && bytes[0] === 0x00) {
                bytes = bytes.slice(1);
            }

            // Rellenar con ceros si falta
            if (bytes.length < 32) {
                console.log(`🔍 [DER] Rellenando ${name} con ceros...`);
                const padded = new Uint8Array(32);
                padded.set(bytes, 32 - bytes.length);
                bytes = padded;
            }

            console.log(`🔍 [DER] ${name} final (32 bytes):`, bytes);
            return bytes;
        };

        const r = getBigInteger("R");
        const s = getBigInteger("S");

        // Concatenar
        const rsSignature = new Uint8Array(64);
        rsSignature.set(r, 0);
        rsSignature.set(s, 32);

        console.log("🔍 [DER] Conversión exitosa. Retornando 64 bytes.");
        return rsSignature;

    } catch (e) {
        console.error("❌ [DER] Error parseando:", e.message);
        return null;
    }
};

const FieldDetails = () => {
  const { id } = useParams();
  const { auth } = useAuth();

  const [cycleData, setCycleData] = useState(null);
  const [parcelaInfo, setParcelaInfo] = useState(null);
  const [publicKey, setPublicKey] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verifiedStatuses, setVerifiedStatuses] = useState({});

  // 1. OBTENER CLAVE PÚBLICA
  useEffect(() => {
    const fetchPublicKey = async () => {
      try {
        const res = await api.get('/parcela/public-key');
        console.log("🔍 [Key] Respuesta API Public Key:", res);
        const key = res.data?.publicKey || res.publicKey;
        
        if (key) {
          console.log("🔍 [Key] Clave encontrada:", key.slice(0, 50) + "...");
          setPublicKey(key);
        } else {
          console.error("❌ [Key] No se encontró publicKey en la respuesta.");
          setError('Error de servidor: Clave pública no disponible');
        }
      } catch (err) {
        console.error('❌ [Key] Error fetching:', err);
        setError('No se pudo cargar la clave pública');
      }
    };

    fetchPublicKey();
  }, []);

  // 2. VERIFICAR FIRMA
  const verifySignature = async (url, signatureHex) => {
    console.log(`🔍 [Verify] Iniciando para URL: ${url}`);
    
    if (!url || !signatureHex || !publicKey) {
        console.warn("🔍 [Verify] Faltan datos para verificar.");
        return null; 
    }

    try {
      // Limpieza PEM
      const cleanPem = publicKey
        .replace(/-----BEGIN PUBLIC KEY-----/g, '')
        .replace(/-----END PUBLIC KEY-----/g, '')
        .replace(/[\n\r\s]/g, '');
      
      console.log(`🔍 [Verify] PEM limpio (primero 20 chars): ${cleanPem.slice(0, 20)}...`);

      const binaryDer = Uint8Array.from(atob(cleanPem), c => c.charCodeAt(0));
      
      // Importar clave
      console.log("🔍 [Verify] Importando clave a Web Crypto...");
      const key = await crypto.subtle.importKey(
        'spki',
        binaryDer,
        { name: 'ECDSA', namedCurve: 'P-256' },
        true,
        ['verify']
      );
      console.log("🔍 [Verify] Clave importada correctamente:", key);

      // Preparar datos
      const data = new TextEncoder().encode(url);
      const signature = derToRs(signatureHex);
      
      if (!signature || signature.length !== 64) {
          console.error(`❌ [Verify] Firma convertida tiene longitud incorrecta: ${signature?.length}`);
          return false;
      }

      console.log("🔍 [Verify] Ejecutando crypto.subtle.verify...");
      const isValid = await crypto.subtle.verify(
        { name: 'ECDSA', hash: { name: 'SHA-256' } },
        key,
        signature,
        data
      );

      console.log(`🔍 [Verify] Resultado: ${isValid ? "VÁLIDO ✅" : "INVÁLIDO ❌"}`);
      return isValid;

    } catch (err) {
      console.error('❌ [Verify] Excepción:', err);
      console.error('❌ [Verify] Mensaje:', err.message);
      console.error('❌ [Verify] Nombre:', err.name);
      return false;
    }
  };

  // 3. CARGAR DATOS
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.post('/parcela/dataParcela', { idParcela: Number(id) });
        setCycleData(res.data?.data || res.data);

        const parcelasRes = await api.get('/parcela/getParcelasUser');
        const list = parcelasRes.data?.parcelas || parcelasRes.parcelas || [];
        const found = list.find(p => p.id_parcela === Number(id));
        setParcelaInfo(found || { nombre: 'Mi Parcela' });
      } catch (err) {
        console.error(err);
        setError('Error al cargar los datos de la parcela');
      } finally {
        setLoading(false);
      }
    };

    if (auth?.accessToken) fetchData();
  }, [id, auth]);

  // 4. PROCESAR VERIFICACIONES
  useEffect(() => {
    if (!cycleData?.stages || !publicKey) return;

    const current = cycleData.stages[cycleData.current_stage_index];
    const readingsToVerify = current.readings.filter(r => r.imagen && r.image_signature);

    console.log(`🔍 [Effect] Encontradas ${readingsToVerify.length} lecturas con firma para verificar.`);

    const runVerifications = async () => {
        const updates = {};
        
        await Promise.all(readingsToVerify.map(async (reading) => {
            const key = `${reading.hora}-${reading.imagen}`;
            if (verifiedStatuses[key] === undefined) {
                const isValid = await verifySignature(reading.imagen, reading.image_signature);
                updates[key] = isValid;
            }
        }));
        
        if (Object.keys(updates).length > 0) {
            setVerifiedStatuses(prev => ({ ...prev, ...updates }));
        }
    };

    runVerifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycleData, publicKey]); 

  const renderVerificationIcon = (reading) => {
      const key = `${reading.hora}-${reading.imagen}`;
      const status = verifiedStatuses[key];

      if (!reading.imagen) return null;

      if (status === undefined || status === null) {
          return <Loader className="w-5 h-5 text-yellow-500 animate-spin" title="Verificando..." />; 
      }
      if (status === true) {
          return <CheckCircle2 className="w-5 h-5 text-green-500" title="Verificada: Imagen auténtica" />;
      }
      if (status === false) {
          return <XCircle className="w-5 h-5 text-red-600" title="Error: Firma inválida" />;
      }
      return null;
  };

  if (loading && !cycleData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl font-medium text-green-800 flex gap-3 items-center">
          <Loader className="animate-spin" /> Cargando parcela...
        </div>
      </div>
    );
  }

  if (error || !cycleData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-3xl text-red-600 font-bold">{error || 'Error crítico'}</div>
      </div>
    );
  }

  const currentStage = cycleData.stages[cycleData.current_stage_index];
  const lastSixReadings = currentStage.readings.slice(-6).reverse();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <FarmerHeader />

      <section className="bg-gradient-to-b from-green-800 to-green-900 text-white py-16">
        <div className="container-main">
          <Link to="/farmer" className="inline-flex items-center gap-2 text-white hover:text-green-200 mb-6">
            <ArrowLeft className="w-5 h-5" /> Volver al Dashboard
          </Link>
          <h1 className="text-5xl font-bold mb-4">{parcelaInfo?.nombre}</h1>
          <p className="text-2xl opacity-90">{cycleData.cultivo_name} • Ciclo #{cycleData.ciclo_num}</p>
          <p className="text-xl mt-2">Etapa actual: <strong>{currentStage.stage_name}</strong></p>
          <div className="mt-4 inline-flex items-center gap-2 bg-green-600 px-4 py-2 rounded-full text-sm font-bold">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            Conexión segura en vivo
          </div>
        </div>
      </section>

      <main className="flex-1 container-main py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Camera className="w-8 h-8 text-green-700" /> Últimas Fotos y Trazabilidad Blockchain
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lastSixReadings.map((reading, idx) => (
            <div key={idx} className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-500">
                  {new Date(reading.hora).toLocaleString('es-ES')}
                </span>
                {renderVerificationIcon(reading)} 
              </div>
              
              {reading.imagen ? (
                <div className="h-48 bg-gray-200 flex items-center justify-center rounded overflow-hidden mb-3 relative">
                    <img 
                      src={reading.imagen} 
                      alt="Lectura IoT" 
                      className="w-full h-full object-cover"
                      onError={(e) => {e.target.style.display = 'none';}}
                    />
                </div>
              ) : (
                <div className="h-48 bg-gray-100 flex items-center justify-center rounded overflow-hidden mb-3">
                    <span className="text-gray-400">Sin Imagen</span>
                </div>
              )}

              <div className="mt-2 space-y-1">
                <p className="text-xs font-bold text-gray-500 uppercase">Sensores</p>
                {reading.sensores.map(s => (
                  <div key={s.id_sensor} className="flex justify-between text-sm">
                    <span className="text-gray-700">{s.nombre}:</span>
                    <span className={`font-medium ${
                      s.status === 'alto' || s.status === 'bajo' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {s.lectura} {s.unidad_medicion || s.unidad}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center py-10">
          <Link to="/farmer">
            <Button variant="primary" size="lg" className="px-16 py-5 text-xl shadow-xl">
              Volver al Dashboard
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FieldDetails;